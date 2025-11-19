import { MESSAGES } from '@/constants/messages'
import DiaryFormButton from '@/features/diary-detail/components/diary-form-button'

type props = {
  isPending: boolean
  onClick: () => void
}

// 임시 저장 버튼 여기에 추가할까....
// 임시 수정의 경우도 여기인거 같은데..
export default function DiarySaveButton({ isPending, onClick }: props) {
  return (
    <span onClick={onClick}>
      <DiaryFormButton
        label={MESSAGES.COMMON.SAVE_BUTTON}
        type="submit"
        variant="blue"
        isPending={isPending}
        className="ml-2"
      />
    </span>
  )
}
