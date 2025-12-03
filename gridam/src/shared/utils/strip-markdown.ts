//캘린더-메모 : 메모 미리보기에 마크다운 표시 제거
export default function StripMarkDown(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, '') // 코드블록 제거
    .replace(/`[^`]*`/g, '') // 인라인 코드 제거
    .replace(/!\[[^\]]*]\([^)]*\)/g, '') // 이미지 제거
    .replace(/\[[^\]]*]\([^)]*\)/g, '') // 링크 제거
    .replace(/[*_~`]/g, '') // 기타 마크다운 문법 제거
    .replace(/^[-+*]\s+/gm, '') // 리스트 제거
    .replace(/#{1,6}\s+/g, '') // 제목 제거 (# ~ ######)
    .replace(/\s+/g, ' ') // 공백 정리
    .replace(/-/g, '') // 모든 대시 제거
    .trim()
}
