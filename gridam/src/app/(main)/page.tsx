'use client'

import useSupabaseBrowser from '@/utils/supabase/client'
import axios from 'axios'
import { useState } from 'react'

interface Diary {
  content: string
  date: string
}

export default function Home() {
  const supabase = useSupabaseBrowser()
  const [error, setError] = useState<string | null>(null)
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError(null)
    setLoading(true)

    const email = 'test@example.com'
    const password = '12345678'

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error instanceof Error) {
      console.error('[signIn error]', {
        name: error.name,
        status: error.status,
        message: error.message,
      })
      setError(error.message)
      setLoading(false)
      return
    } else {
      setError('알 수 없는 오류가 발생했습니다.')
    }

    const token = data.session?.access_token
    if (!token) {
      setError('로그인 세션이 없습니다.')
      setLoading(false)
      return
    }

    try {
      // axios로 API 호출 (JWT 토큰 추가)
      const res = await axios.get('/api/diaries', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('📔 diaries', res.data)
      setDiaries(res.data)
    } catch (err: unknown) {
      console.error('게시글 불러오기 오류', err)
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-10 text-center">
      <h1 className="text-xl font-bold">📔 테스트 로그인</h1>

      <button
        onClick={handleLogin}
        className="bg-black text-white p-3 rounded hover:bg-gray-800 transition"
        disabled={loading}
      >
        {loading ? '불러오는 중...' : '기본 계정으로 로그인하고 게시글 보기'}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="mt-5 text-left">
        {diaries.length > 0
          ? diaries.map((d, i) => (
            <div key={i} className="border p-3 rounded mb-2">
              <p>{d.content}</p>
              <p className="text-xs text-gray-500">{d.date}</p>
            </div>
          ))
          : !loading && <p className="text-gray-500">게시글이 없습니다.</p>}
      </div>
    </div>
  )
}
