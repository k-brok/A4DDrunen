import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const InfoCard: Block = {
  slug: 'infoCard',
  interfaceName: 'InfoCardBlock',
  labels: {
    singular: 'Infokaart',
    plural: 'Infokaarten',
  },
  imageURL: '/img/blocks/info-card-thumbnail.svg',
  fields: [
    {
      name: 'background',
      type: 'select',
      defaultValue: 'card',
      required: true,
      options: [
        { label: 'Standaard (crème kaart)', value: 'card' },
        { label: 'Roze', value: 'primary' },
        { label: 'Bordeaux', value: 'secondary' },
        { label: 'Blauw', value: 'accent' },
        { label: 'Groen', value: 'success' },
      ],
      admin: {
        description: 'Bij een kleur wordt de tekst automatisch wit.',
      },
    },
    {
      name: 'showHeader',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Toon een icoon en titel bovenaan de kaart',
      },
    },
    {
      name: 'iconType',
      type: 'radio',
      defaultValue: 'emoji',
      options: [
        { label: 'Emoji', value: 'emoji' },
        { label: 'Icoon (upload)', value: 'media' },
      ],
      admin: {
        condition: (_, sibling) => sibling?.showHeader,
        layout: 'horizontal',
      },
    },
    {
      name: 'emoji',
      type: 'text',
      admin: {
        condition: (_, sibling) => sibling?.showHeader && sibling?.iconType === 'emoji',
        description: 'Bijvoorbeeld: ℹ️',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, sibling) => sibling?.showHeader && sibling?.iconType === 'media',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        condition: (_, sibling) => sibling?.showHeader,
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      admin: {
        description: 'Ondersteunt vet en opsommingen',
      },
    },
    {
      name: 'highlightText',
      type: 'textarea',
      admin: {
        description:
          'Optioneel: een uitgelichte, vetgedrukte regel onderaan (vaste stijl, geen vrije kleurkeuze)',
      },
    },
    {
      name: 'showButton',
      type: 'checkbox',
      defaultValue: false,
    },
    link({
      appearances: false,
      overrides: {
        admin: {
          condition: (_, sibling) => sibling?.showButton,
        },
      },
    }),
  ],
}
