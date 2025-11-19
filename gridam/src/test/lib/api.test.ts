import { api } from '@/shared/lib/api'
import { AxiosError } from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('api axios instance', () => {
  let mock: MockAdapter
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/apis'

  beforeEach(() => {
    mock = new MockAdapter(api)
    jest.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    mock.reset()
  })

  test('기본 설정(baseURL, timeout, withCredentials)이 올바르게 설정됨', () => {
    expect(api.defaults.baseURL).toBe(baseURL)
    expect(api.defaults.timeout).toBe(5000)
    expect(api.defaults.withCredentials).toBe(true)
  })

  test('요청 인터셉터: access_token이 있을 때 Authorization 헤더 추가', async () => {
    localStorage.setItem('access_token', 'TEST_TOKEN')
    mock.onGet('/hello').reply(200, { message: 'hi' })

    const res = await api.get('/hello')

    expect(res.status).toBe(200)
    // Authorization 헤더가 붙었는지 확인
    const headers = mock.history.get[0].headers
    expect(headers?.Authorization).toBe('Bearer TEST_TOKEN')
  })

  test('요청 인터셉터: access_token이 없으면 Authorization 헤더 없음', async () => {
    mock.onGet('/no-token').reply(200, { ok: true })

    const res = await api.get('/no-token')

    expect(res.status).toBe(200)
    const headers = mock.history.get[0].headers
    expect(headers?.Authorization).toBeUndefined()
  })

  test('응답 인터셉터: 401 에러 시 콘솔 경고 출력', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    mock.onGet('/unauthorized').reply(401)

    await expect(api.get('/unauthorized')).rejects.toBeInstanceOf(AxiosError)
    expect(warnSpy).toHaveBeenCalledWith('토큰이 만료되었습니다. 다시 로그인해주세요.')
    warnSpy.mockRestore()
  })

  test('응답 인터셉터: 500 에러 시 콘솔 에러 출력', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mock.onGet('/server-error').reply(500)

    await expect(api.get('/server-error')).rejects.toBeInstanceOf(AxiosError)
    expect(errorSpy).toHaveBeenCalledWith('서버 오류가 발생했습니다.')
    errorSpy.mockRestore()
  })

  test('응답 인터셉터: 정상 응답은 그대로 반환', async () => {
    mock.onGet('/ok').reply(200, { data: 'OK' })
    const res = await api.get('/ok')
    expect(res.status).toBe(200)
    expect(res.data).toEqual({ data: 'OK' })
  })
})
