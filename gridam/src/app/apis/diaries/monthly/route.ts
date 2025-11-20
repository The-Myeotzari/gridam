import { NextRequest } from "next/server"
import { fail, ok, withCORS } from "@/app/apis/_lib/http"
import { getMonthlyDiaries } from "@/features/mypage/api/get-monthly-diary.api"
import { MESSAGES } from "@/shared/constants/messages"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')

    if (!yearParam || !monthParam) {
      return withCORS(
        fail(MESSAGES.DIARY.ERROR.EXPORT_INVALID_DATA, 400),
      )
    }

    const year = Number(yearParam)
    const month = Number(monthParam)

    if (!Number.isInteger(year) || !Number.isInteger(month)) {
      return withCORS(
        fail(MESSAGES.DIARY.ERROR.EXPORT_INVALID_DATA, 400),
      )
    }

    const result = await getMonthlyDiaries({ year, month })

    return withCORS(ok(result))
  } catch (error) {
    console.error('[GET /apis/diaries/month] error', error)

    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return withCORS(
        fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401),
      )
    }

    if (error instanceof Error && error.message === 'INVALID_YEAR_MONTH') {
      return withCORS(
        fail(MESSAGES.DIARY.ERROR.EXPORT_INVALID_DATA, 400),
      )
    }

    return withCORS(
      fail(MESSAGES.DIARY.ERROR.READ, 500),
    )
  }
}