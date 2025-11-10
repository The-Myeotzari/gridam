import Input from '@/components/ui/input'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'

describe('<Input />', () => {
  test('기본 렌더링 및 기본 클래스 포함', () => {
    render(<Input placeholder="입력" />)
    const input = screen.getByPlaceholderText('입력')

    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')

    // 기본 스타일 일부 확인
    expect(input.className).toContain('rounded-md')
    expect(input.className).toContain('border')
    expect(input.className).toContain('bg-background')

    // 기본 사이즈 스타일
    expect(input.className).toContain('h-10')
    expect(input.className).toContain('w-72')
  })

  test('type prop 전달 확인', () => {
    render(<Input type="password" placeholder="비밀번호" />)
    const input = screen.getByPlaceholderText('비밀번호')
    expect(input).toHaveAttribute('type', 'password')
  })

  test('sizeStyle 옵션(sm, md, lg)별 클래스 확인', () => {
    const { rerender } = render(<Input sizeStyle="sm" placeholder="s" />)
    let input = screen.getByPlaceholderText('s')
    expect(input.className).toContain('h-4')
    expect(input.className).toContain('w-32')

    rerender(<Input sizeStyle="md" placeholder="m" />)
    input = screen.getByPlaceholderText('m')
    expect(input.className).toContain('h-6')
    expect(input.className).toContain('w-48')

    rerender(<Input sizeStyle="lg" placeholder="l" />)
    input = screen.getByPlaceholderText('l')
    expect(input.className).toContain('h-8')
    expect(input.className).toContain('w-64')
  })

  test('className 병합', () => {
    render(<Input placeholder="merge" className="extra-class" />)
    const input = screen.getByPlaceholderText('merge')
    expect(input.className).toContain('extra-class')
  })

  test('ref forwarding 작동', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input placeholder="ref" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current?.placeholder).toBe('ref')
  })

  test('입력 이벤트 작동', () => {
    render(<Input placeholder="text" />)
    const input = screen.getByPlaceholderText('text') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'hello' } })
    expect(input.value).toBe('hello')
  })

  test('disabled 속성 적용', () => {
    render(<Input placeholder="disabled" disabled />)
    const input = screen.getByPlaceholderText('disabled')
    expect(input).toBeDisabled()
    expect(input.className).toContain('disabled:cursor-not-allowed')
  })
})
