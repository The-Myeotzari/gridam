import React from 'react'
import { renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useModal } from '@/hooks/use-modal'

// 1) 모달 스토어 모킹
jest.mock('@/store/modal-store', () => ({
  // useModalStore 훅 자체를 jest.fn으로 대체
  useModalStore: jest.fn(),
}))

// 2) 모킹 대상 가져와서 넓게 캐스팅 (TS2352 회피)
import { useModalStore } from '@/store/modal-store'
const mockedUseModalStore = useModalStore as unknown as jest.Mock

describe('useModal', () => {
  const mockOpen = jest.fn()
  const mockClose = jest.fn()
  // isOpen이 boolean인지 함수인지 프로젝트 구현에 맞게 선택
  // 여기선 boolean으로 가정 (함수라면: const mockIsOpen = jest.fn(() => false))
  const mockIsOpen = false

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseModalStore.mockReturnValue({
      open: mockOpen,
      close: mockClose,
      isOpen: mockIsOpen,
    })
  })

  it('open(render)를 호출하면 store.open이 render로 호출된다', () => {
    const { result } = renderHook(() => useModal())
    const renderFn = jest.fn().mockReturnValue(<div>Modal</div>)

    act(() => {
      result.current.open(renderFn)
    })

    expect(mockOpen).toHaveBeenCalledTimes(1)
    expect(mockOpen).toHaveBeenCalledWith(renderFn)
  })

  it('close() 호출 시 store.close가 실행된다', () => {
    const { result } = renderHook(() => useModal())

    act(() => {
      result.current.close()
    })

    expect(mockClose).toHaveBeenCalledTimes(1)
  })

  it('isOpen은 store.isOpen을 그대로 노출한다', () => {
    const { result } = renderHook(() => useModal())
    expect(result.current.isOpen).toBe(mockIsOpen) // boolean 기준
    // 만약 isOpen이 함수라면: expect(result.current.isOpen).toBe(mockIsOpen)
  })
})
