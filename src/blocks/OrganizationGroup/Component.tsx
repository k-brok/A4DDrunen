import React from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'

import { OrganizationCard } from '@/components/OrganizationCard'

export async function OrganizationGroupBlock() {
  const payload = await getPayload({ config })

  const { docs: activeEditions } = await payload.find({
    collection: 'edities',
    where: { active: { equals: true } },
    limit: 1,
  })

  const activeEdition = activeEditions[0] as any

  const { docs: personen } = await payload.find({
    collection: 'personen',
    where: { listVisability: { equals: true } },
    sort: 'volgorde',
    depth: 1,
    limit: 100,
  })

  if (!personen.length) return null

  // Rollen per persoon ophalen uit de actieve editie, in één query i.p.v. per persoon.
  let rolesByPersonId = new Map<string, string[]>()

  if (activeEdition) {
    const { docs: toewijzingen } = await payload.find({
      collection: 'vrijwilliger-toewijzingen',
      where: {
        and: [
          { edition: { equals: activeEdition.id } },
          { persoon: { in: personen.map((p: any) => p.id) } },
        ],
      },
      depth: 1,
      limit: 200,
    })

    rolesByPersonId = (toewijzingen as any[]).reduce((map, t) => {
      const personId = typeof t.persoon === 'object' ? t.persoon.id : t.persoon
      const roleTitle = typeof t.positie === 'object' ? t.positie.title : undefined
      if (!roleTitle) return map

      const key = String(personId)
      const existing = map.get(key) || []
      map.set(key, [...existing, roleTitle])
      return map
    }, new Map<string, string[]>())
  }

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {(personen as any[]).map((persoon, index) => (
        <OrganizationCard
          key={persoon.id}
          name={persoon.name}
          rol={rolesByPersonId.get(String(persoon.id))?.join(', ')}
          foto={persoon.foto}
          fotoToestemming={persoon.fotoToestemming}
          index={index}
        />
      ))}
    </div>
  )
}
