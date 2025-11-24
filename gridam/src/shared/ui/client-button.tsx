'use client'

import React from 'react'
import Button, { ButtonProps } from '@/shared/ui/button'

interface ClientButtonProps extends ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function ClientButton(props: ClientButtonProps) {
  return <Button {...props} />
}
