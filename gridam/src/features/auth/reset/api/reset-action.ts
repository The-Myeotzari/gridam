'use server'

import { MESSAGES } from '@/constants/messages'
import { api } from '@/lib/api'
import axios, { AxiosError } from 'axios'
import { error } from 'console'

export async function resetAction(formData: FormData) {
  console.log('✅ resetAction 호출됨')
  console.log('📦 formData 내용:', Object.fromEntries(formData.entries()))

  const token = formData.get('token')
  const password = formData.get('password')
  const confirmPassword = formData.get('comfirmPassword')

  try {
    const response = await axios.post('apis/auth/reset/complete', {
      token,
      password,
      confirmPassword,
    })
    console.log('응답', response)
    return response.data
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
