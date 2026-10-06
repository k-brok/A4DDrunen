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
    {
      name: 'listVisability',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Bepaalt of deze persoon zichtbaar is in de lijst van organisatoren',
      },
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optioneel. Wordt alleen getoond als "Toestemming foto" is aangevinkt.',
      },
    },
    {
      name: 'fotoToestemming',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'AVG: alleen aanvinken als deze persoon expliciet toestemming heeft gegeven om zijn/haar foto op de website te tonen.',
      },
    },
    {
      name: 'volgorde',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Bepaalt de volgorde op de organisatiepagina (laag = eerst)',
      },
    },
  ],
  timestamps: true,
}
