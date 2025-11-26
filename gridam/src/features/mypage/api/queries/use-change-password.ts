'use client'

import { ChangePasswordState } from '@/features/mypage/types/mypage'
import { QUERY_KEYS } from '@/shared/constants/query-key'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

type ChangePasswordPayload = {
  password: string
  newPassword: string
  confirmPassword: string
}

export function useChangePassword() {
  return useMutation({
    mutationKey: QUERY_KEYS.AUTH.CHANGE_PASSWORD,
    mutationFn: async (payload: ChangePasswordPayload) => {
      const res = await axios.post('/apis/auth/change-password', payload)
      return res.data as ChangePasswordState
    },
  })
}
