import DiaryExportCardContainer from '@/features/mypage/components/export/diary-export-container'

// 예시: 서버에서 유저 기준 기본 연/월 + 해당 월 일기 수를 가져온다고 가정
export default async function DiaryExportSection() {
  const now = new Date()
  const initialYear = now.getFullYear()
  const initialMonth = now.getMonth() + 1

  // TODO: 서버에서 initialYear/initialMonth 기준 일기 개수 조회
  const initialDiaryCount = 0

  // 여기서는 그냥 클라 컴포넌트에 초기값만 넘겨줌
  return (
    <DiaryExportCardContainer
      initialYear={initialYear}
      initialMonth={initialMonth}
      initialDiaryCount={initialDiaryCount}
    />
  )
}