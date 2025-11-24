import { NextRequest, NextResponse } from 'next/server'
import { fail } from '@/app/apis/_lib/http'
import { getMonthlyDiaries } from '@/features/mypage/api/get-monthly-diary.api'
import { createMonthlyDiaryPdf } from '@/features/mypage/utils/generatePdf'
import { MESSAGES } from '@/shared/constants/messages'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')

    if (!yearParam || !monthParam) {
      return fail(MESSAGES.DIARY.ERROR.EXPORT_INVALID_DATA, 400)
    }

    const year = Number(yearParam)
    const month = Number(monthParam)

    if (!Number.isInteger(year) || !Number.isInteger(month)) {
      return fail(MESSAGES.DIARY.ERROR.EXPORT_INVALID_DATA, 400)
    }

    const monthly = await getMonthlyDiaries({ year, month })

    const pdfBytes = await createMonthlyDiaryPdf({ diaries: monthly.diaries })

    const filename = `Diaries(${year}-${String(month).padStart(2, '0')}).pdf`

    return new NextResponse(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)
    }

    return fail(MESSAGES.DIARY.ERROR.EXPORT, 500)
  }
}
