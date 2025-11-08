import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import getSupabaseServer from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * @openapi
 * /auth/confirm:
 *   get:
 *     tags: [Auth]
 *     summary: 이메일 인증 확인 & 리다이렉트
 *     description: |
 *       Supabase가 전송한 인증 메일의 링크를 통해 접근하는 확인 페이지입니다.
 *     parameters:
 *       - in: query
 *         name: next
 *         required: false
 *         schema:
 *           type: string
 *           example: "/welcome"
 *         description: 인증 완료 후 이동할 경로. 지정하지 않으면 홈(/)로 이동합니다.
 *     responses:
 *       '200':
 *         description: 확인 페이지에 도착(클라이언트가 해시 처리 후 리다이렉트 수행)
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
 *                     message: "회원가입이 완료되었습니다. 곧 다음 페이지로 이동합니다."
 *       '400':
 *         description: 잘못된 접근(필수 정보 누락 등)
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
 *                     message: "유효하지 않은 접근입니다. 인증 링크를 다시 확인해 주세요."
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'
  if (token_hash && type) {
    const supabase = await getSupabaseServer()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // 지정된 URL로 사용자 리다이렉트 (로그인 페이지)
      redirect(next)
    }
  }
  // 메인 페이지로 사용자 리다이렉트
  redirect('/')
}