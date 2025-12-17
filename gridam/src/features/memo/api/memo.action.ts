'use server'

import { API_ENDPOINTS } from '@/shared/constants/api.endpoints'
import { MESSAGES } from '@/shared/constants/messages'
import { api } from '@/shared/lib/fetch-api'
import { getCookies } from '@/shared/utils/get-cookies'

export type Memo = {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  tags: string[] | null
}

type ApiResponse<T> = {
  ok: boolean
  data?: T
  message?: string
}

export async function getMemoListAction(limit = 50) {
  const cookieHeader = await getCookies()

  const url = new URL(`${API_ENDPOINTS.MEMO.BASE}`)
  url.searchParams.set('limit', String(limit))

  const res = await api(url.toString(), {
    cookieHeader,
    headers: {
      'Content-Type': 'application/json',
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

  const res = await api(`${API_ENDPOINTS.MEMO.BY_ID(id)}`, {
    cookieHeader,
    headers: {
      'Content-Type': 'application/json',
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
  tags: string[]
}

export async function createMemoAction(input: CreateMemoInput) {
  const cookieHeader = await getCookies()

  const res = await api(`${API_ENDPOINTS.MEMO.BASE}`, {
    method: 'POST',
    cookieHeader,
    headers: {
      'Content-Type': 'application/json',
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
  tags?: string[]
}

export async function updateMemoAction(input: UpdateMemoInput) {
  const { id, title, content, tags } = input

  if (!id) {
    throw new Error(MESSAGES.MEMO.ERROR.UPDATE_NO_DATA)
  }

  const cookieHeader = await getCookies()

  const res = await api(`${API_ENDPOINTS.MEMO.BY_ID(id)}`, {
    method: 'PATCH',
    cookieHeader,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content, tags }),
  })

  const json = (await res.json()) as ApiResponse<Memo>

  return json
}

export async function deleteMemoAction(id: string) {
  if (!id) {
    throw new Error(MESSAGES.MEMO.ERROR.DELETE)
  }

  const cookieHeader = await getCookies()

  const res = await api(`${API_ENDPOINTS.MEMO.BY_ID(id)}`, {
    method: 'DELETE',
    cookieHeader,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const json = (await res.json()) as ApiResponse<undefined>

  return json
}
