import { useModalStore } from '@/store/modal-store'
import '@testing-library/jest-dom'
import { act } from '@testing-library/react'

describe('useModalStore', () => {
  beforeEach(() => {
    useModalStore.setState({ node: null, opener: null })
    document.body.innerHTML = ''
  })

  it('초기 상태가 올바르게 설정된다', () => {
    const { node, opener, isOpen } = useModalStore.getState()
    expect(node).toBeNull()
    expect(opener).toBeNull()
    expect(isOpen()).toBe(false)
  })

  it('open() 호출 시 node가 설정되고 opener가 저장된다', () => {
    const btn = document.createElement('button')
    document.body.appendChild(btn)
    btn.focus()

    act(() => {
      useModalStore.getState().open(() => <div data-testid="modal">Modal</div>)
    })

    const state = useModalStore.getState()
    expect(state.node).not.toBeNull()
    expect(state.opener).toBe(btn)
    expect(state.isOpen()).toBe(true)
  })

  it('close() 호출 시 node/opener 초기화 & opener에 focus 복원', () => {
    const btn = document.createElement('button')
    document.body.appendChild(btn)
    btn.focus()

    // 열기
    act(() => {
      useModalStore.getState().open(() => <div>Modal</div>)
    })

    // 초기 focus 호출 카운트는 제거 (또는 spy 설치 시점을 이 아래로 이동해도 됨)
    const focusSpy = jest.spyOn(btn, 'focus')
    focusSpy.mockClear()

    // 닫기
    act(() => {
      useModalStore.getState().close()
    })

    const state = useModalStore.getState()
    expect(state.node).toBeNull()
    expect(state.opener).toBeNull()
    expect(state.isOpen()).toBe(false)
    expect(focusSpy).toHaveBeenCalledTimes(1)
  })

  it('opener가 없을 때 close()는 오류 없이 동작한다', () => {
    act(() => {
      useModalStore.getState().open(() => <div>Modal</div>)
    })

    useModalStore.setState({ opener: null })

    expect(() => {
      act(() => useModalStore.getState().close())
    }).not.toThrow()
  })
})
