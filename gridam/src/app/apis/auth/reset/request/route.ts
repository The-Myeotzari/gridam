import { NextRequest } from 'next/server'
import { ResetRequestSchema } from '@/types/apis/auth'
import { ok, fail } from '@/app/apis/_lib/http'
import getSupabaseServer, { getOrigin } from '@/utils/supabase/server'
import { MESSAGES } from '@/constants/messages'

/**
 * @openapi
 * /apis/auth/reset/request:
 *   post:
 *     tags: [Auth]
 *     summary: 비밀번호 재설정 메일 발송
 *     description: |
 *       존재 여부와 관계없이 동일한 응답을 반환합니다.
 *       사용자는 받은 메일의 링크를 통해 다음 단계(complete)로 이동합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *     responses:
 *       '200':
 *         description: 안내 문구 (항상 동일)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example:
 *                     ok: true
 *                 message:
 *                   type: string
 *                   example:
 *                     message: "비밀번호 재설정 이메일이 발송되었습니다."
 *       '500':
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example:
 *                     ok: false
 *                 message:
 *                   type: string
 *                   example:
 *                     message: "메일 발송 중 오류가 발생했습니다."
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = ResetRequestSchema.parse(body)

    const supabase = await getSupabaseServer()
    const origin = await getOrigin()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/reset-password`,
    })

    if (error) {
      return fail(MESSAGES.AUTH.ERROR.PASSWORD_RESET, error.status)
    }

    return ok({ message: MESSAGES.AUTH.SUCCESS.PASSWORD_RESET_EMAIL }, 200)
  } catch (err) {
    const message = err instanceof Error ? err.message : MESSAGES.AUTH.ERROR.PASSWORD_RESET
    return fail(message, 400)
  }
}
