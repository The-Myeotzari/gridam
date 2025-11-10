import DropBox from '@/components/ui/dropbox'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

jest.mock('@/components/ui/button', () => ({
  __esModule: true,
  default: ({ label, onClick, className, ...rest }: any) => {
    return (
      <button type="button" onClick={onClick} className={className} aria-label={rest['aria-label']}>
        {label}
      </button>
    )
  },
}))

describe('<DropBox />', () => {
  test('트리거 버튼 렌더 및 클릭 시 메뉴 토글', () => {
    render(<DropBox />)
    const trigger = screen.getByRole('button', { name: '메뉴 열기' })
    expect(trigger).toBeInTheDocument()

    // 초기에는 메뉴가 안 보임
    expect(screen.queryByText('수정하기')).not.toBeInTheDocument()
    expect(screen.queryByText('삭제하기')).not.toBeInTheDocument()

    // 클릭 → 열림
    fireEvent.click(trigger)
    expect(screen.getByText('수정하기')).toBeInTheDocument()
    expect(screen.getByText('삭제하기')).toBeInTheDocument()

    // 다시 클릭 → 닫힘
    fireEvent.click(trigger)
    expect(screen.queryByText('수정하기')).not.toBeInTheDocument()
    expect(screen.queryByText('삭제하기')).not.toBeInTheDocument()
  })

  test('custom 라벨 출력', () => {
    render(<DropBox editLabel="Edit" deleteLabel="Remove" />)
    fireEvent.click(screen.getByRole('button', { name: '메뉴 열기' }))
    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Remove')).toBeInTheDocument()
  })

  test('onEdit 호출 후 닫힘', () => {
    const onEdit = jest.fn()
    render(<DropBox onEdit={onEdit} />)

    fireEvent.click(screen.getByRole('button', { name: '메뉴 열기' }))
    const editBtn = screen.getByText('수정하기')
    fireEvent.click(editBtn)

    expect(onEdit).toHaveBeenCalledTimes(1)
    // 닫혔는지 확인
    expect(screen.queryByText('수정하기')).not.toBeInTheDocument()
  })

  test('onDelete 호출 후 닫힘', () => {
    const onDelete = jest.fn()
    render(<DropBox onDelete={onDelete} />)

    fireEvent.click(screen.getByRole('button', { name: '메뉴 열기' }))
    const delBtn = screen.getByText('삭제하기')
    fireEvent.click(delBtn)

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('삭제하기')).not.toBeInTheDocument()
  })

  test('바깥 클릭 시 닫힘(mousedown)', () => {
    render(<DropBox />)
    fireEvent.click(screen.getByRole('button', { name: '메뉴 열기' }))
    expect(screen.getByText('수정하기')).toBeInTheDocument()

    // 컴포넌트 바깥(document) 클릭 → 닫힘
    fireEvent.mouseDown(document.body)
    expect(screen.queryByText('수정하기')).not.toBeInTheDocument()
  })

  test('ESC 키 입력 시 닫힘', () => {
    render(<DropBox />)
    fireEvent.click(screen.getByRole('button', { name: '메뉴 열기' }))
    expect(screen.getByText('삭제하기')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('삭제하기')).not.toBeInTheDocument()
  })

  test('root className merge 확인', () => {
    const { container } = render(<DropBox className="extra-root" />)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveClass('extra-root')
    expect(root).toHaveClass('relative')
    expect(root).toHaveClass('inline-block')
  })
})
