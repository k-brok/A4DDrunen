'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

export const RowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()

  const label = data?.title
    ? `Kaart ${rowNumber !== undefined ? rowNumber + 1 : ''}: ${data.title}`
    : `Kaart ${rowNumber !== undefined ? rowNumber + 1 : ''}`

  return <div>{label}</div>
}
