import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Incheckmomenten: CollectionConfig = {
  slug: 'incheckmomenten',
  labels: {
    singular: 'Incheckmoment',
    plural: 'Incheckmomenten',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    update: authenticated,
    read: ({ req }) => {
      if (!req.user) return false
      if ((req.user as any).role !== 'klant') return true
      // Een klant mag alleen incheckmomenten zien van deelnemers die aan
      // zijn/haar eigen account gekoppeld zijn.
      return {
        'deelnemer.registration.account': { equals: req.user.id },
      }
    },
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['deelnemer', 'dag', 'type', 'createdAt'],
  },
  fields: [
    {
      name: 'deelnemer',
      type: 'relationship',
      relationTo: 'deelnemers',
      required: true,
    },
    {
      name: 'dag',
      type: 'relationship',
      relationTo: 'dagen',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Incheck', value: 'in' },
        { label: 'Uitcheck', value: 'uit' },
      ],
    },
    {
      name: 'scannedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
