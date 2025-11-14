import Button, { ButtonProps } from '@/components/ui/button'
import cn from '@/utils/cn'

// TODO: 버튼 컴포넌트 업데이트 수정 필요
type WriteButtonProps = {
  isPending?: boolean
} & Omit<ButtonProps, 'disabled'>

export default function WriteButton({ isPending, className, ...buttonProps }: WriteButtonProps) {
  return (
    <Button
      {...buttonProps}
      size="sm"
      // disabled={buttonProps.disabled || isPending}
      className={cn('rounded-2xl sm:h-11 sm:px-8 sm:text-base', className)}
    />
  )
}
