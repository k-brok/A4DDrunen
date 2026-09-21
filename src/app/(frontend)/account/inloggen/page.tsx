// app/(frontend)/account/inloggen/page.tsx
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

import { LoginForm } from './LoginForm'

export default async function LoginPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers })

  // Al ingelogd? Dan hoeft iemand niet nogmaals in te loggen.
  if (user) {
    redirect((user as any).role === 'klant' ? '/account' : '/admin')
  }

  return (
    <main className="mx-auto flex max-w-sm flex-col items-center gap-8 px-6 py-16">
      <h1 className="text-3xl font-bold">Inloggen</h1>

      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  )
}
