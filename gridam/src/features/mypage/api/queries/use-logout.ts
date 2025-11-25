'use client'

import { MESSAGES } from '@/shared/constants/messages'
import { QUERY_KEYS } from '@/shared/constants/query-key'
import { toast } from '@/store/toast-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'

// TODO: Server Actions으로 변경
export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: QUERY_KEYS.AUTH.LOGOUT,
    mutationFn: () => axios.post('/apis/auth/logout'),
    onSuccess: () => {
      // 유저 관련 캐시 비우고 싶으면
      toast.success(MESSAGES.AUTH.SUCCESS.LOGOUT)
      router.push('/login')
      router.refresh()
      queryClient.clear()
    },
    onError: (err) => {
      const message =
        err instanceof AxiosError ? err.response?.data.message : MESSAGES.AUTH.ERROR.LOGOUT
      toast.error(message)
    },
  })
}
