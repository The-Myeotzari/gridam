import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Calendar, NotebookPen } from 'lucide-react'
import { ReactNode } from 'react'

interface MyStatsProps {
  totalDiaries: number
  totalDays: number
}

interface Stats {
  label: string
  value: number | string
  icon: ReactNode
}

export default function MyStats({ totalDiaries, totalDays }: MyStatsProps) {
  const stats: Stats[] = [
    {
      label: '작성한 일기',
      value: totalDiaries,
      icon: (
        <div className='p-4 rounded-full bg-primary/30'>
          <NotebookPen className='text-primary' />
        </div>
      )
    },
    {
      label: '작성 일수',
      value: `${totalDays}일`,
      icon: (
        <div className='p-4 rounded-full bg-secondary/30'>
          <Calendar />
        </div>
      )
    },
  ]
  return (
    <section className="w-full grid grid-cols-2 gap-6">
      {stats.map(({ label, value, icon }) => (
        <Card className="w-full" key={label}>
          <CardHeader
            cardImage={icon}
            cardDescription={label}
          />
          <CardBody className="text-center text-2xl font-bold">
            {value}
          </CardBody>
        </Card>
      ))}
    </section>
  )
}