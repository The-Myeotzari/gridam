import Button from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4 mt-10 text-center">
      메인페이지 입니다.
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
