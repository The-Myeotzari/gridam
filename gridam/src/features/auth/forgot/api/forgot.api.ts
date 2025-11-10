import { z } from 'zod'

export const ForgotPasswordSchema = z.object({
  email: z
    .string({ error: '이메일을 입력해주세요!' })
    .trim()
    .min(1, '이메일을 입력해주세요!')
    .email('올바른 이메일 형식이 아닙니다.'),
})

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>

export async function requestPasswordReset(payload: ForgotPasswordInput) {
  await new Promise((r) => setTimeout(r, 400)) // 테스트용

  return '테스트'
}
