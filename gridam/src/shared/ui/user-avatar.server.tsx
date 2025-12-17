import { getCurrentUserImage } from '@/shared/server/get-current-user-image'
import { getCurrentUserName } from '@/shared/server/get-current-user-name'
import { UserAvatarClient } from './user-avatar.client'

type UserAvatarProps = {
  size?: number
  className?: string
}

export async function UserAvatarServer({ size = 32, className }: UserAvatarProps) {
  const [image, name] = await Promise.all([getCurrentUserImage(), getCurrentUserName()])
  return <UserAvatarClient image={image} name={name} size={size} className={className} />
}
