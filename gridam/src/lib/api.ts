import axios, { AxiosError } from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '/apis',
  timeout: 5000,
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response

      if (status === 401) {
        console.warn('토큰이 만료되었습니다. 다시 로그인해주세요.')
      } else if (status === 500) {
        console.error('서버 오류가 발생했습니다.')
      }
    }
    return Promise.reject(error)
  }
)
