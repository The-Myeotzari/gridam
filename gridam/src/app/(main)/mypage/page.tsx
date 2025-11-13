import MyStats from "@/features/mypage/components/my-stats";
import MyPageActions from "@/features/mypage/components/mypage-actions";
import MyPageHeader from "@/features/mypage/components/mypage-header";
import ProfileCard from "@/features/mypage/components/profile-card";
import RecentDiaries from "@/features/mypage/components/recent-diaries";
import { Sun } from 'lucide-react'

export default function MyPage() {
  // TODO: 추후 API 연동 필요
  const user = {
    email: 'asd@gridam.com',
    nickname: 'Gridam',
    createdAt: '2025.11.13',
  }

  const stats = {
    totalDiaries: 3,
    totalDays: 3,
  }

  const recentDiaries = [
    {
      id: '1',
      date: '2025.11.13',
      weekday: '목요일',
      time: '13:09',
      content: '내용',
      weatherIcon: <Sun />, // 일기 emoji 사용
    },
  ]

  return (
    <div className="w-full lg:max-w-3/4 lg:mx-auto flex flex-col gap-6 font-bold items-center">
      <MyPageHeader/>
      <ProfileCard email={user.email} nickname={user.nickname} createdAt={user.createdAt} />
      <MyStats totalDays={stats.totalDays} totalDiaries={stats.totalDiaries}/>
      <RecentDiaries diaries={recentDiaries}/>
      <MyPageActions/>
    </div>
  )
}