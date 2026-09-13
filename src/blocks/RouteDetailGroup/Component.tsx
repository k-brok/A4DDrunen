import React from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'

import { RouteCardExpanded } from '@/components/RouteCardExpanded'
import { formatDateRangeNL } from '@/utilities/formatDateRangeNL'

export async function RouteDetailGroupBlock() {
  const payload = await getPayload({ config })

  const { docs: activeEditions } = await payload.find({
    collection: 'edities',
    where: { active: { equals: true } },
    limit: 1,
  })

  const activeEdition = activeEditions[0] as
    { id: string | number; title: string; startDate: string; endDate: string } | undefined

  if (!activeEdition) return null

  const [{ docs: routes }, { docs: dagen }] = await Promise.all([
    payload.find({
      collection: 'routes',
      where: { edition: { equals: activeEdition.id } },
      sort: 'distance',
      depth: 1,
    }),
    payload.find({
      collection: 'dagen',
      where: { edition: { equals: activeEdition.id } },
      sort: 'date',
      limit: 20,
      depth: 1, // nodig zodat routeOverrides.route gepopuleerd wordt
    }),
  ])

  if (!routes.length) return null

  const editionDateRange = formatDateRangeNL(activeEdition.startDate, activeEdition.endDate)

  return (
    <div className="container flex flex-col gap-8">
      {(routes as any[]).map((route, index) => (
        <RouteCardExpanded
          key={route.id}
          route={route}
          days={dagen as any[]}
          editionTitle={activeEdition.title}
          editionDateRange={editionDateRange}
          index={index}
        />
      ))}
    </div>
  )
}
