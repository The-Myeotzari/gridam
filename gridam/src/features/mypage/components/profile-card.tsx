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
      <CardBody className="flex flex-col gap-2">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <p className="text-sm sm:text-base text-muted-foreground">{label}</p>
            <p className="text-lg sm:text-xl">{value}</p>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}
