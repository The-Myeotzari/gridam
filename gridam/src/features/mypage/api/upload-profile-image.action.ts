'use server'

import getSupabaseServerClient from '@/shared/utils/supabase/server'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

type UploadProfileImageResult = { ok: true; previewUrl: string } | { ok: false; error: string }

export async function uploadProfileImageAction(
  formData: FormData
): Promise<UploadProfileImageResult> {
  const file = formData.get('file')

  if (!file || !(file instanceof File)) {
    return { ok: false, error: '업로드할 파일을 찾을 수 없습니다.' }
  }

  // 파일 크기 검증 (5MB 제한)
  if (file.size > MAX_IMAGE_SIZE) {
    return { ok: false, error: '이미지 크기는 5MB 이하여야 합니다!' }
  }

  // 파일 타입 검증
  if (!file.type.startsWith('image/')) {
    return { ok: false, error: '이미지 파일만 업로드 가능합니다!' }
  }

  try {
    const supabase = await getSupabaseServerClient()

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error(sessionError)
      return { ok: false, error: '세션 정보를 가져오지 못했습니다.' }
    }

    const user = session?.user
    if (!user) {
      return { ok: false, error: '로그인이 필요합니다.' }
    }

    const ext = (file.name.split('.').pop() || 'png').toLowerCase()
    const filePath = `${user.id}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (uploadError) {
      console.error(uploadError)
      return { ok: false, error: '이미지 업로드에 실패했습니다.' }
    }

    // public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const publicUrlWithTs = `${publicUrl}?t=${Date.now()}`

    // signed URL 생성 (미리보기용)
    const { data: signedData, error: signedError } = await supabase.storage
      .from('avatars')
      .createSignedUrl(filePath, 60 * 60) // 1시간

    if (signedError || !signedData?.signedUrl) {
      console.error(signedError)
      return { ok: false, error: '프로필 이미지 URL 생성에 실패했습니다.' }
    }

    const previewUrl = `${signedData.signedUrl}&t=${Date.now()}`

    // Auth user_metadata.avatar_url 업데이트 (public URL 사용)
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrlWithTs },
    })

    if (updateError) {
      console.error(updateError)
      return { ok: false, error: '프로필 정보를 업데이트하지 못했습니다.' }
    }

    return { ok: true, previewUrl }
  } catch (err) {
    console.error(err)
    return { ok: false, error: '이미지 업로드 중 오류가 발생했습니다.' }
  }
}
