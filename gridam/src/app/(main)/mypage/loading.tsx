'use client'

export default function MyPageLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-10 space-y-10">
      <div className="flex flex-col items-center gap-2 pt-6">
        {/* TODO: 로딩 스피너 적용 예정 */}
        <p className="text-muted-foreground text-sm animate-pulse">
          마이페이지 정보를 불러오는 중입니다…
        </p>
      </div>
    </div>
  )
}