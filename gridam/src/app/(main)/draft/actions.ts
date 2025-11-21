'use server'

import { MESSAGES } from '@/shared/constants/messages'
import { getCookies } from '@/shared/utils/get-cookies'
import { revalidatePath } from 'next/cache'

export async function fetchDraftAction() {
  const cookieHeader = await getCookies()
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
  const cookieHeader = await getCookies()
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
