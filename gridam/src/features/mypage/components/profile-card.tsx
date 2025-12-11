import ProfileImage from '@/features/mypage/components/profile-image'
import { Card, CardBody } from '@/shared/ui/card'

interface ProfileCardProps {
  email: string
  nickname: string
  createdAt: string
}

interface ProfileField {
  label: string
  value: string
}

export default function ProfileCard({ email, nickname, createdAt }: ProfileCardProps) {
  const fields: ProfileField[] = [
    { label: '이메일', value: email },
    { label: '닉네임', value: nickname },
    { label: '가입일', value: createdAt },
  ]

  return (
    <Card className="w-full">
      <CardBody className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <ProfileImage name={nickname} />
        <div className="flex flex-col items-center sm:items-start gap-2">
          {fields.map(({ label, value }) => (
            <div key={label} className="text-center sm:text-left">
              <p className="text-sm sm:text-sm text-muted-foreground">{label}</p>
              <p className="text-lg sm:text-lg">{value}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
