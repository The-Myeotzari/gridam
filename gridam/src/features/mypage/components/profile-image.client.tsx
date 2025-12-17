'use client'

import { uploadProfileImageAction } from '@/features/mypage/api/upload-profile-image.action'
import { UserAvatarClient } from '@/shared/ui/user-avatar.client'
import { toast } from '@/store/toast-store'
import { Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type ChangeEvent, useEffect, useRef, useState } from 'react'

const AVATAR_SIZE = 75

type ProfileImageClientProps = {
  initialImage: string | null
  name: string
}

export default function ProfileImageClient({ initialImage, name }: ProfileImageClientProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(initialImage)
  const [pendingImage, setPendingImage] = useState<string | null>(null)

  useEffect(() => {
    setImage(initialImage ?? null)
  }, [initialImage])

  const handleProfileImageClick = () => fileInputRef.current?.click()

  const handleProfileImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    e.target.value = ''
    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadProfileImageAction(formData)

    if (!result.ok) {
      toast.error(result.error)
      return
    }

    setPendingImage(result.previewUrl)
    toast.success('프로필 이미지가 변경되었습니다!')
    router.refresh()
  }

  const displayImage = pendingImage ?? image

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className="relative group" style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}>
        <UserAvatarClient size={AVATAR_SIZE} className="text-lg" image={displayImage} name={name} />
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
