import Header from '@/components/common/header'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// next/image mock
jest.mock('next/image', () => (props: any) => {
  const { src, alt, ...rest } = props
  return <img src={src} alt={alt} {...rest} />
})

// next/link mock
jest.mock('next/link', () => {
  return ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  )
})

// HeaderNavLink mock
jest.mock('@/features/layout/components/header-navlink', () => {
  return function MockNavLink({ href, label }: { href: string; label: string }) {
    return (
      <a href={href} data-testid={`nav-${label}`}>
        {label}
      </a>
    )
  }
})

// HeaderUserMenu mock
jest.mock('@/features/layout/components/header-user-menu', () => {
  return function MockUserMenu() {
    return <div data-testid="user-menu">USER_MENU</div>
  }
})

describe('Header', () => {
  it('로고 텍스트와 홈 링크를 렌더링한다', () => {
    render(<Header />)
    const homeLink = screen.getByRole('link', { name: /그리담 GRIDAM/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('파비콘 이미지를 올바른 alt/src로 렌더링한다', () => {
    render(<Header />)
    const logoImg = screen.getByAltText('그리담 GRIDAM')
    expect(logoImg).toBeInTheDocument()
    expect(logoImg).toHaveAttribute('src', '/favicon.ico')
  })

  it('네비게이션 링크를 렌더링한다', () => {
    render(<Header />)
    expect(screen.getByTestId('nav-피드')).toHaveAttribute('href', '/')
    expect(screen.getByTestId('nav-캘린더')).toHaveAttribute('href', '/calendar')
  })

  it('사용자 메뉴를 렌더링한다', () => {
    render(<Header />)
    expect(screen.getByTestId('user-menu')).toBeInTheDocument()
  })
})
