import { NextRequest } from 'next/server'
import { LoginSchema } from '@/types/apis/auth'
import { ok, fail } from '@/app/apis/_lib/http'
import getSupabaseServer from '@/utils/supabase/server'
import { MESSAGES } from '@/constants/messages'

/**
 * @openapi
 * /apis/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: 이메일/비밀번호 로그인
 *     description: 성공 시 Supabase 세션 쿠키가 설정됩니다.
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
 *               password:
 *                 type: string
 *                 example: "R!chPassw0rd"
 *     responses:
 *       '200':
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example:
 *                     ok: true
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
 *                 session:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *                     refresh_token:
 *                       type: string
 *                       example: "v0Odt6eyqX8..."
 *                     expires_in:
 *                       type: integer
 *                       example: 3600
 *                 message:
 *                   type: string
 *                   example:
 *                     message: "로그인 되었습니다."
 *       '401':
 *         description: 인증 실패
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
 *                     message: "이메일 또는 비밀번호가 올바르지 않습니다."
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = LoginSchema.parse(body)

    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return fail(MESSAGES.AUTH.ERROR.ACCOUNT_NOT_EXIST, 401)
    }

    return ok({ user: data.user, session: data.session, message: MESSAGES.AUTH.SUCCESS.LOGIN }, 200)
  } catch (err) {
    const message = err instanceof Error ? err.message : MESSAGES.AUTH.ERROR.LOGIN
    return fail(message, 400)
  }
}
