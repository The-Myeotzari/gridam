import axios from 'axios'

type props = {
  id: string
  text: string
  imageUrl: string | null
}

export async function updateDiary({ id, text, imageUrl }: props) {
  await axios.patch(`/apis/diaries/${id}`, {
    content: text,
    imageUrl,
  })
}
