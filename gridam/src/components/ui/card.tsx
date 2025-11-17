import cn from '@/utils/cn'
import { ComponentPropsWithRef, ReactNode } from 'react'

type Align = 'vertical' | 'horizontal'
type IconSize = 'sm' | 'md' | 'lg'
type IndentSize = 'none' | 'sm' | 'md' | 'lg'

const ICON_BOX: Record<IconSize, string> = {
  sm: 'size-10',
  md: 'size-14',
  lg: 'size-20',
}

const INDENT_VAR: Record<IndentSize, string> = {
  none: '1.5rem',
  sm: '4.5rem',
  md: '5rem',
  lg: '5.5rem',
}

interface CardProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
  hoverable?: boolean
  indent?: IndentSize
}

export function Card({
  className,
  children,
  hoverable = false,
  indent = 'none',
  style,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-card relative rounded-2xl border crayon-border text-card-foreground shadow-sm',
        hoverable && 'bg-cream-white border-2 hover:bg-accent/10 transition-colors',
        className
      )}
      style={{ ...style, ['--gutter' as string]: INDENT_VAR[indent] }}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends ComponentPropsWithRef<'div'> {
  cardTitle?: ReactNode
  cardImage?: ReactNode
  cardDescription?: ReactNode
  right?: ReactNode
  iconSize?: IconSize
  align?: Align
}

export function CardHeader({
  className,
  cardTitle,
  cardImage,
  cardDescription,
  right,
  align = 'vertical',
  iconSize = 'md',
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'pt-6 px-6 text-card-foreground',
        'flex justify-between items-center gap-2',
        className
      )}
      {...props}
    >
      <div
        className={
          align === 'vertical'
            ? 'flex flex-col flex-1 items-center gap-1'
            : 'flex gap-2 items-center'
        }
      >
        {cardImage && (
          <div
            className={cn(
              'shrink-0 grid place-items-center overflow-hidden rounded-md',
              ICON_BOX[iconSize]
            )}
          >
            {cardImage}
          </div>
        )}
        <div className="flex flex-col gap-1">
          {cardTitle && cardTitle}
          {cardDescription && <span className="text-muted-foreground">{cardDescription}</span>}
        </div>
      </div>
      {right && right}
    </div>
  )
}

interface CardBodyProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
}

export function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div
      className={cn('p-6 flex-1 min-w-0 text-card-foreground', 'pl-(--gutter)', className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardFooterProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('p-6 flex items-center text-card-foreground', 'pl-(--gutter)', className)}
      {...props}
    >
      {children}
    </div>
  )
}
