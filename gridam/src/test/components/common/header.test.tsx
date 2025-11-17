import Header from '@/components/common/header'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

jest.mock('next/image', () => (props: any) => {
  const { src, alt, ...rest } = props
  return <img src={src} alt={alt} {...rest} />
})

jest.mock('next/link', () => {
  return ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  )
})

jest.mock('@/components/common/header-navlink', () => {
  return function MockNavLink({ href, label }: { href: string; label: string }) {
    return (
      <a href={href} data-testid={`nav-${label}`}>
        {label}
      </a>
    )
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

  it('네비게이션 링크와 사용자명을 렌더링한다', () => {
    render(<Header />)
    expect(screen.getByTestId('nav-피드')).toHaveAttribute('href', '/')
    expect(screen.getByTestId('nav-마이페이지')).toHaveAttribute('href', '/mypage')
    expect(screen.getByText('별빛나눔')).toBeInTheDocument()
  })
})
