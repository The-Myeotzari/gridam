export type DiarySearchParams = {
  [key: string]: string | string[] | undefined
  year?: string
  month?: string
}

// 날짜 문자열로 반환
export const getCurrentYearMonth = () => {
  const now = new Date()
  return {
    year: now.getFullYear().toString(),
    month: (now.getMonth() + 1).toString(),
  }
}

// searchParams 기준으로 최종 year/month 결정 (문자열)
export const resolveYearMonth = (params: DiarySearchParams) => {
  const { year: rawYear, month: rawMonth } = params
  const { year: currentYear, month: currentMonth } = getCurrentYearMonth()

  const year = typeof rawYear === 'string' && rawYear.trim() !== '' ? rawYear : currentYear
  const month = typeof rawMonth === 'string' && rawMonth.trim() !== '' ? rawMonth : currentMonth

  return { year, month }
}

//  searchParams 기준으로 최종 year/month 결정 (숫자)
export const resolveYearMonthFromStrings = (year?: string, month?: string) => {
  const { year: currentYear, month: currentMonth } = getCurrentYearMonth()

  const resolvedYear = year && year.trim() !== '' ? year : currentYear
  const resolvedMonth = month && month.trim() !== '' ? month : currentMonth

  return {
    year: Number(resolvedYear),
    month: Number(resolvedMonth),
  }
}

// 기준 year, month에서 -1/+1 연/월 필터링
export const getAdjacentMonth = (year: number, month: number, offset: number) => {
  const date = new Date(year, month - 1 + offset, 1)

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date,
  }
}

export const formatYearMonth = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`
