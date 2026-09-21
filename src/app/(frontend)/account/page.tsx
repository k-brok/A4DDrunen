// app/(frontend)/account/page.tsx
import { redirect } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

import { Card, CardContent } from '@/components/ui/card'
import { LogoutButton } from './LogoutButton'
import { DeleteAccountButton } from './DeleteAccountButton'

const STATUS_LABELS: Record<string, string> = {
  pending: 'In afwachting',
  paid: 'Betaald',
  canceled: 'Geannuleerd',
  expired: 'Verlopen',
  failed: 'Mislukt',
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-green-100 text-green-800',
  canceled: 'bg-muted text-muted-foreground',
  expired: 'bg-muted text-muted-foreground',
  failed: 'bg-destructive/10 text-destructive',
}

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/account/inloggen?redirect=/account')
  }

  if ((user as any).role !== 'klant') {
    redirect('/admin')
  }

  const { docs: registrations } = await payload.find({
    collection: 'inschrijvingen',
    where: { account: { equals: user.id } },
    sort: '-createdAt',
    depth: 1,
    limit: 100,
  })

  const registrationIds = registrations.map((r) => r.id)

  const { docs: deelnemers } =
    registrationIds.length > 0
      ? await payload.find({
          collection: 'deelnemers',
          where: { registration: { in: registrationIds } },
          depth: 2,
          limit: 500,
        })
      : { docs: [] as any[] }

  const deelnemersByRegistration = new Map<string, any[]>()
  for (const d of deelnemers as any[]) {
    const regId = String(typeof d.registration === 'object' ? d.registration.id : d.registration)
    const list = deelnemersByRegistration.get(regId) || []
    list.push(d)
    deelnemersByRegistration.set(regId, list)
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mijn account</h1>
          <p className="mt-1 text-muted-foreground">Welkom, {(user as any).name || user.email}.</p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-12 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-foreground">Mijn inschrijvingen</h2>

        {registrations.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Je hebt nog geen inschrijvingen op dit account.
          </p>
        )}

        {(registrations as any[]).map((registration) => {
          const edition = registration.edition
          const participants = deelnemersByRegistration.get(String(registration.id)) || []

          return (
            <Card key={registration.id} className="border-none shadow-md">
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-card-foreground">
                      {typeof edition === 'object' ? edition.title : 'Editie'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Ingeschreven op{' '}
                      {new Date(registration.createdAt).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      STATUS_STYLES[registration.status] || 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {STATUS_LABELS[registration.status] || registration.status}
                  </span>
                </div>

                {registration.personalDataRemoved ? (
                  <p className="text-sm text-muted-foreground">
                    De deelnemersgegevens van deze inschrijving zijn verwijderd wegens onze
                    bewaartermijn.
                  </p>
                ) : (
                  <>
                    {participants.length > 0 && (
                      <ul className="flex flex-col gap-2 border-t border-dashed border-border pt-3">
                        {participants.map((p) => (
                          <li key={p.id} className="text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium text-foreground">{p.name}</span>
                              <span className="text-muted-foreground">
                                {typeof p.route === 'object'
                                  ? `${String(p.route.distance).replace('.', ',')} km — ${p.route.title}`
                                  : ''}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}

                <div className="flex justify-between border-t border-dashed border-border pt-3 text-sm font-bold text-foreground">
                  <span>Totaal</span>
                  <span>€{Number(registration.totalAmount).toFixed(2)}</span>
                </div>
                {registration.status === 'paid' && !registration.personalDataRemoved && (
                  <div className="flex flex-wrap gap-2 border-t border-dashed border-border pt-3">
                    <a
                      href={`/api/account/tickets/${registration.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                    >
                      Alle tickets (PDF)
                    </a>
                    {participants.map((p: any) => (
                      <a
                        key={p.id}
                        href={`/api/account/tickets/${registration.id}/${p.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground"
                      >
                        Ticket {p.name}
                      </a>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-12 border-t border-dashed border-border pt-6">
        <DeleteAccountButton />
      </div>
    </main>
  )
}
