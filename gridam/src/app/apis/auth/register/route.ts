import { NextRequest } from 'next/server'
import { SignUpSchema } from '@/types/apis/auth'
import { ok, fail, withCORS } from '@/app/apis/_lib/http'
import getSupabaseServer, { getOrigin } from '@/utils/supabase/server'
import { MESSAGES } from '@/constants/messages'

/**
 * @openapi
 * /apis/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: 이메일/비밀번호 회원가입 (인증 메일 발송)
 *     description: |
 *       회원가입 시 이메일 인증 링크를 전송합니다.
 *       이미 존재하는 이메일이어도 같은 안내 문구를 반환합니다. (Supabase 보안 설정 조정 불가)
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
 *               nickname:
 *                 type: string
 *                 example: "jane"
 *     responses:
 *       '200':
 *         description: 안내 문구
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
 *                         identity_id: "14asfasfe9-8fasf-4cae-8asf-a36004"
 *                           id: "fcc27asfasf6301-45ba-a8cc-09dc21502asf"
 *                           user_id: "fccasfasfd-6301-45ba-a8cc-09dasfa93"
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
 *                   example:
 *                     message: "이메일 인증 이메일이 발송되었습니다."
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, nickname } = SignUpSchema.parse(body)

    const supabase = await getSupabaseServer()
    const origin = await getOrigin()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/login`,
        data: nickname ? { nickname } : undefined, // user_metadata
      },
    })

    if (error) {
      return fail(MESSAGES.AUTH.ERROR.REGISTER, error.status)
    }

    return withCORS(ok(
      {
        user: data.user,
        message: MESSAGES.AUTH.SUCCESS.REGISTER_EMAIL,
      },
      201
    ))
  } catch (err) {
    const message = err instanceof Error ? err.message : MESSAGES.AUTH.ERROR.REGISTER
    return fail(message, 400)
  }
}
