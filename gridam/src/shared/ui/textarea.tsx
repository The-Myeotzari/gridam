import { memo } from 'react'
import TextareaClient, { Props as TextareaProps } from './textarea.client'

function Textarea(props: TextareaProps) {
  return <TextareaClient {...props} />
}

export default memo(Textarea)
