import CanvasContainer from '@/features/write/components/canvas/canvas-container'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

const handleUndo = jest.fn()
const clearCanvas = jest.fn()
const onPointerDown = jest.fn()
const onPointerMove = jest.fn()
const onPointerUpOrLeave = jest.fn()
const canvasRef = { current: null } as React.RefObject<HTMLCanvasElement | null>

jest.mock('@/hooks/useCanvasDrawing', () => ({
  useCanvasDrawing: () => ({
    canvasRef,
    handleUndo,
    clearCanvas,
    onPointerDown,
    onPointerMove,
    onPointerUpOrLeave,
  }),
}))

jest.mock('@/components/canvas/canvas-toolbar', () => ({
  CanvasToolbar: ({ handleUndo, clearCanvas }: any) => (
    <div data-testid="toolbar">
      <button onClick={handleUndo}>undo</button>
      <button onClick={clearCanvas}>clear</button>
    </div>
  ),
}))

jest.mock('@/components/canvas/canvas-view', () => ({
  CanvasView: ({ canvasRef, onPointerDown, onPointerMove, onPointerUpOrLeave, height }: any) => (
    <div data-testid="view">
      <div data-testid="has-ref">{canvasRef ? 'yes' : 'no'}</div>
      <div data-testid="height">{String(height)}</div>
      <button onClick={onPointerDown}>down</button>
      <button onClick={onPointerMove}>move</button>
      <button onClick={onPointerUpOrLeave}>upLeave</button>
    </div>
  ),
}))

describe('CanvasContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Toolbar와 View를 렌더링하고 기본 height=600을 전달한다', () => {
    render(<CanvasContainer />)
    expect(screen.getByTestId('toolbar')).toBeInTheDocument()
    expect(screen.getByTestId('view')).toBeInTheDocument()
    expect(screen.getByTestId('has-ref')).toHaveTextContent('yes')
    expect(screen.getByTestId('height')).toHaveTextContent('600')
  })

  it('자식에서 발생한 이벤트가 hook 핸들러로 위임된다', () => {
    render(<CanvasContainer />)

    fireEvent.click(screen.getByText('undo'))
    fireEvent.click(screen.getByText('clear'))
    fireEvent.click(screen.getByText('down'))
    fireEvent.click(screen.getByText('move'))
    fireEvent.click(screen.getByText('upLeave'))

    expect(handleUndo).toHaveBeenCalled()
    expect(clearCanvas).toHaveBeenCalled()
    expect(onPointerDown).toHaveBeenCalled()
    expect(onPointerMove).toHaveBeenCalled()
    expect(onPointerUpOrLeave).toHaveBeenCalled()
  })
})
