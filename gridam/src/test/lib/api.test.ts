import { api } from '@/lib/api'

describe('api 설정 테스트', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
    localStorage.clear()
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('Axios 인스턴스가 올바르게 생성된다', () => {
    expect(api.defaults.timeout).toBe(5000)
    expect(api.defaults.baseURL).toBe(process.env.NEXT_PUBLIC_API_BASE_URL)
  })

  it('access_token이 있을 경우 Authorization 헤더가 추가된다', async () => {
    localStorage.setItem('access_token', 'test-token')

    const config = await (api.interceptors.request as any).handlers[0].fulfilled({
      headers: {},
    })

    expect(config.headers.Authorization).toBe('Bearer test-token')
  })

  it('access_token이 없을 경우 Authorization 헤더가 설정되지 않는다', async () => {
    localStorage.removeItem('access_token')

    const config = await (api.interceptors.request as any).handlers[0].fulfilled({
      headers: {},
    })

    expect(config.headers.Authorization).toBeUndefined()
  })
})
