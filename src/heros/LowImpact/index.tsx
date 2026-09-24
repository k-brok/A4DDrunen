import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
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
      <div className="container mt-16">
        <div className="max-w-[48rem]">
          {children || (richText && <RichText data={richText} enableGutter={false} />)}
        </div>
      </div>
    </div>
  )
}
