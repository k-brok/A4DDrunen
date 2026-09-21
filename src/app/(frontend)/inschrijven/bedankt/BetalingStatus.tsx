'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type ParticipantSummary = {
  name: string
  routeTitle: string
  distance: number
  options: { label: string; price: number }[]
}

type StatusResponse = {
  status: string
  contactName?: string
  contactEmail?: string
  totalAmount?: string | number
  participants?: ParticipantSummary[]
}

const PENDING_STATUSES = ['pending', 'open', 'authorized']
const FAILED_MESSAGES: Record<string, string> = {
  canceled: 'Je hebt de betaling geannuleerd.',
  expired: 'De betaling is verlopen. Probeer het opnieuw.',
  failed: 'De betaling is niet gelukt. Probeer het opnieuw of kies een andere betaalmethode.',
}

export function BetalingStatus({
  token,
  initialStatus,
}: {
  token: string
  initialStatus: StatusResponse
}) {
  const [data, setData] = useState<StatusResponse>(initialStatus)

  useEffect(() => {
    if (!PENDING_STATUSES.includes(data.status)) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/inschrijven/${encodeURIComponent(token)}`, {
          cache: 'no-store',
        })
        if (!res.ok) return
        const json: StatusResponse = await res.json()
        setData(json)
      } catch {
        // netwerkfoutje, volgende tick probeert opnieuw
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [data.status, token])

  if (PENDING_STATUSES.includes(data.status)) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-bold">Je betaling wordt verwerkt</h1>
        <p className="mt-4">
          We hebben je inschrijving ontvangen. Je betaling wordt nog gecontroleerd. Deze pagina
          werkt zichzelf automatisch bij.
        </p>

        <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 animate-[loadingbar_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>

        <style>{`
          @keyframes loadingbar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </main>
    )
  }

  if (data.status === 'paid') {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-bold">Bedankt voor je inschrijving!</h1>
        <p className="mt-4">{data.contactName}, je betaling is ontvangen.</p>
        <p className="mt-2">We hebben een bevestiging gestuurd naar {data.contactEmail}.</p>

        <div className="mt-8 rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Overzicht van je inschrijving</h2>

          <ul className="mt-4 flex flex-col gap-4">
            {data.participants?.map((p, i) => (
              <li key={i} className="border-b border-dashed pb-3 last:border-none">
                <div className="flex justify-between text-sm font-medium">
                  <span>{p.name}</span>
                  <span>
                    {String(p.distance).replace('.', ',')} km — {p.routeTitle}
                  </span>
                </div>
                {p.options.length > 0 && (
                  <ul className="mt-1 flex flex-col gap-0.5 pl-4 text-xs text-muted-foreground">
                    {p.options.map((o, j) => (
                      <li key={j} className="flex justify-between">
                        <span>{o.label}</span>
                        <span>+€{Number(o.price).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between border-t pt-3 text-base font-bold">
            <span>Totaal betaald</span>
            <span>€{Number(data.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-primary px-5 py-3 text-primary-foreground"
        >
          Terug naar de website
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">Betaling is niet gelukt</h1>
      <p className="mt-4">
        {FAILED_MESSAGES[data.status] ?? 'Er is iets misgegaan met je betaling.'}
      </p>

      <Link
        href="/inschrijven"
        className="mt-8 inline-block rounded-lg bg-primary px-5 py-3 text-primary-foreground"
      >
        Opnieuw inschrijven
      </Link>
    </main>
  )
}
