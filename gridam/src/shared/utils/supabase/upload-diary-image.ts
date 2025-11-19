'use server'

import getSupabaseServer from '@/shared/utils/supabase/server'

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

// 파일명 안전화
const safeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9_.-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)

export async function uploadDiaryImage(dataUrl: string, userId: string) {
  const supabase = await getSupabaseServer()

  // Data URL → Blob 변환
  const fetchRes = await fetch(dataUrl)
  const blob = await fetchRes.blob()

  // 타입 체크
  if (!ALLOWED.has(blob.type)) {
    throw new Error(`허용되지 않은 MIME: ${blob.type}`)
  }

  if (blob.size > MAX_SIZE) {
    const mb = Math.round(MAX_SIZE / 1024 / 1024)
    throw new Error(`파일이 너무 큽니다(최대 ${mb}MB)`)
  }

  // 파일명 구성
  const ext = toExt(blob.type)
  const rawName = `canvas-${Date.now()}.${ext}`
  const fileName = safeName(rawName)
  const objectPath = `${userId}/${Date.now()}-${fileName}`

  // 업로드
  const arrayBuffer = await blob.arrayBuffer()

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, Buffer.from(arrayBuffer), {
      contentType: blob.type,
      upsert: false,
    })

  if (error) {
    throw new Error('업로드 실패: ' + error.message)
  }

  // 사인드 URL 발급
  const { data: signed } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(objectPath, TTL_SEC, {
      download: undefined,
    })

  return {
    path: objectPath,
    url: signed?.signedUrl ?? null,
  }
}
