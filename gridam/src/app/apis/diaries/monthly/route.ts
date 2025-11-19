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
        fail('year와 month 쿼리 파라미터가 필요합니다.', 400),
      )
    }

    const year = Number(yearParam)
    const month = Number(monthParam)

    if (!Number.isInteger(year) || !Number.isInteger(month)) {
      return withCORS(
        fail('year와 month는 정수여야 합니다.', 400),
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
        fail('유효하지 않은 연/월입니다.', 400 ),
      )
    }

    return withCORS(
      fail('월별 일기 조회 중 오류가 발생했습니다.', 500),
    )
  }
}