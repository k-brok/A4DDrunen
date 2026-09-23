import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const VrijwilligerPosities: CollectionConfig = {
  slug: 'vrijwilliger-posities',
  labels: {
    singular: 'Vrijwilligerspositie',
    plural: 'Vrijwilligersposities',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Bijvoorbeeld: "Verkeersregelaars"',
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
        description: 'Bijvoorbeeld: 🚦',
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
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Bepaalt de volgorde (laag = eerst)',
      },
    },
  ],
}
