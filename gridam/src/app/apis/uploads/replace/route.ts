import { fail, ok } from '@/app/apis/_lib/http'
import { MESSAGES } from '@/constants/messages'
import getSupabaseServer from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

const BUCKET = 'diary-images'
const ALLOW = new Set(['image/png', 'image/jpeg', 'image/webp'])
const MAX = 5 * 1024 * 1024

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServer()
    const { data: userRes } = await supabase.auth.getUser()
    const user = userRes?.user
    if (!user) return fail(MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER, 401)

    const form = await req.formData()
    const file = form.get('file') as File | null
    const oldPath = String(form.get('oldPath') || '')

    if (!file) return fail('file 필드가 필요합니다.', 400)
    if (!oldPath) return fail('oldPath 필드가 필요합니다.', 400)
    if (!ALLOW.has(file.type)) return fail(`허용되지 않은 MIME: ${file.type}`, 415)
    if (file.size > MAX) return fail('파일이 너무 큽니다(최대 5MB)', 413)

    // oldPath own-folder 검사
    const [firstToken] = oldPath.split('/')
    if (firstToken !== user.id) return fail('own-folder 정책 위반(oldPath)', 403)

    // 새 경로 생성
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const newPath = `${user.id}/${Date.now()}.${ext}`

    // 1) 새 파일 업로드
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(newPath, file, { upsert: false })
    if (upErr) throw upErr

    // 2) 새 파일 signed URL 생성 (즉시 미리보기용)
    const { data: signData, error: signErr } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(newPath, 60 * 5)
    if (signErr) throw signErr

    // 3) (선택) oldPath 삭제 — 실패하더라도 핵심 기능은 성공 처리
    const { error: delErr } = await supabase.storage.from(BUCKET).remove([oldPath])
    if (delErr) {
      // 로그만 남기고 200 반환 (백그라운드 정리 작업으로 처리 가능)
      console.error('[uploads/replace] old remove failed:', delErr.message)
    }

    return ok({ message: '교체되었습니다.', path: newPath, signedUrl: signData?.signedUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : '이미지 수정에 실패하였습니다.'
    return fail(message, 500)
  }
}
