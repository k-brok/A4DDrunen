import React from 'react'

import type { Route } from '@/payload-types'

const colorClasses = [
  { border: 'border-accent', bg: 'bg-accent', text: 'text-accent' },
  { border: 'border-primary', bg: 'bg-primary', text: 'text-primary' },
  { border: 'border-success', bg: 'bg-success', text: 'text-success' },
]

const rotationClasses = ['-rotate-2', 'rotate-0', 'rotate-2']

type Props = {
  route: Route
  index?: number
}

export const RouteCard: React.FC<Props> = ({ route, index = 0 }) => {
  const { title, description, distance, emoji, iconType, icon, edition } = route
  const color = colorClasses[index % colorClasses.length]
  const rotationClass = rotationClasses[index % rotationClasses.length]

  const editionTitle = typeof edition === 'object' && edition !== null ? edition.title : undefined

  const distanceLabel = String(distance).replace('.', ',')

  return (
    <div
      className={[
        'mx-auto w-full max-w-[17rem] overflow-hidden rounded-xl border-2 border-dashed bg-card',
        color.border,
        rotationClass,
      ].join(' ')}
    >
      <div className={['flex items-center gap-2 px-4 py-3', color.bg].join(' ')}>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-base">
          {iconType === 'media' && icon && typeof icon === 'object' && icon.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={icon.url} alt={icon.alt || title} className="h-4 w-4 object-contain" />
          ) : (
            emoji
          )}
        </span>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>

      <div className="flex flex-col items-center gap-1 px-6 pt-8 pb-6 text-center">
        <span className={['text-5xl font-bold', color.text].join(' ')}>{distanceLabel}</span>
        <span className={['text-sm font-semibold', color.text].join(' ')}>kilometer</span>

        {description && <p className="mt-4 text-sm text-muted-foreground">{description}</p>}

        {editionTitle && (
          <>
            <div className={['my-4 h-px w-full border-t border-dashed', color.border].join(' ')} />
            <span className={['text-xs font-bold tracking-wide uppercase', color.text].join(' ')}>
              {editionTitle}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
