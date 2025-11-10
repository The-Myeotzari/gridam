import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card'
import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'

describe('<Card />', () => {
  test('children 렌더 + 기본 클래스 포함', () => {
    render(
      <Card data-testid="card">
        <span>내용</span>
      </Card>
    )
    const card = screen.getByTestId('card')
    expect(card).toHaveTextContent('내용')
    expect(card.className).toContain('bg-card')
    expect(card.className).toContain('rounded-2xl')
    expect(card.className).toContain('border')
    expect(card.className).toContain('crayon-border')
    expect(card.className).toContain('text-card-foreground')
    expect(card.className).toContain('shadow-sm')
  })

  test('hoverable=true 시 hover/두꺼운 border 스타일 추가', () => {
    render(
      <Card data-testid="card" hoverable>
        hover
      </Card>
    )
    const card = screen.getByTestId('card')
    expect(card.className).toContain('bg-cream-white')
    expect(card.className).toContain('border-2')
    expect(card.className).toContain('hover:bg-accent/10')
    expect(card.className).toContain('transition-colors')
  })

  test('className 병합', () => {
    render(
      <Card data-testid="card" className="extra-cls">
        x
      </Card>
    )
    const card = screen.getByTestId('card')
    expect(card.className).toContain('extra-cls')
  })

  test('indent에 따라 CSS 변수 --gutter 설정 (none, sm, md, lg)', () => {
    const { rerender } = render(<Card data-testid="card" indent="none" />)
    let card = screen.getByTestId('card')
    // style 속성은 문자열 비교 대신 getPropertyValue가 가장 안정적
    expect((card as HTMLElement).style.getPropertyValue('--gutter')).toBe('1rem')

    rerender(<Card data-testid="card" indent="sm" />)
    card = screen.getByTestId('card')
    expect((card as HTMLElement).style.getPropertyValue('--gutter')).toBe('4.5rem')

    rerender(<Card data-testid="card" indent="md" />)
    card = screen.getByTestId('card')
    expect((card as HTMLElement).style.getPropertyValue('--gutter')).toBe('5rem')

    rerender(<Card data-testid="card" indent="lg" />)
    card = screen.getByTestId('card')
    expect((card as HTMLElement).style.getPropertyValue('--gutter')).toBe('5.5rem')
  })
})

describe('<CardHeader />', () => {
  test('기본 레이아웃 클래스 포함 (수평 컨테이너)', () => {
    render(<CardHeader data-testid="hdr" />)
    const hdr = screen.getByTestId('hdr')
    expect(hdr.className).toContain('pt-4')
    expect(hdr.className).toContain('px-4')
    expect(hdr.className).toContain('text-card-foreground')
    expect(hdr.className).toContain('flex')
    expect(hdr.className).toContain('justify-between')
    expect(hdr.className).toContain('items-center')
    expect(hdr.className).toContain('gap-2')
  })

  test('align=vertical 일 때 내부 래퍼가 세로 정렬 클래스', () => {
    render(
      <CardHeader
        data-testid="hdr"
        cardTitle="타이틀"
        cardDescription="설명"
        cardImage={<img alt="icon" />}
        align="vertical"
      />
    )
    const hdr = screen.getByTestId('hdr')
    // 첫 번째 내부 컨테이너
    const inner = hdr.querySelector('div > div')
    expect(inner).toBeTruthy()
    // vertical: flex flex-col flex-1 items-center gap-1
    expect(inner!.className).toContain('flex')
    expect(inner!.className).toContain('flex-col')
    expect(inner!.className).toContain('flex-1')
    expect(inner!.className).toContain('items-center')
    expect(inner!.className).toContain('gap-1')

    // 이미지 박스(ICON_BOX md 기본: size-14)
    const imgBox = within(inner as HTMLElement).getByRole('img', { hidden: true }).parentElement!
    expect(imgBox.className).toContain('shrink-0')
    expect(imgBox.className).toContain('grid')
    expect(imgBox.className).toContain('place-items-center')
    expect(imgBox.className).toContain('overflow-hidden')
    expect(imgBox.className).toContain('rounded-md')
    expect(imgBox.className).toContain('size-14')

    // 타이틀/설명
    expect(hdr).toHaveTextContent('타이틀')
    expect(hdr).toHaveTextContent('설명')
    const descSpan = hdr.querySelector('span.text-muted-foreground')
    expect(descSpan).toBeInTheDocument()
  })

  test('align=horizontal 일 때 내부 래퍼가 가로 정렬 클래스', () => {
    render(<CardHeader data-testid="hdr" align="horizontal" cardTitle="제목" />)
    const hdr = screen.getByTestId('hdr')
    const inner = hdr.querySelector('div > div')
    expect(inner).toBeTruthy()
    // horizontal: flex gap-2 items-center
    expect(inner!.className).toContain('flex')
    expect(inner!.className).toContain('gap-2')
    expect(inner!.className).toContain('items-center')
    expect(inner!.className).not.toContain('flex-col')
  })

  test('iconSize=lg 적용 시 size-20 클래스', () => {
    render(<CardHeader data-testid="hdr" cardImage={<img alt="icon" />} iconSize="lg" />)
    const hdr = screen.getByTestId('hdr')
    const img = within(hdr).getByRole('img', { hidden: true })
    const box = img.parentElement!
    expect(box.className).toContain('size-20')
  })

  test('right 노드 렌더링', () => {
    render(<CardHeader data-testid="hdr" right={<button>액션</button>} />)
    expect(screen.getByRole('button', { name: '액션' })).toBeInTheDocument()
  })

  test('className 병합', () => {
    render(<CardHeader data-testid="hdr" className="extra-hdr" />)
    const hdr = screen.getByTestId('hdr')
    expect(hdr.className).toContain('extra-hdr')
  })
})

describe('<CardBody />', () => {
  test('기본 클래스 + pl-(--gutter) 포함 및 children 렌더', () => {
    render(
      <CardBody data-testid="body">
        <p>본문</p>
      </CardBody>
    )
    const body = screen.getByTestId('body')
    expect(body).toHaveTextContent('본문')
    expect(body.className).toContain('p-4')
    expect(body.className).toContain('flex-1')
    expect(body.className).toContain('min-w-0')
    expect(body.className).toContain('text-card-foreground')
    expect(body.className).toContain('pl-(--gutter)')
  })

  test('className 병합', () => {
    render(<CardBody data-testid="body" className="extra-body" />)
    const body = screen.getByTestId('body')
    expect(body.className).toContain('extra-body')
  })
})

describe('<CardFooter />', () => {
  test('기본 클래스 + pl-(--gutter) 포함 및 children 렌더', () => {
    render(
      <CardFooter data-testid="ftr">
        <span>푸터</span>
      </CardFooter>
    )
    const ftr = screen.getByTestId('ftr')
    expect(ftr).toHaveTextContent('푸터')
    expect(ftr.className).toContain('p-4')
    expect(ftr.className).toContain('items-center')
    expect(ftr.className).toContain('text-card-foreground')
    expect(ftr.className).toContain('pl-(--gutter)')
  })

  test('className 병합', () => {
    render(<CardFooter data-testid="ftr" className="extra-footer" />)
    const ftr = screen.getByTestId('ftr')
    expect(ftr.className).toContain('extra-footer')
  })
})
