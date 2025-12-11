'use client'

import { UserAvatar } from '@/shared/ui/user-avatar'
import getSupabaseBrowserClient from '@/shared/utils/supabase/client'
import { toast } from '@/store/toast-store'
import { Camera } from 'lucide-react'
import { type ChangeEvent, useRef } from 'react'

const AVATAR_SIZE = 75
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

async function uploadProfileImage(file: File) {
  // 파일 크기 검증 (5MB 제한)
  if (file.size > MAX_IMAGE_SIZE) {
    toast.error('이미지 크기는 5MB 이하여야 합니다!')
    return
  }
  // 파일 타입 검증
  if (!file.type.startsWith('image/')) {
    toast.error('이미지 파일만 업로드 가능합니다!')
    return
  }

  try {
    const supabase = getSupabaseBrowserClient()
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error(sessionError)
      toast.error('세션 정보를 가져오지 못했습니다.')
      return
    }

    const user = session?.user
    if (!user) {
      toast.error('로그인이 필요합니다.')
      return
    }

    const ext = file.name.split('.').pop()
    const filePath = `${user.id}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (uploadError) {
      console.error(uploadError)
      toast.error('이미지 업로드에 실패했습니다.')
      return
    }

    // 파일의 public URL 생성
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const publicUrlWithTs = `${publicUrl}?t=${Date.now()}`

    // Auth user_metadata.avatar_url 업데이트
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrlWithTs },
    })

    if (updateError) {
      console.error(updateError)
      toast.error('프로필 정보를 업데이트하지 못했습니다.')
      return
    }

    toast.success('프로필 이미지가 변경되었습니다!')
  } catch (err) {
    console.error(err)
    toast.error('이미지 업로드 중 오류가 발생했습니다.')
  }
}

export default function ProfileImage() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProfileImageClick = () => fileInputRef.current?.click()

  const handleProfileImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    e.target.value = ''
    await uploadProfileImage(file)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className="relative group" style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}>
        <UserAvatar size={AVATAR_SIZE} className="text-lg" />
        <button
          onClick={handleProfileImageClick}
          className="absolute inset-0 flex items-center justify-center bg-foreground/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Camera className="w-8 h-8 text-background" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
          className="hidden"
        />
      </div>
    </div>
  )
}
