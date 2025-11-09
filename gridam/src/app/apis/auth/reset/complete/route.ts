import { NextRequest } from 'next/server'
import { ResetCompleteSchema } from '@/types/zod/apis/auth'
import { ok, fail } from '@/app/apis/_lib/http'
import getSupabaseServer from '@/utils/supabase/server'
import { MESSAGES } from '@/constants/messages'

/**
 * @openapi
 * /apis/auth/reset/complete:
 *   post:
 *     tags: [Auth]
 *     summary: 비밀번호 재설정 완료 (새 비밀번호 저장)
 *     description: |
 *       사용자가 메일로 전달받은 링크를 통해 진입한 뒤 새 비밀번호를 입력합니다.
 *       링크의 토큰을 Supabase가 자동 검증한 후 세션이 활성화된 상태에서 요청해야 합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "N3wR!chPassw0rd"
 *     responses:
 *       '200':
 *         description: 비밀번호 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   example:
 *                     id: "fcc2asfasfd-6301-45ba-a8cc-0asf502a93"
 *                     aud: "authenticated"
 *                     role: "authenticated"
 *                     email: "asd123@gmail.com"
 *                     phone: ""
 *                     confirmation_sent_at: "2025-11-08T08:47:30.794880492Z"
 *                     app_metadata: { provider: "email", providers: ["email"] }
 *                     user_metadata:
 *                       email: "asd123@gmail.com"
 *                       email_verified: false
 *                       nickname: "asdasd"
 *                       phone_verified: false
 *                       sub: "fasfasfd-6301-45asfcc-0asfasf93"
 *                     identities:
 *                       - identity_id: "14asfasfe9-8fasf-4cae-8asf-a36004"
 *                         id: "fcc27asfasf6301-45ba-a8cc-09dc21502asf"
 *                         user_id: "fccasfasfd-6301-45ba-a8cc-09dasfa93"
 *                         identity_data:
 *                           email: "asd123@gmail.com"
 *                           email_verified: false
 *                           nickname: "asdasd"
 *                           phone_verified: false
 *                           sub: "fccasfasf-6301asfba-a8ccasf502a93"
 *                         provider: "email"
 *                         last_sign_in_at: "2025-11-08T08:47:30.76319728Z"
 *                         created_at: "2025-11-08T08:47:30.763966Z"
 *                         updated_at: "2025-11-08T08:47:30.763966Z"
 *                         email: "asd123@gmail.com"
 *                     created_at: "2025-11-08T08:47:30.738882Z"
 *                     updated_at: "2025-11-08T08:47:31.822949Z"
 *                     is_anonymous: false
 *                 message:
 *                   type: string
 *                   example: "비밀번호 재설정이 완료되었습니다."
 *       '401':
 *         description: 토큰/세션 없음 또는 만료됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "세션이 만료되었습니다. 다시 비밀번호 재설정을 요청해 주세요."
 *       '400':
 *         description: 비밀번호 정책 위반 등 유효성 검증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "비밀번호는 8자 이상, 대문자와 특수문자를 포함해야 합니다."
 *       '500':
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "비밀번호 변경 중 오류가 발생했습니다."
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { newPassword } = ResetCompleteSchema.parse(body)

    const supabase = await getSupabaseServer()

    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData?.user) {
      return fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)
    }

    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      return fail(MESSAGES.AUTH.ERROR.PASSWORD_RESET, error.status)
    }

    return ok({ user: data.user, message: MESSAGES.AUTH.SUCCESS.PASSWORD_RESET }, 200)
  } catch (err) {
    const message = err instanceof Error ? err.message : MESSAGES.AUTH.ERROR.PASSWORD_RESET
    return fail(message, 400)
  }
}
