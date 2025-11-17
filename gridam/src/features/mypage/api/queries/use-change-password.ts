'use client'

import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ChangePasswordState } from '@/features/mypage/types/mypage'
import { QUERY_KEYS } from '@/constants/query-key'

type ChangePasswordPayload = {
  password: string
  newPassword: string
  confirmPassword: string
}

export function useChangePassword() {
  return useMutation({
    mutationKey: QUERY_KEYS.AUTH.CHANGE_PASSWORD,
    mutationFn: async (payload: ChangePasswordPayload) => {
      const res = await api.post('/auth/change-password', payload)
      return res.data as ChangePasswordState
    },
  })
}