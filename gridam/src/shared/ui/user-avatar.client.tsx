'use client'

import { Avatar } from '@/shared/ui/avatar'

type UserAvatarProps = {
  size?: number
  className?: string
  image: string | null
  name: string
}

export function UserAvatarClient({ size = 32, className, image, name }: UserAvatarProps) {
  const fallback =
    name
      ?.trim()
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase())
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
