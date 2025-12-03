'use client'
import { useDiaryStatusStore } from '@/features/feed/store/diary-status-store'
import { MESSAGES } from '@/shared/constants/messages'
import ClientButton from '@/shared/ui/client-button'
import { toast } from '@/store/toast-store'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function FeedWriteBtn() {
  const status = useDiaryStatusStore((s) => s.status)
  const router = useRouter()

  const handleClick = () => {
    if (status === 'published') {
      toast.error(MESSAGES.DIARY.ERROR.PUBLISHED)
      return
    }

    if (status === 'draft') {
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
