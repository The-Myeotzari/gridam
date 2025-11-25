'use client'
import { MESSAGES } from '@/shared/constants/messages'
import ClientButton from '@/shared/ui/client-button'
import { toast } from '@/store/toast-store'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

// TODO: 개발 완료 이후 상수화 필요
type Props = {
  todayDiaryStatus: 'published' | 'draft' | 'none'
}

export default function FeedWriteBtn({ todayDiaryStatus }: Props) {
  const router = useRouter()

  const handleClick = () => {
    if (todayDiaryStatus === 'published') {
      toast.error(MESSAGES.DIARY.ERROR.PUBLISHED)
      return
    }

    if (todayDiaryStatus === 'draft') {
      toast.error(MESSAGES.DIARY.ERROR.DRAFT)
      router.push(`/draft`)
      return
    }

    router.push('/write')
  }

  return (
    <ClientButton
      onClick={handleClick}
      size="lg"
      className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:scale-110 transition-all"
      label={<Plus className="w-8 h-8" />}
    />
  )
}
