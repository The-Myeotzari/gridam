import { useQueryClient } from '@tanstack/react-query'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

// ✅ Devtools는 테스트에서 간단히 모킹
jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => <div data-testid="rq-devtools" />,
}))

// ✅ 테스트 대상 임포트 (프로젝트 경로에 맞게 수정)
import QueryProvider from '@/providers/query-provider' // 예: src/providers/query-provider.tsx

// 내부에서 queryClient가 실제로 주입됐는지 확인하는 Probe 컴포넌트
function Probe() {
  const qc = useQueryClient()
  return <span data-testid="has-client">{String(!!qc)}</span>
}

describe('<QueryProvider />', () => {
  it('children을 렌더링하고 React Query 컨텍스트를 제공한다', () => {
    render(
      <QueryProvider>
        <Probe />
        <p>hello</p>
      </QueryProvider>
    )

    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByTestId('has-client')).toHaveTextContent('true')
  })

  it('ReactQueryDevtools가 렌더링된다(모킹)', () => {
    render(
      <QueryProvider>
        <div />
      </QueryProvider>
    )
    expect(screen.getByTestId('rq-devtools')).toBeInTheDocument()
  })
})
