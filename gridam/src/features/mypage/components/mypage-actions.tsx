import Button from '@/components/ui/button'
import { Key, LogOut } from 'lucide-react'

export default function MyPageActions() {
  return (
    <section className="flex gap-2">
      <Button
        label={
          <>
            <Key/>
            비밀번호 변경
          </>
        }
        className="flex-1"
        variant="roundedBasic"
      />
      <Button
        label={
          <>
            <LogOut/>
            로그아웃
          </>
        }
        className="flex-1"
        variant="roundedRed"
      />
    </section>
  )
}