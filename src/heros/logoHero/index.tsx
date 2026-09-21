'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme(null)
  }, [setHeaderTheme])

  return (
    <div className="relative flex min-h-[30vh] items-center justify-center pt-16">
      <div
        className="pointer-events-none absolute top-0 left-1/2 z-10 h-[80px] w-screen -translate-x-1/2 bg-repeat-x"
        style={{
          backgroundImage: 'url("/img/Vlaggetjes.svg")',
          backgroundPosition: 'bottom center',
          backgroundSize: '1200px 80px',
        }}
      />

      <div className="container z-10 relative flex items-center justify-center">
        <div className="flex max-w-[36.5rem] flex-col items-center gap-1 text-center">
          <Logo className="!w-[280px] md:!w-[360px]" loading="eager" priority="high" />
        </div>
      </div>
    </div>
  )
}
