import { getUserData } from "@/features/mypage/api/mypage.api";
import DiaryExportSection from "@/features/mypage/components/export/diary-export-section";
import MyStats from "@/features/mypage/components/my-stats";
import MyPageButtons from "@/features/mypage/components/mypage-buttons";
import MyPageHeader from "@/features/mypage/components/mypage-header";
import ProfileCard from "@/features/mypage/components/profile-card";
import RecentDiaries from "@/features/mypage/components/recent-diaries";

export default async function MyPage() {
  const res = await getUserData()

  // 간단한 에러 화면 or 에러 컴포넌트
  if (!res.ok || !res.data) {
    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold">마이페이지를 불러오는 중 오류가 발생했어요.</p>
        <p className="text-sm text-gray-500">{res.message}</p>
      </div>
    )
  }

  const { user, stats, recentDiaries } = res.data

  return (
    <div className="w-full lg:max-w-3/4 lg:mx-auto flex flex-col gap-6 font-bold items-center">
      <MyPageHeader />
      <ProfileCard email={user.email} nickname={user.nickname} createdAt={user.created_at} />
      <MyStats totalDays={stats.totalDays} totalDiaries={stats.totalDiaries} />
      <DiaryExportSection />
      <RecentDiaries diaries={recentDiaries} />
      <MyPageButtons />
    </div>
  )
}