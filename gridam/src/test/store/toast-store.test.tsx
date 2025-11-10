import { toast, useToast } from '@/store/toast-store'
import { act } from '@testing-library/react'

describe('useToast', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    useToast.setState({ items: [] })
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  it('add() 호출 시 새로운 토스트가 추가된다', () => {
    act(() => {
      useToast.getState().add({ message: 'hello', type: 'success' })
    })
    const items = useToast.getState().items
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({
      message: 'hello',
      type: 'success',
      duration: 3000,
    })
  })

  it('remove() 호출 시 해당 id 토스트가 제거된다', () => {
    const add = useToast.getState().add
    act(() => {
      add({ message: 'A', type: 'success' })
      add({ message: 'B', type: 'error' })
    })
    const firstId = useToast.getState().items[0].id
    act(() => {
      useToast.getState().remove(firstId)
    })
    const items = useToast.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].message).toBe('B')
  })

  it('duration 후 자동으로 토스트가 제거된다', () => {
    act(() => {
      useToast.getState().add({ message: 'auto', type: 'success' })
    })
    const firstId = useToast.getState().items[0].id
    expect(useToast.getState().items).toHaveLength(1)

    // 타이머 경과
    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(useToast.getState().items.find((i) => i.id === firstId)).toBeUndefined()
  })

  it('toast.success() 헬퍼가 정상 작동한다', () => {
    act(() => {
      toast.success('yay!')
    })
    const items = useToast.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].type).toBe('success')
    expect(items[0].message).toBe('yay!')
  })

  it('toast.error() 헬퍼가 정상 작동한다', () => {
    act(() => {
      toast.error('oops!')
    })
    const items = useToast.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].type).toBe('error')
    expect(items[0].message).toBe('oops!')
  })
})
