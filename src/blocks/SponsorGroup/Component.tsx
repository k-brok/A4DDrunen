import React from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'

import { Sponsor } from '../../components/Sponsor'

type SponsorSize = 'small' | 'medium' | 'large'

type SponsorGroupBlockProps = {
  max?: string | number | 'all'
  size?: SponsorSize
}

const rotationClasses = ['-rotate-2', 'rotate-0', 'rotate-2']

const borderColorClasses = ['border-primary', 'border-secondary', 'border-accent', 'border-success']

function pickRandom<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)]
}

export async function SponsorGroupBlock({ max = 'all', size = 'medium' }: SponsorGroupBlockProps) {
  const payload = await getPayload({
    config,
  })

  const limit = max === 'all' ? 100 : Number(max)

  const { docs: sponsors } = await payload.find({
    collection: 'sponsors',
    sort: 'displayCount',
    limit,
    depth: 1,
  })

  if (!sponsors.length) {
    return null
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap justify-center gap-4">
        {sponsors.map((sponsor) => {
          if (typeof sponsor.logo === 'number') {
            return null
          }

          return (
            <Sponsor
              key={sponsor.id}
              id={String(sponsor.id)}
              name={sponsor.name}
              url={sponsor.url}
              logo={sponsor.logo}
              size={size}
              rotationClass={pickRandom(rotationClasses)}
              borderColorClass={pickRandom(borderColorClasses)}
              cardBackground={sponsor.cardBackground || 'light'}
            />
          )
        })}
      </div>
    </div>
  )
}
