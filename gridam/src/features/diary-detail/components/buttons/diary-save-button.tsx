import { MESSAGES } from '@/constants/messages'
import DiaryFormButton from '@/features/diary-detail/components/diary-form-button'

type props = {
  createPending: boolean
  uploadPending: boolean
}

export default function DiarySaveButton({ createPending, uploadPending }: props) {
  return (
    <DiaryFormButton
      label={MESSAGES.COMMON.SAVE_BUTTON}
      type="submit"
      variant="blue"
      isPending={createPending || uploadPending}
      className="ml-2"
    />
  )
}
