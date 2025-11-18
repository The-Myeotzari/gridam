import { QueryClient } from '@tanstack/react-query'
import { RegisterFormData } from '../types/register'
import { QUERY_KEYS } from '@/constants/query-key'
import { toast } from '@/store/toast-store'
import { MESSAGES } from '@/constants/messages'
import { registerUser } from './register.api'
import { UseFormReset } from 'react-hook-form'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface deps {
  queryClient: QueryClient
  router: AppRouterInstance
  reset: UseFormReset<RegisterFormData>
}
export default function registerAction({ queryClient, router, reset }: deps) {
  return {
    mutationFn: (data: RegisterFormData) => registerUser(data),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.AUTH.ME] })
      toast.success(MESSAGES.AUTH.SUCCESS.REGISTER_AND_EMAIL)
      router.push('/login')
      reset()
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message)
      }
      toast.error(MESSAGES.AUTH.ERROR.REGISTER)
    },
  }
}
