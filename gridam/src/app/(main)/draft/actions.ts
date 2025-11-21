'use server'

import { MESSAGES } from '@/shared/constants/messages'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function fetchDraftAction() {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/drafts`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
  })

  return res.json()
}

export async function deleteDraftAction(id: string) {
  if (!id) throw new Error(MESSAGES.DIARY.ERROR.READ)

  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/drafts/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      Cookie: cookieHeader,
    },
  })

  if (res.ok) {
    revalidatePath('/draft')
  }

  return res.json()
}
