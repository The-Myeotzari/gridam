import { getUserData } from "@/app/(main)/mypage/action";
import DiaryExportSection from "@/features/mypage/components/export/diary-export-section";
import MyStats from "@/features/mypage/components/my-stats";
import MyPageButtons from "@/features/mypage/components/mypage-buttons";
import MyPageHeader from "@/features/mypage/components/mypage-header";
import ProfileCard from "@/features/mypage/components/profile-card";
import RecentDiaries from "@/features/mypage/components/recent-diaries";
import { MESSAGES } from "@/shared/constants/messages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: '마이페이지 | Gridam',
  description:
    '내 일기 기록과 통계, 프로필, 월별 내보내기를 한 곳에서 관리하는 마이페이지입니다.',
  robots: {
    index: false, // 검색 노출 X
    follow: false,
  },
}

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