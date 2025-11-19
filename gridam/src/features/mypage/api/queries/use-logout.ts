'use client'

import { QUERY_KEYS } from '@/shared/constants/query-key'
import { api } from '@/shared/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: QUERY_KEYS.AUTH.LOGOUT,
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      // 유저 관련 캐시 비우고 싶으면
      queryClient.clear()
    },
  })
}
