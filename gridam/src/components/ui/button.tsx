import ButtonClient, { ButtonClientProps } from '@/components/ui/button.client'

export default function Button(props: ButtonClientProps) {
  // 서버 → 클라이언트 경계에서 그대로 전달
  return <ButtonClient {...props} />
}
