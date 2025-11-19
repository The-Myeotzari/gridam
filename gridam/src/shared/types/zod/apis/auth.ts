import { MESSAGES } from '@/shared/constants/messages'
import { z } from 'zod'

export const PASSWORD_REGEX: RegExp = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/']).+$/

export const SignUpSchema = z.object({
  email: z.email().min(1, { error: MESSAGES.AUTH.ERROR.EMPTY_EMAIL }),
  password: z
    .string()
    .min(8, { error: MESSAGES.AUTH.ERROR.INVALID_PASSWORD_LENGTH })
    .regex(PASSWORD_REGEX, { error: MESSAGES.AUTH.ERROR.INVALID_PASSWORD_FORMAT }),
  nickname: z.string().min(1).max(20).optional(), // 선택
})

export const LoginSchema = z.object({
  email: z.email().min(1, { error: MESSAGES.AUTH.ERROR.EMPTY_EMAIL }),
  password: z
    .string()
    .min(1, { error: MESSAGES.AUTH.ERROR.INVALID_PASSWORD_LENGTH })
    .regex(PASSWORD_REGEX, { error: MESSAGES.AUTH.ERROR.INVALID_PASSWORD_FORMAT }),
})

export const ResetRequestSchema = z.object({
  email: z.email().min(1, { error: MESSAGES.AUTH.ERROR.EMPTY_EMAIL }),
})

export const ResetCompleteSchema = z.object({
  // 사용자가 리셋 링크로 들어온 뒤, 쿠키 세션이 살아있는 상태에서 새 비밀번호 설정
  newPassword: z
    .string()
    .min(8, { error: MESSAGES.AUTH.ERROR.INVALID_PASSWORD_LENGTH })
    .regex(PASSWORD_REGEX, { error: MESSAGES.AUTH.ERROR.INVALID_PASSWORD_FORMAT }),
})

export const ChangePasswordFormSchema = z
  .object({
    password: z.string().min(8),
    newPassword: z
      .string()
      .min(8, MESSAGES.AUTH.ERROR.INVALID_PASSWORD_LENGTH)
      .regex(PASSWORD_REGEX, MESSAGES.AUTH.ERROR.INVALID_PASSWORD_FORMAT),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: MESSAGES.AUTH.ERROR.WRONG_PASSWORD,
  })
