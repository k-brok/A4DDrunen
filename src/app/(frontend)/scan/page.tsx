import { redirect } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

import { ScanClient } from './ScanClient'

export default async function ScanPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/account/inloggen?redirect=/scan')
  }
  if ((user as any).role === 'klant') {
    redirect('/account')
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-bold">Inchecken deelnemers</h1>
      <ScanClient />
    </main>
  )
}
