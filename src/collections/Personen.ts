import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Personen: CollectionConfig = {
  slug: 'personen',
  labels: {
    singular: 'Persoon',
    plural: 'Personen',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'account', 'contactgegevens'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Volledige naam, voor snelle weergave in lijsten en planning',
      },
    },
    {
      name: 'account',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        description: 'Optioneel: koppel aan een bestaand gebruikersaccount',
      },
    },
    {
      name: 'contactgegevens',
      type: 'relationship',
      relationTo: 'contactgegevens',
      admin: {
        position: 'sidebar',
        description: 'Optioneel: volledige adres- en contactgegevens',
      },
    },
  ],
  timestamps: true,
}
