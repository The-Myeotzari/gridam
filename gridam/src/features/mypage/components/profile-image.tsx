import ProfileImageClient from '@/features/mypage/components/profile-image.client'
import { getCurrentUserImage } from '@/shared/server/get-current-user-image'

type ProfileImageServerProps = {
  name: string
}

export default async function ProfileImage({ name }: ProfileImageServerProps) {
  const image = await getCurrentUserImage()
  return <ProfileImageClient initialImage={image} name={name} />
}
