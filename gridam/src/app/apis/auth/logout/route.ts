import { NextRequest } from 'next/server'
import getSupabaseServer from '@/utils/supabase/server'
import { ok, fail } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/constants/messages'

/**
 * @openapi
 * /apis/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: 로그아웃
 *     description: Supabase 세션을 무효화합니다.
 *     responses:
 *       '200':
 *         description: 로그아웃 성공
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
 *                     message: "로그아웃 되었습니다."
 *       '401':
 *         description: 세션 없음
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
 *                     message: "로그인된 세션이 없습니다."
 */
export async function POST(_req: NextRequest){
  const supabase = await getSupabaseServer()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return fail(MESSAGES.AUTH.ERROR.LOGOUT, error.status)
  }
  return ok({ message: MESSAGES.AUTH.SUCCESS.LOGOUT }, 200)
}