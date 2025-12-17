'use client'

import { logoutAction } from "@/features/mypage/api/logout-action"
import { toast } from "@/store/toast-store"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { MESSAGES } from "../constants/messages"

interface UseLogoutOptions {
  redirectTo?: string
  onSuccess?: () => void
  onError?: (message: string) => void
}

export function useLogout(options: UseLogoutOptions = {}) {
  const { redirectTo = '/login', onSuccess, onError } = options
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const logout = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const res = await logoutAction()

      if (!res.ok) {
        const message = res.message ?? MESSAGES.AUTH.ERROR.LOGOUT
        toast.error(message)
        onError?.(message)
        return
      }

      const message = res.data.message ?? MESSAGES.AUTH.SUCCESS.LOGOUT
      toast.success(message)

      onSuccess?.()
      if (redirectTo) {
        router.push(redirectTo)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { logout, isLoading }
}