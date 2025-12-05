import Input from '@/shared/ui/input'
import * as React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export default function ClientInput(props: Props) {
  return <Input {...props} />
}
