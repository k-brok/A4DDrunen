import React from 'react'

import type { CountdownBlock as CountdownBlockProps } from '@/payload-types'

import { CountdownClient } from './Component.client'

export const CountdownBlock: React.FC<CountdownBlockProps> = ({ targetDate }) => {
  if (!targetDate) return null

  return (
    <div className="container flex justify-center">
      <CountdownClient targetDate={targetDate} />
    </div>
  )
}
