'use client'

import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

type OverrideRow = {
  route?: { title?: string } | string | number
}

export const RouteOverrideRowLabel: React.FC = () => {
  const { data, rowNumber } = useRowLabel<OverrideRow>()

  const routeTitle = typeof data?.route === 'object' ? data?.route?.title : undefined

  const label = routeTitle
    ? `Uitzondering: ${routeTitle}`
    : `Uitzondering ${rowNumber !== undefined ? rowNumber + 1 : ''}`

  return <div>{label}</div>
}
