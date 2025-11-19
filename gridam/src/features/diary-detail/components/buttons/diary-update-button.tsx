import DiaryFormButton from '@/features/diary-detail/components/diary-form-button'
import { MESSAGES } from '@/shared/constants/messages'

type props = {
  isPending: boolean
  onClick: () => void
}

export default function DiaryUpdateButton({ isPending, onClick }: props) {
  return (
    <span onClick={onClick}>
      <DiaryFormButton
        label={MESSAGES.COMMON.UPDATE_BUTTON}
        type="submit"
        variant="blue"
        isPending={isPending}
        className="ml-2"
      />
    </span>
  )
}
