import React from 'react'

import { PersonAvatar } from '@/components/PersonAvatar'
import { paletteBorderClasses, cardRotationClasses, pickByIndex } from '@/utilities/cardStyles'

type Props = {
  name: string
  rol?: string | null
  foto?: { url?: string | null; alt?: string | null } | number | null
  fotoToestemming?: boolean | null
  index?: number
}

export const OrganizationCard: React.FC<Props> = ({
  name,
  rol,
  foto,
  fotoToestemming,
  index = 0,
}) => {
  const borderClass = pickByIndex(paletteBorderClasses, index)
  const textClass = pickByIndex(
    ['text-primary', 'text-accent', 'text-success', 'text-secondary'],
    index,
  )
  const rotationClass = pickByIndex(cardRotationClasses, index)

  return (
    <div
      className={[
        'flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed bg-card p-6 text-center shadow-sm',
        borderClass,
        rotationClass,
      ].join(' ')}
    >
      <PersonAvatar name={name} foto={foto} fotoToestemming={fotoToestemming} index={index} />
      <span className="font-bold text-card-foreground">{name}</span>
      {rol && <span className={['text-sm font-semibold', textClass].join(' ')}>{rol}</span>}
    </div>
  )
}
