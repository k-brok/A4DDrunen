import React from 'react'

import type { ButtonGroupBlock as ButtonGroupBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'

const buttonStyles = [
  {
    appearance: 'default' as const,
    className:
      'rounded-2xl rounded-br-none border-2 border-transparent bg-primary text-primary-foreground hover:bg-primary-hover',
  },
  {
    appearance: 'outline' as const,
    className:
      'rounded-2xl rounded-bl-none border-2 border-success bg-transparent text-success hover:bg-success/10',
  },
  {
    appearance: 'default' as const,
    className:
      'rounded-2xl rounded-br-none border-2 border-transparent bg-accent text-accent-foreground hover:bg-accent-hover',
  },
]

export const ButtonGroupBlock: React.FC<ButtonGroupBlockProps> = ({ buttons }) => {
  if (!Array.isArray(buttons) || buttons.length === 0) return null

  return (
    <div className="container flex flex-wrap justify-center gap-4">
      {buttons.map(({ link, size }, i) => {
        const style = buttonStyles[i % buttonStyles.length]

        return (
          <CMSLink
            key={i}
            {...link}
            appearance={style.appearance}
            className={style.className}
            size={size || 'default'}
          />
        )
      })}
    </div>
  )
}
