import type { Block } from 'payload'

import { CardColumns } from '@/blocks/CardColumns/config'
import { IntroHeading } from '@/blocks/IntroHeading/config'
import { ButtonGroup } from '@/blocks/ButtonGroup/config'
import { FaqGroup } from '@/blocks/FaqGroup/config'
import { FlagDivider } from '@/blocks/FlagDivider/config'
import { RouteDetailGroup } from '@/blocks/RouteDetailGroup/config'

export const WaveSection: Block = {
  slug: 'waveSection',
  interfaceName: 'WaveSectionBlock',
  labels: {
    singular: 'Golf-sectie',
    plural: 'Golf-secties',
  },
  imageURL: '/wave-section-thumbnail.svg',
  fields: [
    {
      name: 'color',
      type: 'select',
      defaultValue: 'success',
      required: true,
      options: [
        { label: 'Groen', value: 'success' },
        { label: 'Roze', value: 'primary' },
        { label: 'Licht Roze', value: 'primarylight' },
        { label: 'Bordeaux', value: 'secondary' },
        { label: 'Blauw', value: 'accent' },
      ],
    },
    {
      name: 'edge',
      type: 'select',
      defaultValue: 'wave',
      required: true,
      options: [
        { label: 'Golvend', value: 'wave' },
        { label: 'Recht', value: 'straight' },
      ],
    },
    {
      name: 'content',
      type: 'blocks',
      minRows: 1,
      blocks: [CardColumns, IntroHeading, ButtonGroup, FaqGroup, FlagDivider, RouteDetailGroup],
      admin: {
        initCollapsed: true,
      },
    },
  ],
}
