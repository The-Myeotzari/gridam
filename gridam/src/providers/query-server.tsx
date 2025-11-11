import QueryProviderClient from '@/providers/query-client'
import { PropsWithChildren } from 'react'

export default function QueryProvider({ children }: PropsWithChildren) {
  return <QueryProviderClient>{children}</QueryProviderClient>
}
