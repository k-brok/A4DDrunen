import React from 'react'
import { getPayload } from 'payload'

import config from '@payload-config'

import { FaqGroupClient } from './Component.client'

type FaqGroupBlockProps = {
  max?: string | number | 'all'
}

export async function FaqGroupBlock({ max = 'all' }: FaqGroupBlockProps) {
  const payload = await getPayload({ config })

  const limit = max === 'all' ? 100 : Number(max)

  const { docs } = await payload.find({
    collection: 'faqs',
    sort: 'order',
    limit,
  })

  if (!docs.length) return null

  const faqs = docs.map((doc) => ({
    id: String(doc.id),
    question: doc.question,
    answer: doc.answer,
  }))

  return (
    <div className="container">
      <FaqGroupClient faqs={faqs} />
    </div>
  )
}
