import { Suspense } from 'react'
import LoginForm from './login-form'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
