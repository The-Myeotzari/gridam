export async function uploadDiaryImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.message || '이미지 업로드 실패')
  }

  return json.data as {
    path: string
    url: string | null // signed URL
  }
}
