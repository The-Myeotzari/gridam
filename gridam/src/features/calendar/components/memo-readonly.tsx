import { URL_CONSTANTS } from '@/shared/constants/url.constants'
import { Card } from '@/shared/ui/card'
import { FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CalendarMemoListProps } from './calendar-memo-list'
export default function MemoReadOnly({ memos }: CalendarMemoListProps) {
  const router = useRouter()

  return (
    <div className="flex-1 flex justify-center py-3">
      <div className="flex flex-col gap-3 w-full ">
        {memos.map((memo) => (
          <Card
            key={memo.id}
            className="flex flex-col gap-5 cursor-pointer p-3 hover:bg-accent/50 transition-colors"
            onClick={() => {
              router.push(`${URL_CONSTANTS.MEMO.BY_ID(memo.id)}`)
            }}
          >
            <div className="flex gap-2">
              <FileText className="w-4 h-4 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-foreground truncate">{memo.title}</p>
                <div className="text-sm text-muted-foreground line-clamp-1 ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{memo.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
