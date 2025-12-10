'use client'

export const weekday = ['일', '월', '화', '수', '목', '금', '토']

type CalendarCell = {
  year: number
  month: number
  day: number
  inCurrentMonth: boolean
}

export default function buildCalendar(year: number, month: number) {
  // 외부에서 1~12로 들어온 월을 0~11로 변환
  month = month - 1

  // 이번 달 달력 만들기 - 이번 달 1일, 요일, 이번달 총 일수
  const firstDay = new Date(year, month, 1)
  const firstDayOfWeek = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // 지난 달 정보
  const prevMonthDate = new Date(year, month, 0) // 지난달 마지막 날
  const daysInPrevMonth = prevMonthDate.getDate()

  // 달력 만들기
  const totalCells = 42
  const cells: CalendarCell[] = []

  for (let i = 0; i < totalCells; i++) {
    const cellIndex = i
    let cellYear = year
    let cellMonth = month // cellMonth도 0~11 기준
    let cellDay: number
    let inCurrentMonth = true

    //달력 앞 부분- 지난달 날짜로 채우기
    if (cellIndex < firstDayOfWeek) {
      cellDay = daysInPrevMonth - firstDayOfWeek + cellIndex + 1
      inCurrentMonth = false

      // 지난달로 이동 (0~11 기준)
      if (month === 0) {
        cellMonth = 11
        cellYear = year - 1
      } else {
        cellMonth = month - 1
      }
    } else if (cellIndex >= firstDayOfWeek + daysInMonth) {
      const nextIndex = cellIndex - (firstDayOfWeek + daysInMonth)
      cellDay = nextIndex + 1
      inCurrentMonth = false
      // 다음달로 이동 (0~11 기준)
      if (month === 11) {
        cellMonth = 0
        cellYear = year + 1
      } else {
        cellMonth = month + 1
      }
    } else {
      // 이번 달 날짜
      cellDay = cellIndex - firstDayOfWeek + 1
      inCurrentMonth = true
    }
    cells.push({
      year: cellYear,
      // 0~11로 계산된 cellMonth를 다시 1~12로 변환하여 외부로 반환
      month: cellMonth + 1,
      day: cellDay,
      inCurrentMonth,
    })
  }
  return cells
}
