'use client'

import { ChangePasswordState } from '@/features/mypage/types/mypage'
import { QUERY_KEYS } from '@/shared/constants/query-key'
import { api } from '@/shared/lib/api'
import { useMutation } from '@tanstack/react-query'

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
