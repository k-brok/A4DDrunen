import React from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'

import { RouteCard } from '@/components/RouteCard'

export async function RouteGroupBlock() {
  const payload = await getPayload({ config })

  const { docs: activeEditions } = await payload.find({
    collection: 'edities',
    where: { active: { equals: true } },
    limit: 1,
  })

  const activeEdition = activeEditions[0]

  if (!activeEdition) {
    return null
  }

  const { docs: routes } = await payload.find({
    collection: 'routes',
    where: { edition: { equals: activeEdition.id } },
    sort: 'distance',
    depth: 2,
  })

  if (!routes.length) {
    return null
  }

  return (
    <div className="container">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {routes.map((route, index) => (
          <RouteCard key={route.id} route={route} index={index} />
        ))}
      </div>
    </div>
  )
}
