import ClientButton, { type ClientButtonProps } from '@/shared/ui/client-button'
import cn from '@/shared/utils/cn'

type WriteButtonProps = {
  isPending?: boolean
} & ClientButtonProps

export default function DiaryFormButton({
  isPending,
  className,
  ...buttonProps
}: WriteButtonProps) {
  return (
    <ClientButton
      {...buttonProps}
      size="sm"
      disabled={buttonProps.disabled || isPending}
      className={cn('rounded-2xl sm:h-11 sm:px-8 sm:text-base', className)}
    />
  )
}
