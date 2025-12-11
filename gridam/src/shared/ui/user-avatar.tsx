'use client'

import { useCurrentUserImage } from '@/shared/hooks/use-current-user-image'
import { useCurrentUserName } from '@/shared/hooks/use-current-user-name'
import { Avatar } from '@/shared/ui/avatar'
import React from 'react'

type props = {
  size?: number
  className?: string
}

export const UserAvatar: React.FC<props> = ({ size = 32, className }) => {
  const image = useCurrentUserImage()
  const name = useCurrentUserName()

  const fallback =
    name
      ?.trim()
      .split(/\s+/)
      .map((word) => word[0]?.toUpperCase())
      .join('') || '?'

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
