'use client'

import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ChangePasswordState } from '@/features/mypage/types/mypage'

type ChangePasswordPayload = {
  password: string
  newPassword: string
  confirmPassword: string
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const res = await api.post('/auth/change-password', payload)
      return res.data as ChangePasswordState
    },
  })
}