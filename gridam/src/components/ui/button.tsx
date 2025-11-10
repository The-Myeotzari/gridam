'use client'
import cn from '@/utils/cn'

//색상, 크기 옵션의 타입 지정
type Variant = 'basic' | 'blue' | 'roundedBasic' | 'roundedRed' | 'gradient'
type Size = 'default' | 'sm' | 'lg' | 'icon'

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset'
  variant?: Variant
  size?: Size
  onClick?: () => void
  className?: string
  label: string | React.ReactNode
  isActive?: boolean
}

const VARIANT_STYLE: Record<Variant, string> = {
  basic:
    'bg-[var(--color-background)] rounded-md text-[var(--color-navy-gray)] border-[var(--color-accent)] hover:bg-[var(--color-accent)]',
  blue: 'bg-[var(--color-primary)] rounded-md text-[var(--color-foreground)] border-[var(--color-primary)] hover:brightness-105',
  roundedBasic:
    'bg-[var(--color-background)] rounded-full text-[var(--color-navy-gray)] border-[var(--color-accent)] hover:bg-[var(--color-accent)]',
  roundedRed:
    'bg-[var(--color-background)] rounded-full text-[var(--color-destructive)] border-[var(--color-destructive)] hover:bg-[var(--color-destructive)] hover:text-[var(--color-destructive-foreground)]',
  gradient:
    'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-coral-pink)] rounded-full text-[var(--color-foreground)] border-0 hover:opacity-90',
}

const VARIANT_ACTIVE_STYLE: Record<Variant, string> = {
  basic: 'bg-[var(--color-accent)]',
  blue: 'bg-[var(--color-primary)]',
  roundedBasic: 'bg-[var(--color-accent)]',
  roundedRed: 'bg-[var(--color-destructive)] text-[var(--color-popover)]',
  gradient: 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-coral-pink)]',
}

const SIZE_STYLE: Record<Size, string> = {
  default: 'h-10 px-4 text-sm',
  sm: 'h-9 px-3 text-xs',
  lg: 'h-11 px-8 text-base',
  icon: 'h-10 w-10 p-0',
}

export default function Button({
  type = 'button',
  variant = 'basic',
  size = 'default',
  onClick,
  className = '',
  label,
  isActive = false,
  ...props
}: ButtonProps) {
  // 기본 스타일
  //font-weight 속성 적용 안 됨.
  const base =
    'inline-flex items-center gap-2 whitespace-nowrap focus-visible:ring-* disabled:* ring-offset-background justify-center px-4 py-2 font-semibold border transition text-sm cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'

  return (
    <>
      <button
        type={type}
        onClick={onClick}
        className={cn(
          base,
          VARIANT_STYLE[variant],
          SIZE_STYLE[size],
          isActive ? VARIANT_ACTIVE_STYLE[variant] : '',
          className
        )}
        {...props}
      >
        {label}
      </button>
    </>
  )
}
