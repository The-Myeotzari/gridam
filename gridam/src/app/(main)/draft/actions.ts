'use server'

import { deleteImageAction } from '@/features/diary/apis/image.action'
import { API_ENDPOINTS } from '@/shared/constants/api.endpoints'
import { MESSAGES } from '@/shared/constants/messages'
import { URL_CONSTANTS } from '@/shared/constants/url.constants'
import { getCookies } from '@/shared/utils/get-cookies'
import { revalidatePath } from 'next/cache'

export async function fetchDraftAction() {
  const cookieHeader = await getCookies()
  const res = await fetch(`${API_ENDPOINTS.DRAFT.BASE}`, {
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

export async function deleteDraftAction(id: string, imagePath?: string | null) {
  if (!id) throw new Error(MESSAGES.DIARY.ERROR.READ)
  const cookieHeader = await getCookies()

  if (imagePath) {
    try {
      await deleteImageAction({ imagePath, cookieHeader })
    } catch (e) {
      console.warn('게시글 삭제 전 이미지 삭제 실패', e)
    }
  }

  const res = await fetch(`${API_ENDPOINTS.DRAFT.BY_ID(id)}`, {
    method: 'DELETE',
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      Cookie: cookieHeader,
    },
  })

  if (res.ok) {
    revalidatePath(URL_CONSTANTS.DRAFT)
  }

  return res.json()
}
