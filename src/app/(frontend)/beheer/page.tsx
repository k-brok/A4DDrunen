import { cookies, headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function beheerPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/account/inloggen')
  }

  if (!['editor', 'klant'].includes((user as any).role)) {
    redirect('/geen-toegang')
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">Betaling is niet gelukt</h1>
      <p className="text-center text-lg">
        Dit is de beheerpagina van de avond4daagse. hier kun je de vrijwilligers en deelnemers
        beheren. Let op: dit is een beveiligde pagina, dus zorg ervoor dat je de juiste rechten hebt
        om toegang te krijgen.
      </p>
    </main>
  )
}
