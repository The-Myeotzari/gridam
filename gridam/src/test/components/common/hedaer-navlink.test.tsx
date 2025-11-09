import HeaderNavLink from '@/components/common/header-navlink'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

jest.mock('next/link', () => {
  return ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  )
})

import { usePathname } from 'next/navigation'

describe('NavLink', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('현재 경로와 href가 같을 때 active 스타일을 적용한다', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/feed')

    render(<HeaderNavLink href="/feed" label="피드" activeColor="primary" />)

    const link = screen.getByRole('link', { name: '피드' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('현재 경로와 href가 다를 때 hover 스타일을 적용한다', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/')

    render(<HeaderNavLink href="/feed" label="피드" activeColor="primary" />)

    const link = screen.getByRole('link', { name: '피드' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveClass('hover:bg-primary', 'text-foreground')
  })

  it('activeColor가 accent일 때 색상 클래스가 올바르다', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/mypage')

    render(<HeaderNavLink href="/mypage" label="마이페이지" activeColor="accent" />)

    const link = screen.getByRole('link', { name: '마이페이지' })
    expect(link).toHaveAttribute('href', '/mypage')
    expect(link).toHaveClass('bg-accent', 'text-accent-foreground')
  })
})
