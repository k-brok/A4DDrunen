import React from 'react'

import type { WaveSectionBlock as WaveSectionBlockProps } from '@/payload-types'

import { CardColumnsBlock } from '@/blocks/CardColumns/Component'
import { IntroHeadingBlock } from '@/blocks/IntroHeading/Component'
import { ButtonGroupBlock } from '@/blocks/ButtonGroup/Component'
import { FaqGroupBlock } from '@/blocks/FaqGroup/Component'
import { RouteGroupBlock } from '@/blocks/RouteGroup/Component'
import { FlagDividerBlock } from '@/blocks/FlagDivider/Component'
import { RouteDetailGroupBlock } from '@/blocks/RouteDetailGroup/Component'
import { VolunteerPositionsGroupBlock } from '@/blocks/VolunteerPositionsGroup/Component'
import { InfoCardBlock } from '@/blocks/InfoCard/Component'

type WaveColor = 'success' | 'primary' | 'secondary' | 'accent' | 'primarylight'
type EdgeType = 'wave' | 'straight'

const colorVar: Record<WaveColor, string> = {
  success: 'var(--success)',
  primary: 'var(--primary)',
  primarylight: 'var(--primary-light)',
  secondary: 'var(--secondary)',
  accent: 'var(--accent)',
}

const nestedBlockComponents: Record<string, React.FC<any>> = {
  cardColumns: CardColumnsBlock,
  introHeading: IntroHeadingBlock,
  buttonGroup: ButtonGroupBlock,
  faqGroup: FaqGroupBlock,
  routeGroup: RouteGroupBlock,
  flagDivider: FlagDividerBlock,
  routeDetailGroup: RouteDetailGroupBlock,
  volunteerPositionsGroup: VolunteerPositionsGroupBlock,
  infoCard: InfoCardBlock,
}

// Blocktypes die hier opgesomd staan, krijgen GEEN .container om zich heen (bv. full-bleed decoratie).
const fullWidthBlockTypes = new Set(['flagDivider'])

const TopWave: React.FC<{ fill: string }> = ({ fill }) => (
  <svg
    viewBox="0 0 1200 60"
    preserveAspectRatio="none"
    className="block h-[40px] w-full md:h-[60px]"
    aria-hidden="true"
  >
    <path
      d="M0,20 C100,0 200,40 300,20 C400,0 500,40 600,20 C700,0 800,40 900,20 C1000,0 1100,40 1200,20 L1200,60 L0,60 Z"
      fill={fill}
    />
  </svg>
)

const BottomWave: React.FC<{ fill: string }> = ({ fill }) => (
  <svg
    viewBox="0 0 1200 60"
    preserveAspectRatio="none"
    className="block h-[40px] w-full md:h-[60px]"
    aria-hidden="true"
  >
    <path
      d="M0,40 C100,60 200,20 300,40 C400,60 500,20 600,40 C700,60 800,20 900,40 C1000,60 1100,20 1200,40 L1200,0 L0,0 Z"
      fill={fill}
    />
  </svg>
)

export const WaveSectionBlock: React.FC<WaveSectionBlockProps> = ({ color, content, edge }) => {
  const fill = colorVar[(color as WaveColor) ?? 'success'] ?? colorVar.success

  return (
    <div className="relative w-full">
      {edge === 'wave' && <TopWave fill={fill} />}

      <div className="py-12" style={{ backgroundColor: fill }}>
        <div className="flex flex-col gap-8">
          {Array.isArray(content) &&
            content.map((block, index) => {
              const NestedBlock = nestedBlockComponents[block.blockType]
              if (!NestedBlock) return null

              const isFullWidth = fullWidthBlockTypes.has(block.blockType)

              return (
                <div key={block.id ?? index} className={isFullWidth ? '' : 'container'}>
                  <NestedBlock {...block} />
                </div>
              )
            })}
        </div>
      </div>

      {edge === 'wave' && <BottomWave fill={fill} />}
    </div>
  )
}
