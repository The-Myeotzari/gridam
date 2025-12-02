export function checkImageChanged(original: string | null, canvas: string | null) {
  if (!original && !canvas) return false
  if (!original && canvas) return true
  if (original && !canvas) return true
  if (original && canvas) return original !== canvas
  return false
}
