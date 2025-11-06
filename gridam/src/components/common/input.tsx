'use client'
import * as React from 'react'
import cn from '@/utils/cn'

type SizeStyle = 'default' | 'sm' | 'md' | 'lg'
const SIZE_STYLE: Record<SizeStyle, string> = {
  default: 'h-10 w-72',
  sm: 'h-4 w-32',
  md: 'h-6 w-48',
  lg: 'h-8 w-64',
}

interface InputType extends React.ComponentProps<'input'> {
  sizeStyle?: SizeStyle
  type?: React.HTMLInputTypeAttribute
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputType>(
  ({ sizeStyle = 'default', type = 'text', className = '', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          SIZE_STYLE[sizeStyle],
          className
        )}
        ref={ref}
        {...props}
      ></input>
    )
  }
)

export default Input
