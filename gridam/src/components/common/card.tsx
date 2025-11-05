import { ComponentPropsWithRef, ReactNode } from 'react'
import { X } from 'lucide-react'
import cn from '@/utils/cn'

interface CardProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card relative rounded-2xl border crayon-border text-card-foreground shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
  left?: ReactNode
  right?: ReactNode
  closable?: boolean
  onClose?: () => void
}

export function CardHeader({
  className,
  children,
  left,
  right,
  closable,
  onClose,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn('flex items-center justify-between p-6 text-card-foreground', className)}
      {...props}
    >
      {left && <div className="mr-4 shrink-0">{left}</div>}
      <div className="flex-1 min-w-0 hyphens-auto">
        {children}
      </div>
      {(right || closable) && (
        <div className="ml-4 flex items-center gap-4 shrink-0">
          {right}
          {closable && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="size-5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

interface CardContentProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('p-6 text-card-foreground', className)} {...props}>
      {children}
    </div>
  )
}

interface CardFooterProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn('flex items-center p-6 text-card-foreground', className)} {...props}>
      {children}
    </div>
  )
}
