import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

import { getAdminEditionId } from '@/utilities/getAdminEditionId'

export const Routes: CollectionConfig = {
  slug: 'routes',
  labels: {
    singular: 'Route',
    plural: 'Routes',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'displayLabel',
    defaultColumns: ['displayLabel', 'edition', 'distance'],
    baseListFilter: async ({ req }) => {
      const editionId = await getAdminEditionId(req)
      if (!editionId) return null

      return {
        edition: { equals: editionId },
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Bijvoorbeeld: "Ontdek-route"',
      },
    },
    {
      name: 'displayLabel',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ data, siblingData }) => {
            const distance = siblingData?.distance ?? data?.distance
            const title = siblingData?.title ?? data?.title
            if (distance == null || !title) return undefined

            const distanceLabel = String(distance).replace('.', ',')
            return `${distanceLabel} km (${title})`
          },
        ],
      },
    },
    {
      name: 'edition',
      type: 'relationship',
      relationTo: 'edities',
      required: true,
      defaultValue: async ({ req }) => getAdminEditionId(req),
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'distance',
      type: 'number',
      required: true,
      admin: {
        description: 'Afstand in kilometers, bijvoorbeeld 7.5',
        step: 0.1,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
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
        layout: 'horizontal',
      },
    },
    {
      name: 'emoji',
      type: 'text',
      admin: {
        condition: (_, sibling) => sibling?.iconType === 'emoji',
        description: 'Bijvoorbeeld: 🦆',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, sibling) => sibling?.iconType === 'media',
      },
    },
    {
      name: 'highlights',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
      admin: {
        description: 'Korte pluspunten, bijvoorbeeld "Geschikt voor buggy\'s en rolstoelen"',
      },
    },
    slugField({
      position: undefined,
    }),
  ],
}
