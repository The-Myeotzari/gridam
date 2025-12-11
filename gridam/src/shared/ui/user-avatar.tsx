'use client'

import { useCurrentUserImage } from '@/shared/hooks/use-current-user-image'
import { useCurrentUserName } from '@/shared/hooks/use-current-user-name'
import { Avatar } from '@/shared/ui/avatar'

type UserAvatarProps = {
  size?: number
  className?: string
}

export function UserAvatar({ size = 32, className }: UserAvatarProps) {
  const image = useCurrentUserImage()
  const name = useCurrentUserName()

  const fallback =
    name
      ?.trim()
      .split(/\s+/)
      .map((word) => word[0]?.toUpperCase())
      .join('') ?? undefined

  return (
    <Avatar
      src={image ?? undefined}
      alt={name ?? 'User avatar'}
      fallback={fallback}
      size={size}
      className={className}
    />
  )
}
