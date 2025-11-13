import Textarea from '@/components/ui/textarea'
import CanvasContainer from '@/features/write/components/canvas/canvas-container'
import WriteFooter from '@/features/write/components/write-footer'
import WriteHader from '@/features/write/components/write-header'

export default function Page() {
  return (
    <div
      className="max-w-4xl mx-auto border-2 border-solid bg-(--color-cream-white)"
      style={{ borderColor: 'black' }}
    >
      {/* 날짜 및 날씨 */}
      <WriteHader />

      {/* 그림 도구 및 그림판 */}
      <CanvasContainer />

      {/* 글작성 */}
      <section className="p-5">
        <Textarea />
      </section>

      <WriteFooter />
    </div>
  )
}
