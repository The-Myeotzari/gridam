'use server'

import { MESSAGES } from '@/shared/constants/messages'
import axios, { AxiosError } from 'axios'

export async function resetAction(formData: FormData) {
  // console.log('resetAction 호출됨')
  // console.log('formData 내용:', Object.fromEntries(formData.entries()))
  // console.log(resetAction)
  const token = formData.get('token')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')

  try {
    const response = await axios.post('/apis/auth/reset', {
      token,
      newPassword: password,
      confirmPassword,
    })
    return { success: response?.data.message || MESSAGES.AUTH.SUCCESS.PASSWORD_RESET }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('error', error.response?.data || error)
      return {
        error:
          error.response?.data?.message || MESSAGES.AUTH.ERROR.EMAIL_VERIFICATION_REQUEST_FAILED,
      }
    }
  }
  return { error: MESSAGES.AUTH.ERROR.PASSWORD_RESET }
}
