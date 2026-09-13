'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

export const RowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<{ link?: { label?: string } }>()

  const label = data?.link?.label
    ? `Knop ${rowNumber !== undefined ? rowNumber + 1 : ''}: ${data.link.label}`
    : `Knop ${rowNumber !== undefined ? rowNumber + 1 : ''}`

  return <div>{label}</div>
}
