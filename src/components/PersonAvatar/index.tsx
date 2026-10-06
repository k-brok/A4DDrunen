import Image from 'next/image'
import React from 'react'

import { paletteBgClasses, pickByIndex } from '@/utilities/cardStyles'

type Props = {
  name: string
  foto?: { url?: string | null; alt?: string | null } | number | null
  fotoToestemming?: boolean | null
  index?: number
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const PersonAvatar: React.FC<Props> = ({ name, foto, fotoToestemming, index = 0 }) => {
  const resolvedFoto =
    fotoToestemming && foto && typeof foto === 'object' && 'url' in foto && foto.url
      ? foto
      : undefined

  if (resolvedFoto) {
    return (
      <div className="h-20 w-20 overflow-hidden rounded-full">
        <Image
          src={resolvedFoto.url as string}
          alt={resolvedFoto.alt || name}
          width={80}
          height={80}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  const bgClass = pickByIndex(paletteBgClasses, index)

  return (
    <div
      className={[
        'flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold text-white',
        bgClass,
      ].join(' ')}
    >
      {getInitials(name)}
    </div>
  )
}
