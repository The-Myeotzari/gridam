'use client'

import { useToast } from '@/store/useToast'
import type { Toast } from '@/utils/type'
import { AlertCircleIcon, CheckCircle2Icon } from 'lucide-react'
import { Card, CardBody } from './card'

export default function Toast() {
  const { items } = useToast()

  return (
    // 토스트 전체 컨테이너 (화면 우측 하단 고정)
    <div className="fixed bottom-6 right-1 md:right-6 z-9999 space-y-3">
      {items.map((t: Toast) => (
        // 개별 토스트 카드
        <Card key={t.id} className="bg-cream-white">
          <CardBody className="flex items-center gap-2">
            {t.type === 'success' ? (
              <CheckCircle2Icon className="size-6 text-white fill-black" />
            ) : (
              <AlertCircleIcon className="size-6 text-white fill-black" />
            )}
            {/* 메시지 텍스트 */}
            <span className="text-sm">{t.message}</span>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
