import { MESSAGES } from '@/constants/messages'
import DiaryFormButton from '@/features/diary-detail/components/diary-form-button'

type props = {
  updatePending: boolean
  uploadPending: boolean
}

export default function DiaryUpdateButton({ updatePending, uploadPending }: props) {
  return (
    <DiaryFormButton
      label={MESSAGES.COMMON.UPDATE_BUTTON}
      type="submit"
      variant="blue"
      isPending={updatePending || uploadPending}
      className="ml-2"
    />
  )
}
