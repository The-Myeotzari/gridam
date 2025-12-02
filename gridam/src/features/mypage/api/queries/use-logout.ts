'use client'

import { MESSAGES } from '@/shared/constants/messages'
import { QUERY_KEYS } from '@/shared/constants/query-key'
import { toast } from '@/store/toast-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: QUERY_KEYS.AUTH.LOGOUT,
    mutationFn: async () => {
      const res = await fetch('/apis/auth/logout', { method: 'POST' })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)

        throw new Error(errorData?.message ?? MESSAGES.AUTH.ERROR.LOGOUT)
      }

      return res.json()
    },
    onSuccess: () => {
      // 유저 관련 캐시 비우고 싶으면
      toast.success(MESSAGES.AUTH.SUCCESS.LOGOUT)
      router.push('/login')
      router.refresh()
      queryClient.clear()
    },
    onError: (err) => {
      const message = err.message ?? MESSAGES.AUTH.ERROR.LOGOUT
      toast.error(message)
    },
  })
}
