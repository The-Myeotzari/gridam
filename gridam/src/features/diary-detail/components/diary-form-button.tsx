import Button, { ButtonProps } from '@/components/ui/button'
import cn from '@/utils/cn'

type WriteButtonProps = {
  isPending?: boolean
} & ButtonProps

export default function DiaryFormButton({
  isPending,
  className,
  ...buttonProps
}: WriteButtonProps) {
  return (
    <Button
      {...buttonProps}
      size="sm"
      disabled={buttonProps.disabled || isPending}
      className={cn('rounded-2xl sm:h-11 sm:px-8 sm:text-base', className)}
    />
  )
}
