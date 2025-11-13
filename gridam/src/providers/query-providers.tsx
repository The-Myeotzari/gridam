import { ClientQueryProvider } from '@/providers/query-providers.client'
import type { ReactNode } from 'react'

export default function QueryProvider({ children }: { children: ReactNode }) {
  return <ClientQueryProvider>{children}</ClientQueryProvider>
}
