import { CanvasView } from '@/features/write/components/canvas/canvas-view'
import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/react'

describe('CanvasView', () => {
  it('ref가 있으면 canvas를 렌더링한다 (기본 height=600)', () => {
    const ref = { current: null } as React.RefObject<HTMLCanvasElement | null>
    const onDown = jest.fn()
    const onMove = jest.fn()
    const onUpLeave = jest.fn()

    render(
      <CanvasView
        canvasRef={ref}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUpOrLeave={onUpLeave}
      />
    )

    const el = document.querySelector(
      'canvas.block.w-full.rounded-xl.cursor-crosshair'
    ) as HTMLCanvasElement
    expect(el).toBeInTheDocument()
    // inline style height 확인
    expect(el).toHaveStyle({ height: '600px' })
  })

  it('height prop을 적용한다', () => {
    const ref = { current: null } as React.RefObject<HTMLCanvasElement | null>
    render(
      <CanvasView
        canvasRef={ref}
        onPointerDown={jest.fn()}
        onPointerMove={jest.fn()}
        onPointerUpOrLeave={jest.fn()}
        height={420}
      />
    )
    const el = document.querySelector('canvas') as HTMLCanvasElement
    expect(el).toHaveStyle({ height: '420px' })
  })

  it('포인터 이벤트 핸들러가 호출된다', () => {
    const ref = { current: null } as React.RefObject<HTMLCanvasElement | null>
    const onDown = jest.fn()
    const onMove = jest.fn()
    const onUpLeave = jest.fn()

    render(
      <CanvasView
        canvasRef={ref}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUpOrLeave={onUpLeave}
      />
    )
    const el = document.querySelector('canvas') as HTMLCanvasElement

    fireEvent.pointerDown(el)
    fireEvent.pointerMove(el)
    fireEvent.pointerUp(el)
    fireEvent.pointerLeave(el)

    expect(onDown).toHaveBeenCalled()
    expect(onMove).toHaveBeenCalled()
    expect(onUpLeave).toHaveBeenCalledTimes(2) // up + leave
  })

  it('canvasRef가 없으면 렌더링하지 않는다', () => {
    const { container } = render(
      <CanvasView
        canvasRef={null as any}
        onPointerDown={jest.fn()}
        onPointerMove={jest.fn()}
        onPointerUpOrLeave={jest.fn()}
      />
    )
    expect(container.firstChild).toBeNull()
  })
})
