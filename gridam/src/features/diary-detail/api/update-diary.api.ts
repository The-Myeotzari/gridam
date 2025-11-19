import { api } from '@/shared/lib/api'

type props = {
  id: string
  text: string
  imageUrl: string | null
}

export async function updateDiary({ id, text, imageUrl }: props) {
  await api.patch(`/diaries/${id}`, {
    content: text,
    imageUrl,
  })
}
