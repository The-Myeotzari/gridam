import { CanvasToolbar } from '@/features/write/components/canvas/canvas-toolbar'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

jest.mock('@/components/ui/button', () => ({
  __esModule: true,
  default: ({ onClick, label, ...rest }: any) => (
    <button type="button" onClick={onClick} {...rest}>
      {label}
    </button>
  ),
}))

const toggleEraser = jest.fn()
const setColor = jest.fn()
let isEraser = false
let color = 'var(--color-canva-red)'

jest.mock('@/store/useCanvas', () => ({
  useCanvasStore: () => ({
    color,
    isEraser,
    toggleEraser,
    setColor,
  }),
}))

describe('CanvasToolbar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    isEraser = false
    color = 'var(--color-canva-red)'
  })

  it('팔레트 5개가 렌더링된다', () => {
    render(<CanvasToolbar handleUndo={jest.fn()} clearCanvas={jest.fn()} />)
    const groups = screen.getAllByRole('group', { hidden: true })
    const swatches = document.querySelectorAll('span[style*="background-color"]')
    expect(swatches.length).toBe(5)
  })

  it('지우개 토글 버튼이 렌더링되고 클릭 시 toggleEraser 호출', () => {
    render(<CanvasToolbar handleUndo={jest.fn()} clearCanvas={jest.fn()} />)
    const eraserBtn = screen.getByRole('button', { name: '🧽 지우개' })
    fireEvent.click(eraserBtn)
    expect(toggleEraser).toHaveBeenCalled()
  })

  it('되돌리기/삭제 버튼 클릭 시 콜백 호출', () => {
    const handleUndo = jest.fn()
    const clearCanvas = jest.fn()
    render(<CanvasToolbar handleUndo={handleUndo} clearCanvas={clearCanvas} />)

    const buttons = screen.getAllByRole('button')
    const lastTwo = buttons.slice(-2)
    fireEvent.click(lastTwo[0]) // undo
    fireEvent.click(lastTwo[1]) // trash
    expect(handleUndo).toHaveBeenCalled()
    expect(clearCanvas).toHaveBeenCalled()
  })

  it('팔레트 클릭 시 setColor 호출, isEraser=true면 먼저 toggleEraser 호출', () => {
    isEraser = true
    render(<CanvasToolbar handleUndo={jest.fn()} clearCanvas={jest.fn()} />)
    const firstSwatch = document.querySelector('span[style*="background-color"]')!
    const swatchButton = firstSwatch.closest('button')!
    fireEvent.click(swatchButton)

    expect(toggleEraser).toHaveBeenCalled()
    expect(setColor).toHaveBeenCalled()
  })
})
