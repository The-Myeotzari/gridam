// TODO: 2차 개발 기간에 폴더 구조 확정 이후 위치 이동 필요
// File을 bole로
export async function getDataURLToBlob(dataURL: string): Promise<Blob> {
  const res = await fetch(dataURL)
  if (!res.ok) {
    throw new Error('dataURL을 Blob으로 변환하는 데 실패했습니다.')
  }
  return res.blob()
}

// Blob를 File로
export function getBlobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: blob.type })
}

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

export async function updateImageAction({
  imageUrl,
  oldImagePath,
  isImageChanged,
  cookieHeader,
}: {
  imageUrl?: string | null
  oldImagePath?: string | null
  isImageChanged: boolean
  cookieHeader: string
}) {
  let finalUrl = imageUrl ?? oldImagePath ?? ''

  if (!isImageChanged || !imageUrl) return finalUrl

  const blob = await getDataURLToBlob(imageUrl)
  const file = getBlobToFile(blob, 'image.png')

  const form = new FormData()
  form.append('file', file)

  const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads`, {
    method: 'POST',
    credentials: 'include',
    headers: { Cookie: cookieHeader },
    body: form,
  })

  const uploadJson = await uploadRes.json()
  if (!uploadRes.ok) throw new Error(uploadJson.message || '이미지 업로드 실패')

  return uploadJson.data?.url ?? null
  // NOTE: 이미지 파일 교체 이후 기존 이미지 삭제 여부 필요? -> 히스토리 기능이 들어갈까?
}
