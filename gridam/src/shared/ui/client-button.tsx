'use client'

import Button, { ButtonProps } from '@/shared/ui/button'
import React from 'react'

export interface ClientButtonProps extends ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function ClientButton(props: ClientButtonProps) {
  return <Button {...props} />
}
