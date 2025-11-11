import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

function Probe() {
  const qc = useQueryClient()
  return <span data-testid="has-client">{String(!!qc)}</span>
}

function makeWrapper() {
  const client = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

describe('React Query provider', () => {
  it('컨텍스트를 제공한다', () => {
    const wrapper = makeWrapper()
    render(
      <>
        <Probe />
        <p>hello</p>
      </>,
      { wrapper }
    )

    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByTestId('has-client')).toHaveTextContent('true')
  })
})
