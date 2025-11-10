import { fail, ok } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/constants/messages'
import getSupabaseServer from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

const BUCKET = 'diary-images'
const TTL_SEC = 60 * 10 // 10분 유효
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp'])

const toExt = (mime: string) =>
  mime === 'image/png'
    ? 'png'
    : mime === 'image/jpeg'
      ? 'jpg'
      : mime === 'image/webp'
        ? 'webp'
        : 'bin'

// 파일명 안전화(공백/특수문자 제거 + 단순화)
const safeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9_.-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServer()
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData.user) {
      return fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)
    }
    const userId = userData.user.id

    // multipart/form-data 받기
    const form = await req.formData()
    const file = form.get('file')
    if (!file || !(file instanceof File)) {
      return fail('file 필드가 필요합니다.', 400)
    }

    if (!ALLOWED.has(file.type)) {
      return fail(`허용되지 않은 MIME: ${file.type}`, 415)
    }
    if (file.size > MAX_SIZE) {
      return fail(`파일이 너무 큽니다(최대 ${Math.round(MAX_SIZE / 1024 / 1024)}MB)`, 413)
    }

    // 파일명/경로 구성: 반드시 auth.uid() = userId 가 최상위 폴더여야 RLS 통과
    const originalName =
      typeof form.get('filename') === 'string'
        ? (form.get('filename') as string)
        : file.name || `canvas-${Date.now()}.${toExt(file.type)}`

    const fileName =
      safeName(originalName.replace(/\.(png|jpg|jpeg|webp)$/i, '')) + '.' + toExt(file.type)
    const objectPath = `${userId}/${Date.now()}-${fileName}`

    // 업로드 (사용자 컨텍스트로 실행되므로 RLS 정책에 부합해야 함)
    const arrayBuf = await file.arrayBuffer()
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(objectPath, Buffer.from(arrayBuf), {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return fail(error.message, 403)
    }

    const { data: pub } = await supabase.storage.from(BUCKET).createSignedUrl(data.path, TTL_SEC, {
      // 다운로드가 아니라 브라우저에서 보이게 하려면 inline
      download: undefined, // 다운로드 파일명 원하면: download: filename
      // 이미지 리사이즈/포맷 변환이 필요하면 transform 옵션도 가능
      // transform: { width: 1200, height: 1200, resize: 'contain' }
    })

    return ok(
      {
        path: data.path,
        url: pub?.signedUrl ?? null,
      },
      201
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : '이미지 업로드에 실패하였습니다.'
    return fail(message, 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const path = searchParams.get('path')
    if (!path) return fail('path 파라미터가 필요합니다.', 400)

    const supabase = await getSupabaseServer()
    const { data: userRes } = await supabase.auth.getUser()
    const user = userRes?.user
    if (!user) return fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)

    // own-folder 검사
    const [firstToken] = path.split('/')
    if (firstToken !== user.id) return fail('own-folder 정책 위반', 403)

    const { error } = await supabase.storage.from(BUCKET).remove([path])
    if (error) throw error

    return ok({ message: '삭제되었습니다.' })
  } catch (err) {
    const message = err instanceof Error ? err.message : '이미지 삭제에 실패하였습니다.'
    return fail(message, 500)
  }
}
