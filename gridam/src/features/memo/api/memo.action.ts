'use server'

import { MESSAGES } from '@/shared/constants/messages'
import { getCookies } from '@/shared/utils/get-cookies'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export type Memo = {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

type ApiResponse<T> = {
  ok: boolean
  data?: T
  message?: string
}

export async function getMemoListAction(limit = 50) {
  const cookieHeader = await getCookies()

  const url = new URL(`${BASE_URL}/memos`)
  url.searchParams.set('limit', String(limit))

  const res = await fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
  })

  const json = (await res.json()) as ApiResponse<Memo[]>

  if (!res.ok || !json?.ok || !json.data) {
    return {
      ok: false as const,
      data: [] as Memo[],
    }
  }

  return {
    ok: true as const,
    data: json.data,
  }
}

export async function getMemoDetailAction(id: string) {
  if (!id) {
    throw new Error(MESSAGES.MEMO.ERROR.READ)
  }

  const cookieHeader = await getCookies()

  const res = await fetch(`${BASE_URL}/memos/${id}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
  })

  const json = (await res.json()) as ApiResponse<Memo>

  if (!res.ok || !json?.ok || !json.data) {
    return {
      ok: false as const,
      data: {} as Memo,
    }
  }

  return {
    ok: true as const,
    data: json.data,
  }
}

export type CreateMemoInput = {
  title: string
  content: string
}

export async function createMemoAction(input: CreateMemoInput) {
  const cookieHeader = await getCookies()

  const res = await fetch(`${BASE_URL}/memos`, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify(input),
  })

  const json = (await res.json()) as ApiResponse<Memo>

  return json
}

export type UpdateMemoInput = {
  id: string
  title?: string
  content?: string
}

export async function updateMemoAction(input: UpdateMemoInput) {
  const { id, title, content } = input

  if (!id) {
    throw new Error(MESSAGES.MEMO.ERROR.UPDATE_NO_DATA)
  }

  const cookieHeader = await getCookies()

  const res = await fetch(`${BASE_URL}/memos/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
    body: JSON.stringify({ title, content }),
  })

  const json = (await res.json()) as ApiResponse<Memo>

  return json
}

export async function deleteMemoAction(id: string) {
  if (!id) {
    throw new Error(MESSAGES.MEMO.ERROR.DELETE)
  }

  const cookieHeader = await getCookies()

  const res = await fetch(`${BASE_URL}/memos/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
  })

  const json = (await res.json()) as ApiResponse<undefined>

  return json
}
