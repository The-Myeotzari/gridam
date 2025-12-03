import { getUserData } from "@/app/(main)/mypage/action";
import DiaryExportSection from "@/features/mypage/components/export/diary-export-section";
import MyStats from "@/features/mypage/components/my-stats";
import MyPageButtons from "@/features/mypage/components/mypage-buttons";
import MyPageHeader from "@/features/mypage/components/mypage-header";
import ProfileCard from "@/features/mypage/components/profile-card";
import RecentDiaries from "@/features/mypage/components/recent-diaries";
import { MESSAGES } from "@/shared/constants/messages";

export default async function MyPage() {
  const res = await getUserData()

  if (!res.ok) {
    throw new Error(MESSAGES.MYPAGE.ERROR.READ)
  }

  const { user, stats, recentDiaries } = res.data

  return (
    <div className="w-full lg:max-w-3/4 lg:mx-auto flex flex-col gap-6 font-bold items-center">
      <MyPageHeader />
      <ProfileCard email={user.email} nickname={user.nickname} createdAt={user.created_at} />
      <MyStats totalDays={stats.totalDays} totalDiaries={stats.totalDiaries} />
      <DiaryExportSection />
      <RecentDiaries diaries={recentDiaries} />
      <MyPageButtons isOAuth={user.isOAuth}/>
    </div>
  )
}