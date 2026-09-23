import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { BadgeStampBlock } from '@/blocks/BadgeStamp/Component'
import { IntroHeadingBlock } from '@/blocks/IntroHeading/Component'
import { ButtonGroupBlock } from '@/blocks/ButtonGroup/Component'
import { SponsorGroupBlock } from '@/blocks/SponsorGroup/Component'
import { CountdownBlock } from '@/blocks/Countdown/Component'
import { WaveSectionBlock } from '@/blocks/WaveSection/Component'
import { RouteGroupBlock } from '@/blocks/RouteGroup/Component'
import { FaqGroupBlock } from '@/blocks/FaqGroup/Component'
import { FlagDividerBlock } from '@/blocks/FlagDivider/Component'
import { RouteDetailGroupBlock } from '@/blocks/RouteDetailGroup/Component'
import { RegistrationFormBlock } from '@/blocks/RegistrationForm/Component'
import { VolunteerPositionsGroupBlock } from '@/blocks/VolunteerPositionsGroup/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  badgeStamp: BadgeStampBlock,
  introHeading: IntroHeadingBlock,
  buttonGroup: ButtonGroupBlock,
  sponsorGroup: SponsorGroupBlock,
  countdown: CountdownBlock,
  waveSection: WaveSectionBlock,
  routeGroup: RouteGroupBlock,
  faqGroup: FaqGroupBlock,
  flagDivider: FlagDividerBlock,
  routeDetailGroup: RouteDetailGroupBlock,
  registrationForm: RegistrationFormBlock,
  volunteerPositionsGroup: VolunteerPositionsGroupBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block
          const isLast = index === blocks.length - 1

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className={isLast ? 'mt-3' : 'my-3'} key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
