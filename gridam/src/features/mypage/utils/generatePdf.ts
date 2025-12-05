import { Diary } from '@/features/mypage/types/mypage'
import { getFormatDate } from '@/shared/utils/date'
import fontkit from '@pdf-lib/fontkit'
import { readFile } from 'fs/promises'
import path from 'path'
import { PDFDocument, rgb } from 'pdf-lib'
import sharp from 'sharp'

let FONT_BYTES_CACHE: Uint8Array | null = null
const WEATHER_ICON_CACHE = new Map<string, Buffer>()

async function loadFontBytes() {
  if (FONT_BYTES_CACHE) return FONT_BYTES_CACHE

  const fontPath = path.join(process.cwd(), 'public/font/ZEN-SERIF-TTF-Regular.woff2')
  const bytes = await readFile(fontPath)

  FONT_BYTES_CACHE = bytes
  return bytes
}

async function loadWeatherIconPngBytes(weatherIconPath: string) {
  const cached = WEATHER_ICON_CACHE.get(weatherIconPath)
  if (cached) return cached

  const iconPath = path.join(process.cwd(), `public/${weatherIconPath}`)
  const weatherIconBytes = await readFile(iconPath)

  // 아이콘은 한 번만 변환
  const pngBuffer = await sharp(weatherIconBytes).png().toBuffer()

  WEATHER_ICON_CACHE.set(weatherIconPath, pngBuffer)
  return pngBuffer
}

export async function createMonthlyDiaryPdf(params: { diaries: Diary[] }) {
  const { diaries } = params

  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)

  const fontBytes = await loadFontBytes()
  const font = await pdfDoc.embedFont(fontBytes)

  // A4 사이즈
  const pageWidth = 595.28 // pt
  const pageHeight = 841.89
  const marginX = 40
  const marginTop = 50
  const marginBottom = 50

  // 일기 이미지: 네트워크 fetch만 미리 병렬로 수행
  const diaryImageBuffers = await Promise.all(
    diaries.map(async (diary) => {
      if (!diary.image_url) return null

      try {
        const res = await fetch(diary.image_url)
        if (!res.ok) return null

        const buf = Buffer.from(await res.arrayBuffer())
        const img = sharp(buf)
        const meta = await img.metadata()

        // 작은 이미지면 그냥 원본 그대로 쓰기
        if (
          (meta.width ?? 0) <= 800 &&
          (meta.height ?? 0) <= 900 &&
          (meta.size ?? 0) < 200 * 1024 // 200KB 이하 같은
        ) {
          return buf
        }

        const resized = await img
          .resize(800, 900, { fit: 'inside', withoutEnlargement: true })
          .png()
          .toBuffer()

        return resized
      } catch (e) {
        console.error('fetch diary image error', e)
        return null
      }
    })
  )

  // 각 일기 → 한 페이지
  for (let i = 0; i < diaries.length; i++) {
    const diary = diaries[i]
    const page = pdfDoc.addPage([pageWidth, pageHeight])
    const { width, height } = page.getSize()

    // 1. 헤더 (날짜 + 날씨)
    const headerText = getFormatDate(diary.date)

    if (diary.emoji) {
      try {
        const pngBytes = await loadWeatherIconPngBytes(diary.emoji)
        const weatherIcon = await pdfDoc.embedPng(pngBytes)

        page.drawImage(weatherIcon, {
          x: width - marginX * 2,
          y: height - marginTop - 15,
          width: 40,
          height: 40,
        })
      } catch (e) {
        console.error('weather icon error', e)
      }
    }

    page.drawText(headerText, {
      x: marginX,
      y: height - marginTop,
      size: 14,
      font,
      color: rgb(0.2, 0.2, 0.2),
    })

    // 2. 그림 영역
    const drawingTop = height - marginTop - 40
    const drawingHeight = 300
    const drawingWidth = width - marginX * 2

    const imageBuffer = diaryImageBuffers[i]

    if (imageBuffer) {
      try {
        const embedded = await pdfDoc.embedPng(imageBuffer)
        const imgDim = embedded.scale(1)

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
        console.error('embed diary image error', e)
      }
    } else {
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
