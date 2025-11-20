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
