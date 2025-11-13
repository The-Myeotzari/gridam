import { useCanvasStore } from '@/features/write/store/canvas-store'
import '@testing-library/jest-dom'
import { act } from '@testing-library/react'

const ensureImageData = () => {
  if (typeof ImageData === 'undefined') {
    ;(global as any).ImageData = class {
      data: Uint8ClampedArray
      width: number
      height: number
      constructor(width: number, height: number) {
        this.width = width
        this.height = height
        this.data = new Uint8ClampedArray(width * height * 4)
      }
    }
  }
}

const makeSnap = (w = 2, h = 2) => {
  ensureImageData()
  return new ImageData(w, h)
}

const resetStore = () => {
  // 함수들은 유지하고, 값만 초기화 (merge)
  useCanvasStore.setState({
    color: 'var(--color-canva-red)',
    isEraser: false,
    history: [],
    maxHistory: 50,
  })
}

describe('useCanvasStore', () => {
  beforeEach(() => {
    resetStore()
    jest.clearAllMocks()
  })

  it('초기 상태가 올바르다', () => {
    const { color, isEraser, history, maxHistory } = useCanvasStore.getState()
    expect(color).toBe('var(--color-canva-red)')
    expect(isEraser).toBe(false)
    expect(history).toEqual([])
    expect(maxHistory).toBe(50)
  })

  it('setColor: 색상을 변경하고 isEraser를 false로 만든다', () => {
    const { setColor, setIsEraser } = useCanvasStore.getState()

    act(() => {
      setIsEraser(true)
    })
    expect(useCanvasStore.getState().isEraser).toBe(true)

    act(() => {
      setColor('#00ff00')
    })
    const s = useCanvasStore.getState()
    expect(s.color).toBe('#00ff00')
    expect(s.isEraser).toBe(false) // setColor가 지우개 해제
  })

  it('setIsEraser / toggleEraser: 지우개 상태를 토글한다', () => {
    const { setIsEraser, toggleEraser } = useCanvasStore.getState()

    act(() => setIsEraser(true))
    expect(useCanvasStore.getState().isEraser).toBe(true)

    act(() => toggleEraser())
    expect(useCanvasStore.getState().isEraser).toBe(false)

    act(() => toggleEraser())
    expect(useCanvasStore.getState().isEraser).toBe(true)
  })

  it('pushSnapshot: 스냅샷을 히스토리에 추가한다', () => {
    const { pushSnapshot } = useCanvasStore.getState()
    const snap1 = makeSnap(2, 2)
    const snap2 = makeSnap(3, 3)

    act(() => {
      pushSnapshot(snap1)
      pushSnapshot(snap2)
    })

    const { history } = useCanvasStore.getState()
    expect(history.length).toBe(2)
    expect(history[0].width).toBe(2)
    expect(history[1].width).toBe(3)
  })

  it('pushSnapshot: maxHistory를 초과하면 오래된 스냅샷을 버린다(shift)', () => {
    // maxHistory를 3으로 줄여서 동작 확인
    useCanvasStore.setState({ maxHistory: 3 })
    const { pushSnapshot } = useCanvasStore.getState()

    act(() => {
      pushSnapshot(makeSnap(1, 1)) // A
      pushSnapshot(makeSnap(2, 2)) // B
      pushSnapshot(makeSnap(3, 3)) // C
      pushSnapshot(makeSnap(4, 4)) // D -> A는 제거되어야 함
    })

    const { history } = useCanvasStore.getState()
    expect(history.length).toBe(3)
    expect(history[0].width).toBe(2) // B
    expect(history[1].width).toBe(3) // C
    expect(history[2].width).toBe(4) // D
  })

  it('undo: 히스토리가 1개 이하면 null을 반환하고 아무 것도 하지 않는다', () => {
    const { pushSnapshot, undo } = useCanvasStore.getState()

    act(() => {
      pushSnapshot(makeSnap(5, 5)) // 히스토리 1개
    })
    expect(useCanvasStore.getState().history.length).toBe(1)

    let res: ImageData | null
    act(() => {
      res = undo()
    })
    expect(res!).toBeNull()
    expect(useCanvasStore.getState().history.length).toBe(1) // 그대로
  })

  it('undo: 마지막 이전 스냅샷을 반환하고, 히스토리에서 마지막 항목을 제거한다', () => {
    const { pushSnapshot, undo } = useCanvasStore.getState()

    const A = makeSnap(10, 10)
    const B = makeSnap(20, 20)
    const C = makeSnap(30, 30)

    act(() => {
      pushSnapshot(A)
      pushSnapshot(B)
      pushSnapshot(C)
    })
    expect(useCanvasStore.getState().history.length).toBe(3)

    let res: ImageData | null = null
    act(() => {
      res = undo()
    })
    // 반환값은 "이전 상태(= B)"여야 함. 그리고 히스토리는 [A, B]로 줄어듦.
    expect(res).not.toBeNull()
    expect(res!.width).toBe(20)
    expect(useCanvasStore.getState().history.length).toBe(2)
    expect(useCanvasStore.getState().history[1].width).toBe(20)
  })

  it('clearHistory: 히스토리를 비운다', () => {
    const { pushSnapshot, clearHistory } = useCanvasStore.getState()
    act(() => {
      pushSnapshot(makeSnap(1, 1))
      pushSnapshot(makeSnap(2, 2))
    })
    expect(useCanvasStore.getState().history.length).toBe(2)

    act(() => clearHistory())
    expect(useCanvasStore.getState().history).toEqual([])
  })
})
