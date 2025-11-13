import Button from '@/components/ui/button'
import FeedCard from '@/features/feed/components/feed-card'
import Month from '@/features/feed/components/month'
import { Plus } from 'lucide-react'
import Link from 'next/link'

type props = {
  searchParams?: {
    [key: string]: string | string[] | undefined
    year?: string
    month?: string
  }
}

export default async function Home({ searchParams }: props) {
  const params = await searchParams // 반드시 await 필요!

  const year = typeof params?.year === 'string' ? params.year : '2000'
  const month = typeof params?.month === 'string' ? params.month : '02'

  return (
    <div className="flex flex-col gap-4 p-4 mt-10 text-center">
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="font-handwritten text-4xl mb-2 text-navy-gray">오늘의 이야기들</h1>
        <p className="font-handwritten text-xl text-muted-foreground">
          모두의 하루를 담은 그림 일기
        </p>
      </div>

      <Month year={year} month={month} />

      <FeedCard />

      <Link href="/write">
        <Button
          size="lg"
          className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:scale-110 transition-all"
          label={<Plus className="w-8 h-8" />}
        />
      </Link>
    </div>
  )
}
