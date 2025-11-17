export function formatDate(date?: string) {
  const target = date ? new Date(date) : new Date()

  return target.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}
