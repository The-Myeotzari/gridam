import { getCSSColor } from '@/shared/utils/get-css-color'
import * as THREE from 'three'

describe('getCSSColor', () => {
  beforeEach(() => {
    const mockGetComputedStyle = jest.fn().mockReturnValue({
      getPropertyValue: jest.fn((varName: string) => {
        switch (varName) {
          case '--color-red':
            return '#ff0000'
          case '--color-blue':
            return 'rgb(0, 0, 255)'
          default:
            return '#000000'
        }
      }),
    })
    // 글로벌 객체에 주입
    Object.defineProperty(window, 'getComputedStyle', {
      value: mockGetComputedStyle,
      writable: true,
    })
  })

  it('CSS 변수에서 HEX 색상값을 가져와 THREE.Color 인스턴스로 반환한다', () => {
    const color = getCSSColor('--color-red')
    expect(color).toBeInstanceOf(THREE.Color)
    expect(color.getHexString()).toBe('ff0000')
  })

  it('CSS 변수에서 RGB 색상값을 가져와 THREE.Color 인스턴스로 반환한다', () => {
    const color = getCSSColor('--color-blue')
    expect(color).toBeInstanceOf(THREE.Color)
    expect(color.getHexString()).toBe('0000ff')
  })

  it('존재하지 않는 CSS 변수일 경우 기본값(#000000)을 반환한다', () => {
    const color = getCSSColor('--color-unknown')
    expect(color.getHexString()).toBe('000000')
  })
})
