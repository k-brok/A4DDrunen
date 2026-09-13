import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { personalFields } from './fields/Personal'
import { contactFields } from './fields/Contact'
import { addressFields } from './fields/Address'

export const Contactgegevens: CollectionConfig = {
  slug: 'contactgegevens',

  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },

  admin: {
    defaultColumns: ['displayName', 'email', 'telefoon', 'user'],
    useAsTitle: 'displayName',
  },

  fields: [
    {
      name: 'displayName',
      type: 'text',
      admin: {
        hidden: true,
      },
    },

    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: {
        description: 'Optioneel: koppel dit contact aan een gebruiker.',
      },
    },

    ...personalFields,
    ...contactFields,
    ...addressFields,
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        data.displayName = [data.voornaam, data.achternaam].filter(Boolean).join(' ')

        return data
      },
    ],
  },

  timestamps: true,
}
