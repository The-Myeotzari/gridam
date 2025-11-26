import { PDFDocument, rgb } from 'pdf-lib'
import { Diary } from '@/features/mypage/types/mypage'
import { getFormatDate } from '@/shared/utils/get-format-date'
import fontkit from '@pdf-lib/fontkit'
import { readFile } from 'fs/promises'
import sharp from 'sharp'
import path from 'path'

export async function createMonthlyDiaryPdf(params: { diaries: Diary[] }) {
  const { diaries } = params

  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)
  const fontBytes = await fetch(
    'https://oddatelier.net/wp-content/uploads/2025/09/ZEN-SERIF-Regular.otf'
  ).then((res) => res.arrayBuffer())
  
  const font = await pdfDoc.embedFont(fontBytes)

  // A4 사이즈
  const pageWidth = 595.28 // pt
  const pageHeight = 841.89
  const marginX = 40
  const marginTop = 50
  const marginBottom = 50

  // 📄 각 일기 → 한 페이지
  for (const diary of diaries) {
    const page = pdfDoc.addPage([pageWidth, pageHeight])
    const { width, height } = page.getSize()

    // 1. 헤더 (날짜 + 날씨 + 이모지)
    const headerText = getFormatDate(diary.date)
    const weatherIconPath = diary.emoji
    let weatherIcon = null
    if (weatherIconPath) {
      const iconPath = path.join(process.cwd(), `public/${weatherIconPath}`)
      const weatherIconBytes = await readFile(iconPath)
      const pngBuffer = await sharp(weatherIconBytes).png().toBuffer()
      weatherIcon = await pdfDoc.embedPng(pngBuffer)
    }

    if (weatherIcon) {
      page.drawImage(weatherIcon, {
        x: width - (marginX * 2),
        y: height - marginTop - 15,
        width: 40,
        height: 40,
      })
    }

    page.drawText(headerText, {
      x: marginX,
      y: height - marginTop,
      size: 14,
      font,
      color: rgb(0.2, 0.2, 0.2),
    })

    // 2. 그림 영역 (위 가운데에 크게)
    const drawingTop = height - marginTop - 40
    const drawingHeight = 300
    const drawingWidth = width - marginX * 2

    if (diary.image_url) {
      try {
        const imgRes = await fetch(diary.image_url)
        const imgBuf = await imgRes.arrayBuffer()
        // PNG / JPG 둘 다 대응
        let embedded
        try {
          embedded = await pdfDoc.embedPng(imgBuf)
        } catch {
          embedded = await pdfDoc.embedJpg(imgBuf)
        }

        const imgDim = embedded.scale(1)
        // 비율 유지하면서 영역 안에 맞추기
        const scale = Math.min(drawingWidth / imgDim.width, drawingHeight / imgDim.height, 1)

        const drawW = imgDim.width * scale
        const drawH = imgDim.height * scale

        const x = marginX + (drawingWidth - drawW) / 2
        const y = drawingTop - drawH

        page.drawImage(embedded, {
          x,
          y,
          width: drawW,
          height: drawH,
        })

        page.drawRectangle({
          x: marginX,
          y,
          width: drawingWidth,
          height: drawH,
          borderColor: rgb(0.93, 0.9, 0.87),
          borderWidth: 1,
        })

      } catch (e) {
        // 이미지 깨져도 PDF 전체가 망가지진 않도록 무시
        console.error('embed image error', e)
      }
    } else {
      // 그림 없는 경우 빈 박스만
      page.drawRectangle({
        x: marginX,
        y: drawingTop - drawingHeight,
        width: drawingWidth,
        height: drawingHeight,
        borderColor: rgb(0.93, 0.9, 0.87),
        borderWidth: 1,
      })
    }

    // 3. 원고지 느낌 텍스트 박스

    const textBoxTop = drawingTop - drawingHeight - 30
    const textBoxHeight = height - textBoxTop - marginBottom
    const textBoxWidth = width - marginX * 2
    const rows = 10
    const cols = 20

    const cellWidth = textBoxWidth / cols
    const cellHeight = textBoxHeight / rows

    // 테두리
    page.drawRectangle({
      x: marginX,
      y: marginBottom,
      width: textBoxWidth,
      height: textBoxHeight,
      color: rgb(1, 0.99, 0.98),
      borderColor: rgb(0.93, 0.9, 0.87),
      borderWidth: 1,
    })

    // 세로선
    for (let c = 1; c < cols; c++) {
      const x = marginX + cellWidth * c
      page.drawLine({
        start: { x, y: marginBottom },
        end: { x, y: marginBottom + textBoxHeight },
        color: rgb(0.93, 0.9, 0.87),
        thickness: 0.5,
      })
    }

    // 가로선
    for (let r = 1; r < rows; r++) {
      const y = marginBottom + cellHeight * r
      page.drawLine({
        start: { x: marginX, y },
        end: { x: marginX + textBoxWidth, y },
        color: rgb(0.93, 0.9, 0.87),
        thickness: 0.5,
      })
    }

    // 텍스트를 한 글자씩 셀에 박기
    const content = (diary.content ?? '').replace(/\r\n/g, '\n')
    const chars = Array.from(content) // 한글 포함
    let charIndex = 0

    for (let r = rows - 1; r >= 0; r--) {
      for (let c = 0; c < cols; c++) {
        if (charIndex >= chars.length) break
        const ch = chars[charIndex++]

        const x = marginX + cellWidth * c + cellWidth / 2 - font.widthOfTextAtSize(ch, 10) / 2
        const y = marginBottom + cellHeight * r + cellHeight / 2 - 10 / 2

        page.drawText(ch, {
          x,
          y,
          size: 10,
          font,
          color: rgb(0.2, 0.2, 0.2),
        })
      }
      if (charIndex >= chars.length) break
    }
  }

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
