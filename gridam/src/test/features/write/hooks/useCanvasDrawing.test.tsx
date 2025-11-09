import { useCanvasDrawing } from '@/features/write/hooks/useCanvasDrawing'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

// ---------- Store mock ----------
const mockPushSnapshot = jest.fn()
const mockUndo = jest.fn()
const mockClearHistory = jest.fn()
const mockToggleEraser = jest.fn()
const mockSetColor = jest.fn()

let mockColor = '#ff0000'
let mockIsEraser = false

jest.mock('@/features/write/store/useCanvas', () => ({
  useCanvasStore: () => ({
    color: mockColor,
    isEraser: mockIsEraser,
    toggleEraser: mockToggleEraser,
    setColor: mockSetColor,
    pushSnapshot: mockPushSnapshot,
    undo: mockUndo,
    clearHistory: mockClearHistory,
  }),
}))

// ---------- Canvas / 2D Context mock ----------
type Ctx = CanvasRenderingContext2D & {
  __calls?: {
    beginPath: number
    moveTo: Array<[number, number]>
    lineTo: Array<[number, number]>
    stroke: number
    closePath: number
    clearRect: Array<[number, number, number, number]>
    setTransform: Array<[number, number, number, number, number, number]>
    putImageData: number
  }
}

let lastCanvas: HTMLCanvasElement | null = null

const makeCtx = (): Ctx => {
  const ctx: any = {
    lineCap: 'round',
    lineWidth: 0,
    globalCompositeOperation: 'source-over',
    strokeStyle: '#000',
    __calls: {
      beginPath: 0,
      moveTo: [] as Array<[number, number]>,
      lineTo: [] as Array<[number, number]>,
      stroke: 0,
      closePath: 0,
      clearRect: [] as Array<[number, number, number, number]>,
      setTransform: [] as Array<[number, number, number, number, number, number]>,
      putImageData: 0,
    },
    beginPath: jest.fn(function () {
      this.__calls.beginPath++
    }),
    moveTo: jest.fn(function (x: number, y: number) {
      this.__calls.moveTo.push([x, y])
    }),
    lineTo: jest.fn(function (x: number, y: number) {
      this.__calls.lineTo.push([x, y])
    }),
    stroke: jest.fn(function () {
      this.__calls.stroke++
    }),
    closePath: jest.fn(function () {
      this.__calls.closePath++
    }),
    clearRect: jest.fn(function (x: number, y: number, w: number, h: number) {
      this.__calls.clearRect.push([x, y, w, h])
    }),
    setTransform: jest.fn(function (
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number
    ) {
      this.__calls.setTransform.push([a, b, c, d, e, f])
    }),
    getImageData: jest.fn(() => {
      const w = lastCanvas?.width ?? 0
      const h = lastCanvas?.height ?? 0
      return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h } as ImageData
    }),
    putImageData: jest.fn(function () {
      this.__calls.putImageData++
    }),
  }
  return ctx as Ctx
}

const mockCtx = makeCtx()
type AnyFunc = (this: any, ...args: any[]) => any

// JSDOM에는 getContext가 없으므로 프로토타입을 패치
beforeAll(() => {
  // DPR
  Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true })

  // 1) getContext 모킹 구현을 'this' 타입 포함해 선언
  const getContextImpl = function (this: HTMLCanvasElement, type: string) {
    if (type === '2d') {
      lastCanvas = this
      return mockCtx
    }
    return null
  }

  // 2) spyOn + mockImplementation에 넓은 시그니처로 캐스팅
  jest
    .spyOn(HTMLCanvasElement.prototype as any, 'getContext')
    .mockImplementation(getContextImpl as unknown as AnyFunc)

  // getComputedStyle: CSS 변수 해석용
  jest.spyOn(window, 'getComputedStyle').mockImplementation((): any => ({
    getPropertyValue: (name: string) => {
      if (name === '--resolved') return '#123456'
      return ''
    },
  }))
})

beforeEach(() => {
  jest.clearAllMocks()
  // 컨텍스트 호출 기록 초기화
  mockCtx.__calls!.beginPath = 0
  mockCtx.__calls!.moveTo = []
  mockCtx.__calls!.lineTo = []
  mockCtx.__calls!.stroke = 0
  mockCtx.__calls!.closePath = 0
  mockCtx.__calls!.clearRect = []
  mockCtx.__calls!.setTransform = []
  mockCtx.__calls!.putImageData = 0

  mockColor = '#ff0000'
  mockIsEraser = false
})

// ---------- Test host component ----------
function Host() {
  const { canvasRef, onPointerDown, onPointerMove, onPointerUpOrLeave, handleUndo, clearCanvas } =
    useCanvasDrawing()

  // 캔버스 요소에 clientWidth/Height를 부여 (setupCanvas에서 읽음)
  return (
    <div>
      <canvas
        ref={canvasRef}
        data-testid="cnv"
        style={{ width: '600px', height: '300px' }}
        // jsdom에서는 clientWidth/Height가 0일 수 있어 getter를 강제
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUpOrLeave}
        onPointerLeave={onPointerUpOrLeave}
      />
      <button onClick={handleUndo}>undo</button>
      <button onClick={clearCanvas}>clear</button>
      {/* 포인터 이벤트는 canvas에 보내므로 여기선 노출 안 함 */}
      <span data-testid="ready">ready</span>
    </div>
  )
}

// clientWidth/Height를 강제로 지정하는 유틸
const setClientRect = (el: HTMLElement, w: number, h: number) => {
  Object.defineProperty(el, 'clientWidth', { value: w, configurable: true })
  Object.defineProperty(el, 'clientHeight', { value: h, configurable: true })
  // pointer capture stub
  ;(el as any).setPointerCapture = jest.fn()
  ;(el as any).releasePointerCapture = jest.fn()
}

describe('useCanvasDrawing', () => {
  it('마운트 시 DPR 반영해 캔버스 크기를 설정하고 초기 스냅샷을 push한다', () => {
    render(<Host />)
    const canvas = screen.getByTestId('cnv') as HTMLCanvasElement
    setClientRect(canvas, 600, 300)

    // setupCanvas는 effect에서 실행되므로, width/height가 DPR(2) 반영되어야 함
    expect(canvas.width).toBe(1200)
    expect(canvas.height).toBe(600)

    // setTransform 호출 확인
    expect(mockCtx.__calls!.setTransform.length).toBe(1)
    expect(mockCtx.__calls!.setTransform[0][0]).toBe(2) // a = DPR

    // 초기 스냅샷 push
    expect(mockPushSnapshot).toHaveBeenCalledTimes(1)
  })

  it('onPointerDown: eraser=false일 때 source-over, strokeStyle=color, beginPath/moveTo 호출', () => {
    render(<Host />)
    const canvas = screen.getByTestId('cnv') as HTMLCanvasElement
    setClientRect(canvas, 600, 300)

    // 일반 펜 (color = #ff0000)
    fireEvent.pointerDown(canvas, {
      pointerId: 1,
      clientX: 10,
      clientY: 20,
      // offsetX/Y는 nativeEvent 안쪽에서 쓰이지만 RTL에서는 직접 매핑됨
      nativeEvent: { offsetX: 10, offsetY: 20 } as any,
    })

    expect((canvas as any).setPointerCapture).toHaveBeenCalledTimes(1)
    expect(mockCtx.globalCompositeOperation).toBe('source-over')
    expect(mockCtx.strokeStyle).toBe('#ff0000')
    expect(mockCtx.lineWidth).toBe(4)
    expect(mockCtx.__calls!.beginPath).toBe(1)
    expect(mockCtx.__calls!.moveTo.length).toBeGreaterThan(0)
    expect(Array.isArray(mockCtx.__calls!.moveTo[0])).toBe(true)
  })

  it('onPointerDown: eraser=true일 때 destination-out, lineWidth=15', () => {
    mockIsEraser = true
    render(<Host />)
    const canvas = screen.getByTestId('cnv') as HTMLCanvasElement
    setClientRect(canvas, 600, 300)

    fireEvent.pointerDown(canvas, {
      pointerId: 2,
      clientX: 10,
      clientY: 20,
      nativeEvent: { offsetX: 10, offsetY: 20 } as any,
    })

    expect(mockCtx.globalCompositeOperation).toBe('destination-out')
    expect(mockCtx.lineWidth).toBe(15)
  })

  it('CSS 변수 색상( var(--resolved) )을 strokeStyle로 해석한다', () => {
    mockColor = 'var(--resolved)'
    render(<Host />)
    const canvas = screen.getByTestId('cnv') as HTMLCanvasElement
    setClientRect(canvas, 600, 300)

    fireEvent.pointerDown(canvas, {
      pointerId: 3,
      clientX: 10,
      clientY: 20,
      nativeEvent: { offsetX: 10, offsetY: 20 } as any,
    })
    expect(mockCtx.strokeStyle).toBe('#123456') // getComputedStyle 모킹값
  })

  it('onPointerMove: 드로잉 중일 때 lineTo/stroke 호출', () => {
    render(<Host />)
    const canvas = screen.getByTestId('cnv') as HTMLCanvasElement
    setClientRect(canvas, 600, 300)

    // down → move
    fireEvent.pointerDown(canvas, {
      pointerId: 1,
      clientX: 10,
      clientY: 20,
      nativeEvent: { offsetX: 10, offsetY: 20 } as any,
    })
    fireEvent.pointerMove(canvas, {
      clientX: 7,
      clientY: 9,
      nativeEvent: { offsetX: 7, offsetY: 9 } as any,
    })

    expect(mockCtx.__calls!.lineTo.length).toBeGreaterThan(0)
    expect(Array.isArray(mockCtx.__calls!.lineTo[0])).toBe(true)
    expect(mockCtx.__calls!.stroke).toBe(1)
  })

  it('onPointerUpOrLeave: closePath 후 snapshot push, releasePointerCapture 호출', () => {
    render(<Host />)
    const canvas = screen.getByTestId('cnv') as HTMLCanvasElement
    setClientRect(canvas, 600, 300)

    fireEvent.pointerDown(canvas, {
      pointerId: 11,
      clientX: 10,
      clientY: 20,
      nativeEvent: { offsetX: 10, offsetY: 20 } as any,
    })
    fireEvent.pointerUp(canvas, {
      pointerId: 11,
      clientX: 3,
      clientY: 4,
      nativeEvent: { offsetX: 3, offsetY: 4 } as any,
    })

    expect((canvas as any).releasePointerCapture).toHaveBeenCalledTimes(1)
    expect(mockCtx.__calls!.closePath).toBe(1)
    // 초기 push + up 시 push → 총 2회
    expect(mockPushSnapshot).toHaveBeenCalledTimes(2)
  })

  it('handleUndo: undo() 결과가 있으면 putImageData 호출', () => {
    mockUndo.mockReturnValueOnce({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1,
    } as ImageData)
    render(<Host />)
    const canvas = screen.getByTestId('cnv') as HTMLCanvasElement
    setClientRect(canvas, 600, 300)
    fireEvent.click(screen.getByText('undo'))
    expect(mockUndo).toHaveBeenCalled()
    expect(mockCtx.__calls!.putImageData).toBe(1)
  })

  it('clearCanvas: clearRect 호출, clearHistory 후 빈 스냅샷 push', () => {
    render(<Host />)
    const canvas = screen.getByTestId('cnv') as HTMLCanvasElement
    setClientRect(canvas, 600, 300)
    fireEvent.click(screen.getByText('clear'))

    expect(mockCtx.__calls!.clearRect.length).toBe(1)
    expect(mockClearHistory).toHaveBeenCalled()
    // 초기 push + clear 직후 push → 총 2회
    expect(mockPushSnapshot).toHaveBeenCalledTimes(2)
  })

  it('resize: 이전 이미지 저장 후 setupCanvas 재적용, putImageData 시도', () => {
    render(<Host />)
    const canvas = screen.getByTestId('cnv') as HTMLCanvasElement
    setClientRect(canvas, 600, 300)

    // 리사이즈 트리거
    window.dispatchEvent(new Event('resize'))
    // prev를 putImageData로 복원 시도 → 호출 1회 이상
    expect(mockCtx.__calls!.putImageData).toBeGreaterThanOrEqual(1)
  })
})
