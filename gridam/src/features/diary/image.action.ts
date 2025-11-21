import { getBlobToFile, getDataURLToBlob } from '@/shared/utils/get-data-url-to-blob'

export async function saveImageAction({
  imageUrl,
  cookieHeader,
}: {
  imageUrl: string
  cookieHeader: string
}) {
  const blob = await getDataURLToBlob(imageUrl)
  const file = getBlobToFile(blob, 'image.png')

  const uploadForm = new FormData()
  uploadForm.append('file', file)

  const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads`, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
    headers: {
      Cookie: cookieHeader,
    },
    body: uploadForm,
  })

  const uploadJson = await uploadRes.json()
  if (!uploadRes.ok) {
    throw new Error(uploadJson.message || '이미지 업로드 실패')
  }

  return uploadJson.data?.url ?? null
}
