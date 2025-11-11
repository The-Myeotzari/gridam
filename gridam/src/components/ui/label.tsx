import cn from '@/utils/cn'
import * as React from 'react'

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  size?: 'sm' | 'md'
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size = 'sm', ...props }, ref) => {
    const base =
      'font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
    const sizeClass = size === 'sm' ? 'text-sm' : 'text-base'

    return <label ref={ref} className={cn(base, sizeClass, className)} {...props} />
  }
)
Label.displayName = 'Label'

export default Label
