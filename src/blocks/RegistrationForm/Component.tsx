import React from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'

import { InschrijfForm } from './InschrijfForm'

export async function RegistrationFormBlock() {
  const payload = await getPayload({ config })

  const { docs: editions } = await payload.find({
    collection: 'edities',
    where: { active: { equals: true } },
    limit: 1,
  })

  const edition = editions[0] as any

  if (!edition) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">
          Er is op dit moment geen actieve editie om je voor in te schrijven.
        </p>
      </div>
    )
  }

  const [{ docs: routes }, { docs: options }] = await Promise.all([
    payload.find({
      collection: 'routes',
      where: { edition: { equals: edition.id } },
      sort: 'distance',
      limit: 20,
    }),
    payload.find({
      collection: 'prijs-opties',
      where: { edition: { equals: edition.id } },
      limit: 20,
    }),
  ])

  return (
    <div className="container flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-bold text-foreground">Inschrijven — {edition.title}</h2>
        <p className="text-muted-foreground">
          €{Number(edition.pricePerParticipant).toFixed(2)} per deelnemer
        </p>
      </div>

      <InschrijfForm
        routes={(routes as any[]).map((r) => ({
          id: String(r.id),
          title: r.title,
          distance: r.distance,
        }))}
        options={(options as any[]).map((o) => ({
          id: String(o.id),
          label: o.label,
          price: o.price,
          requiresInput: o.requiresInput,
          inputLabel: o.inputLabel,
        }))}
        pricePerParticipant={Number(edition.pricePerParticipant)}
      />
    </div>
  )
}
