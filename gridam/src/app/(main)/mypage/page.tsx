import MyStats from "@/features/mypage/components/my-stats";
import MyPageActions from "@/features/mypage/components/mypage-actions";
import ProfileCard from "@/features/mypage/components/profile-card";
import RecentDiaries from "@/features/mypage/components/recent-diaries";
import { Sun } from 'lucide-react'

export default function MyPage() {
  // TODO: 추후 API 연동 시 여기서 서버 컴포넌트 / 클라이언트 훅으로 데이터 가져오기
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
      <section className="text-center font-bold">
        <h1 className="text-3xl mb-2">마이페이지</h1>
        <h2 className="text-muted-foreground">나의 그림 일기 공간</h2>
      </section>
      <ProfileCard email={user.email} nickname={user.nickname} createdAt={user.createdAt} />
      <MyStats totalDays={stats.totalDays} totalDiaries={stats.totalDiaries}/>
      <RecentDiaries diaries={recentDiaries}/>
      <MyPageActions/>
    </div>
  )
}