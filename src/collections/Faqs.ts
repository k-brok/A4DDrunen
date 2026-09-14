import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: {
    singular: 'Veelgestelde vraag',
    plural: 'Veelgestelde vragen',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order'],
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      admin: {
        description: 'Bijvoorbeeld: "Vanaf wanneer kan ik me inschrijven?"',
      },
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Bepaalt de volgorde (laag = bovenaan)',
      },
    },
  ],
}
