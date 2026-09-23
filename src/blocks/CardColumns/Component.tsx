import React from 'react'

import type { CardColumnsBlock as CardColumnsBlockProps } from '@/payload-types'

import { ItemCard } from '@/components/ItemCard'

export const CardColumnsBlock: React.FC<CardColumnsBlockProps> = ({ cards }) => {
  if (!Array.isArray(cards) || cards.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {cards.map((card, index) => (
        <ItemCard key={card.id ?? index} {...card} index={index} />
      ))}
    </div>
  )
}
