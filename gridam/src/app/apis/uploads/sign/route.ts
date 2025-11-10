import { NextRequest } from 'next/server'
import getSupabaseServer from '@/utils/supabase/server'
import { ok, fail } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/constants/messages'

/**
* @openapi
* /apis/uploads/sign:
*   get:
*   tags: [Storage]
*   summary: 프라이빗 버킷 객체에 대한 서명 URL 재발급
*   description: |
*   - RLS: own-folder 정책(`path_tokens[1] = auth.uid()`)을 통과해야 함
*   - 요청 주체는 **인증 사용자**여야 하며, 라우트는 **사용자 세션 컨텍스트**로 동작해야 함
*   - 입력받은 `path`(예: `{userId}/1731123456789.png`)로 짧은 TTL의 `signedUrl`을 재발급
*   security:
*     - cookieAuth: []
*     - bearerAuth: []
*   parameters:
*     - in: query
*   name: path
*   required: true
*   schema:
*     type: string
*     description: 버킷 내부 객체 경로 (예: `8b5c0f1e-.../1731123456789.png`)
*   responses:
*     '200':
*       description: 재발급 성공
*       content:
*         application/json:
*           schema:
*             type: object
*           properties:
*           ok:
*             type: boolean
*             example: true
*           signedUrl:
*             type: string
*             example: "https://*.supabase.co/storage/v1/object/sign/diary-images/8b5c.../1731.png?token=..."
*     '400':
*       description: 잘못된 요청(쿼리 누락 등)
*       content:
*         application/json:
*           schema:
*             type: object
*           properties:
*             ok:
*               type: boolean
*               example: false
*             message:
*               type: string
*               example: "path 파라미터가 필요합니다."
*     '401':
*       description: 인증 필요(세션/토큰 없음)
*       content:
*         application/json:
*           schema:
*             type: object
*           properties:
*             ok:
*               type: boolean
*               example: false
*             message:
*               type: string
*               example: "로그인이 필요합니다."
*     '403':
*       description: RLS 위반(own-folder 불일치 등)
*       content:
*         application/json:
*       schema:
*         type: object
*       properties:
*         ok:
*           type: boolean
*           example: false
*         message:
*           type: string
*           example: "own-folder 정책 위반"
*     '500':
*       description: 서버 에러
*       content:
*         application/json:
*       schema:
*         type: object
*       properties:
*         ok:
*           type: boolean
*           example: false
*         message:
*           type: string
*           example: "이미지 불러오기에 실패하였습니다."
*/

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const path = searchParams.get('path')
    if (!path) return fail('path 파라미터가 필요합니다.', 400)

    const supabase = await getSupabaseServer()
    const { data: user } = await supabase.auth.getUser()
    if (!user?.user) return fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)

    // path 검증 (own-folder)
    const userId = user.user.id
    if (!path.startsWith(`${userId}/`))
      return fail('own-folder 정책 위반', 403)

    const { data, error } = await supabase.storage
      .from('diary-images')
      .createSignedUrl(path, 60 * 5) // TTL: 5분

    if (error) throw error
    return ok({ signedUrl: data.signedUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : '이미지 불러오기에 실패하였습니다.'
    return fail(message, 500)
  }
}