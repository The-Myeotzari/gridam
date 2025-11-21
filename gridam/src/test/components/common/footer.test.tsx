import Footer from '@/shared/ui/footer'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

describe('Footer', () => {
  it('renders the copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/그리담 © 묫자리팀/i)).toBeInTheDocument()
  })

  it('renders the GitHub link with correct href', () => {
    render(<Footer />)
    const link = screen.getByRole('link', {
      name: /https:\/\/github\.com\/The-Myeotzari\/gridam/i,
    })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://github.com/The-Myeotzari/gridam')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('has the correct footer structure', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass('mt-16', 'py-6', 'text-center', 'border-t', 'border-border')
  })
})
