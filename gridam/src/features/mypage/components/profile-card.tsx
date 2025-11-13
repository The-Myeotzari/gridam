import { Card, CardBody } from '@/components/ui/card'

interface ProfileCardProps {
  email: string
  nickname: string
  createdAt: string
}

export default function ProfileCard({ email, nickname, createdAt }: ProfileCardProps) {
  return (
    <Card className="w-full">
      <CardBody className="flex flex-col gap-2">
        <div>
          <p className="text-muted-foreground">이메일</p>
          <p className="text-xl">{email}</p>
        </div>
        <div>
          <p className="text-muted-foreground">닉네임</p>
          <p className="text-xl">{nickname}</p>
        </div>
        <div>
          <p className="text-muted-foreground">가입일</p>
          <p className="text-xl">{createdAt}</p>
        </div>
      </CardBody>
    </Card>
  )
}