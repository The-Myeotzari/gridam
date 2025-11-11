import Button from '@/components/ui/button.client'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

describe('<Button />', () => {
  test('label(string) 렌더링', () => {
    render(<Button label="클릭" />)
    expect(screen.getByRole('button', { name: '클릭' })).toBeInTheDocument()
  })

  test('label(ReactNode) 렌더링', () => {
    render(<Button label={<span data-testid="node">노드</span>} />)
    expect(screen.getByTestId('node')).toHaveTextContent('노드')
  })

  test('기본 props(type=button, variant=basic, size=default) 클래스 포함', () => {
    render(<Button label="버튼" />)
    const btn = screen.getByRole('button', { name: '버튼' })
    // type
    expect(btn).toHaveAttribute('type', 'button')
    // variant 기본(basic) 일부 토큰 확인
    expect(btn.className).toContain('bg-[var(--color-background)]')
    expect(btn.className).toContain('text-[var(--color-navy-gray)]')
    // size 기본(default)
    expect(btn.className).toContain('h-10')
    expect(btn.className).toContain('px-4')
  })

  test('variant=blue 적용', () => {
    render(<Button label="파랑" variant="blue" />)
    const btn = screen.getByRole('button', { name: '파랑' })
    expect(btn.className).toContain('bg-[var(--color-primary)]')
    expect(btn.className).toContain('text-[var(--color-foreground)]')
    expect(btn.className).toContain('border-[var(--color-primary)]')
  })

  test('variant=roundedRed + isActive=true 시 active 스타일 합쳐짐', () => {
    render(<Button label="위험" variant="roundedRed" isActive />)
    const btn = screen.getByRole('button', { name: '위험' })
    // 기본 variant 스타일
    expect(btn.className).toContain('rounded-full')
    expect(btn.className).not.toContain('text-[var(--color-destructive)]')
    // 활성화 스타일 추가
    expect(btn.className).toContain('bg-[var(--color-destructive)]')
    expect(btn.className).toContain('text-[var(--color-popover)]')
  })

  test('variant=gradient 적용', () => {
    render(<Button label="그라데이션" variant="gradient" />)
    const btn = screen.getByRole('button', { name: '그라데이션' })
    expect(btn.className).toContain('bg-gradient-to-r')
    expect(btn.className).toContain('from-[var(--color-primary)]')
    expect(btn.className).toContain('to-[var(--color-coral-pink)]')
    expect(btn.className).toContain('rounded-full')
  })

  test('size=sm / lg / icon 클래스 토큰 체크', () => {
    const { rerender } = render(<Button label="S" size="sm" />)
    let btn = screen.getByRole('button', { name: 'S' })
    expect(btn.className).toContain('h-9')
    expect(btn.className).toContain('text-xs')

    rerender(<Button label="L" size="lg" />)
    btn = screen.getByRole('button', { name: 'L' })
    expect(btn.className).toContain('h-11')
    expect(btn.className).toContain('text-base')

    rerender(<Button label="I" size="icon" />)
    btn = screen.getByRole('button', { name: 'I' })
    expect(btn.className).toContain('w-10')
    expect(btn.className).toContain('p-0')
  })

  test('className은 추가로 merge됨', () => {
    render(<Button label="머지" className="extra-class" />)
    const btn = screen.getByRole('button', { name: '머지' })
    expect(btn.className).toContain('extra-class')
  })

  test('onClick 호출', () => {
    const handleClick = jest.fn()
    render(<Button label="클릭" onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button', { name: '클릭' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('type 속성 전달: submit/reset', () => {
    const { rerender } = render(<Button label="제출" type="submit" />)
    let btn = screen.getByRole('button', { name: '제출' })
    expect(btn).toHaveAttribute('type', 'submit')

    rerender(<Button label="리셋" type="reset" />)
    btn = screen.getByRole('button', { name: '리셋' })
    expect(btn).toHaveAttribute('type', 'reset')
  })
})
