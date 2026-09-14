import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { getAdminEditionId } from '@/utilities/getAdminEditionId'

export const PrijsOpties: CollectionConfig = {
  slug: 'prijs-opties',
  labels: {
    singular: 'Prijsoptie',
    plural: 'Prijsopties',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'price', 'edition'],
    baseListFilter: async ({ req }) => {
      const editionId = await getAdminEditionId(req)
      if (!editionId) return null
      return { edition: { equals: editionId } }
    },
  },
  fields: [
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
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Bijvoorbeeld: "T-shirt"',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'requiresInput',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Vraag bij deze optie om een extra invoerveld (bv. medaillenummer)',
      },
    },
    {
      name: 'inputLabel',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.requiresInput,
        description: 'Label van het invoerveld, bijvoorbeeld "Medaillenummer"',
      },
    },
  ],
}
