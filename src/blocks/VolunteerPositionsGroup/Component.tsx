import React from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'

import { IconCard } from '@/components/IconCard'

export async function VolunteerPositionsGroupBlock() {
  const payload = await getPayload({ config })

  const { docs: positions } = await payload.find({
    collection: 'vrijwilliger-posities',
    sort: 'order',
    limit: 50,
  })

  if (!positions.length) return null

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {(positions as any[]).map((position, index) => (
        <IconCard
          key={position.id}
          title={position.title}
          description={position.description}
          iconType={position.iconType}
          emoji={position.emoji}
          icon={position.icon}
          index={index}
          variant="badge"
        />
      ))}
    </div>
  )
}
