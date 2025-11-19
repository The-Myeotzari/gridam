import { Card, CardBody, CardFooter, CardHeader } from '@/shared/ui/card'

type Props = {
  isFirst?: boolean
}

function FeedCardSkeletonBase({ isFirst }: Props) {
  return (
    <Card className="animate-pulse">
      <CardHeader
        cardImage={<div className="h-9 w-9 rounded-full bg-muted-foreground/20" />}
        right={<div className="h-6 w-10 rounded-md bg-muted-foreground/10" />}
        cardTitle={<div className="h-4 w-24 rounded-full bg-muted-foreground/20" />}
        align="horizontal"
        className="text-muted-foreground font-semibold"
      />

      <CardBody className="text-left space-y-2">
        <div className="h-4 w-3/4 rounded-full bg-muted-foreground/15" />
        <div className="h-4 w-full rounded-full bg-muted-foreground/10" />
        <div className="h-4 w-5/6 rounded-full bg-muted-foreground/10" />
      </CardBody>

      <CardFooter className="relative w-full aspect-square">
        <div
          className={`absolute inset-0 rounded-xl bg-muted-foreground/10 ${
            isFirst ? '' : 'bg-muted-foreground/5'
          }`}
        />
      </CardFooter>
    </Card>
  )
}

export default function FeedCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <FeedCardSkeletonBase key={index} isFirst={index === 0} />
      ))}
    </div>
  )
}
