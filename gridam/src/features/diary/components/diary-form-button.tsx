import ClientButton, { type ClientButtonProps } from '@/shared/ui/client-button'
import cn from '@/shared/utils/cn'

type WriteButtonProps = {
  disabled?: boolean
} & ClientButtonProps

export default function DiaryFormButton({ disabled, className, ...buttonProps }: WriteButtonProps) {
  return (
    <ClientButton
      {...buttonProps}
      size="sm"
      disabled={disabled}
      className={cn('rounded-2xl sm:h-11 sm:px-8 sm:text-base', className)}
    />
  )
}
