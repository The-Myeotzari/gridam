import Button from '@/components/ui/button'

export default function WriteButtons() {
  return (
    <div className="text-center mb-4">
      <Button
        size="sm"
        label="취소하기"
        className="font-semibold mr-2 rounded-2xl sm:h-11 sm:px-8 sm:text-base"
      />
      <Button
        type="submit"
        variant="blue"
        size="sm"
        label="저장하기"
        className="font-bold ml-2 rounded-2xl sm:h-11 sm:px-8 sm:text-base"
      />
    </div>
  )
}
