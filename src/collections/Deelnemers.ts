import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Deelnemers: CollectionConfig = {
  slug: 'deelnemers',
  labels: {
    singular: 'Deelnemer',
    plural: 'Deelnemers',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'birthDate', 'route', 'registration'],
  },
  fields: [
    {
      name: 'registration',
      type: 'relationship',
      relationTo: 'inschrijvingen',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'birthDate',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'route',
      type: 'relationship',
      relationTo: 'routes',
      required: true,
    },
    {
      name: 'selectedOptions',
      type: 'array',
      fields: [
        {
          name: 'option',
          type: 'relationship',
          relationTo: 'prijs-opties',
          required: true,
        },
        {
          name: 'priceAtRegistration',
          type: 'number',
          required: true,
          admin: {
            step: 0.01,
            description: 'Bevroren prijs op moment van inschrijving',
            readOnly: true,
          },
        },
        {
          name: 'inputValue',
          type: 'text',
          admin: {
            description: 'Extra ingevoerde waarde, bijvoorbeeld medaillenummer',
          },
        },
      ],
    },
    {
      name: 'sponsor',
      type: 'relationship',
      relationTo: 'sponsors',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Automatisch eerlijk toegewezen bij het aanmaken van het ticket.',
      },
    },
    {
      name: 'participantNumber',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Automatisch oplopend nummer binnen de editie.',
      },
    },
    {
      name: 'checkInToken',
      type: 'text',
      unique: true,
      admin: { hidden: true },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.checkInToken) {
          data.checkInToken = require('crypto').randomBytes(16).toString('hex')
        }
        return data
      },
    ],
  },
  timestamps: true,
}
