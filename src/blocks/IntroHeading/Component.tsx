import React from 'react'

import type { IntroHeadingBlock as IntroHeadingBlockProps } from '@/payload-types'

export const IntroHeadingBlock: React.FC<IntroHeadingBlockProps> = ({
  heading,
  accentLine,
  intro,
}) => {
  return (
    <div className="container flex flex-col items-center gap-4 text-center">
      {heading && <h2 className="text-4xl font-bold text-foreground md:text-5xl">{heading}</h2>}

      {accentLine && <p className="text-4xl font-bold text-primary md:text-5xl">{accentLine}</p>}

      {intro && <p className="max-w-2xl text-muted-foreground">{intro}</p>}
    </div>
  )
}
