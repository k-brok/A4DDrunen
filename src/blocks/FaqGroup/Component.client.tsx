'use client'

import { Plus } from 'lucide-react'
import React, { useState } from 'react'

type FaqItem = {
  id: string
  question: string
  answer: string
}

type Props = {
  faqs: FaqItem[]
}

const cornerClasses = ['rounded-2xl rounded-br-none', 'rounded-2xl rounded-bl-none']
const rotationClasses = ['-rotate-1', 'rotate-0', 'rotate-1']

export function FaqGroupClient({ faqs }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      {faqs.map((faq, index) => {
        const isOpen = openId === faq.id
        const cornerClass = cornerClasses[index % cornerClasses.length]
        const rotationClass = rotationClasses[index % rotationClasses.length]

        return (
          <div
            key={faq.id}
            className={['overflow-hidden bg-card shadow-sm', cornerClass, rotationClass].join(' ')}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
            >
              <span className="font-semibold text-card-foreground">{faq.question}</span>
              <Plus
                className={[
                  'h-5 w-5 shrink-0 text-primary transition-transform duration-200',
                  isOpen ? 'rotate-45' : 'rotate-0',
                ].join(' ')}
              />
            </button>

            {isOpen && <div className="px-6 pb-4 text-sm text-muted-foreground">{faq.answer}</div>}
          </div>
        )
      })}
    </div>
  )
}
