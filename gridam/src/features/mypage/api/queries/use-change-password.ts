'use client'

import { ChangePasswordState } from '@/features/mypage/types/mypage'
import { MESSAGES } from '@/shared/constants/messages'
import { QUERY_KEYS } from '@/shared/constants/query-key'
import { toast } from '@/store/toast-store'
import { useMutation } from '@tanstack/react-query'

type ChangePasswordPayload = {
  password: string
  newPassword: string
  confirmPassword: string
}

export function useChangePassword() {
  return useMutation<ChangePasswordState, Error, ChangePasswordPayload>({
    mutationKey: QUERY_KEYS.AUTH.CHANGE_PASSWORD,
    mutationFn: async (payload) => {
      const res = await fetch('/apis/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = (await res.json()) as ChangePasswordState

      if (!res.ok) {
        throw new Error(data?.message ?? MESSAGES.AUTH.ERROR.PASSWORD_RESET)
      }

      return data
    },
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.message ?? MESSAGES.AUTH.ERROR.PASSWORD_RESET)
        return
      }

      toast.success(res.message ?? MESSAGES.AUTH.SUCCESS.PASSWORD_RESET)
    },

    onError: (err) => {
      const message = err.message ?? MESSAGES.AUTH.ERROR.PASSWORD_RESET
      toast.error(message)
    },
  })
}
