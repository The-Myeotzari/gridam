'use client'

import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      // 유저 관련 캐시 비우고 싶으면
      queryClient.clear()
    }
  })
}