import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { getAdminEditionId } from '@/utilities/getAdminEditionId'

export const Inschrijvingen: CollectionConfig = {
  slug: 'inschrijvingen',
  labels: {
    singular: 'Inschrijving',
    plural: 'Inschrijvingen',
  },
  access: {
    // Aanmaken gebeurt via een eigen API-route (server-side, met de Local API),
    // niet rechtstreeks door bezoekers via de REST/GraphQL-API.
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'contactEmail',
    defaultColumns: ['contactEmail', 'contactName', 'status', 'totalAmount', 'createdAt'],
    baseListFilter: async ({ req }) => {
      const editionId = await getAdminEditionId(req)
      if (!editionId) return undefined
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
      name: 'account',
      type: 'relationship',
      relationTo: 'klanten',
      admin: {
        position: 'sidebar',
        description: 'Automatisch gekoppeld op basis van het e-mailadres',
      },
    },
    {
      name: 'contactName',
      type: 'text',
      required: true,
    },
    {
      name: 'contactEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: 'In afwachting van betaling', value: 'pending' },
        { label: 'Betaald', value: 'paid' },
        { label: 'Geannuleerd', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      admin: {
        step: 0.01,
        description: 'Berekend uit deelnemers + gekozen opties',
        readOnly: true,
      },
    },
    {
      name: 'molliePaymentId',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'confirmationEmailSent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'newAccountCreated',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
      },
    },
  ],
  timestamps: true,
}
