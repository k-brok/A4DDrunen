import React from 'react'

import type { BadgeStampBlock as BadgeStampBlockProps } from '@/payload-types'

export const BadgeStampBlock: React.FC<BadgeStampBlockProps> = ({ text }) => {
  return (
    <div className="container flex justify-center">
      <span className="-rotate-2 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm">
        {text}
      </span>
    </div>
  )
}
