import type { ButtonHTMLAttributes, ReactNode } from 'react'

type TagBadgeProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export default function TagBadge({ children, className = '', type, ...props }: TagBadgeProps) {
  const base =
    'inline-flex items-center justify-center whitespace-nowrap rounded-full ' +
    'h-6 px-3 text-xs border ' +
    'bg-secondary text-secondary-foreground border-secondary ' +
    'hover:bg-secondary/70'

  return (
    <button type={type ?? 'button'} className={`${base} ${className}`} {...props}>
      {children}
    </button>
  )
}
