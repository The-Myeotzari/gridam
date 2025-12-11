'use client'

import cn from '@/shared/utils/cn'
import Image from 'next/image'
import React, { useState } from 'react'

type AvatarProps = {
  src?: string | null
  alt?: string
  fallback?: string
  size?: number
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback = '?',
  size = 32,
  className,
}) => {
  const [hasError, setHasError] = useState(false)

  const initials = fallback?.trim().slice(0, 2).toUpperCase() || '?'

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xs font-medium',
        className
      )}
      style={{ width: size, height: size }}
    >
      {src && !hasError ? (
        <Image
          src={src}
          alt={alt ?? initials}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
