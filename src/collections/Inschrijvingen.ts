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
    create: authenticated,
    delete: authenticated,
    read: ({ req }) => {
      if (!req.user) return false
      if ((req.user as any).role !== 'klant') return true
      return { account: { equals: req.user.id } }
    },
    update: authenticated,
  },
  admin: {
    useAsTitle: 'contactEmail',
    defaultColumns: ['contactEmail', 'contactName', 'status', 'totalAmount', 'createdAt'],
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
      name: 'account',
      type: 'relationship',
      relationTo: 'users',
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
        { label: 'In afwachting', value: 'pending' },
        { label: 'Betaald', value: 'paid' },
        { label: 'Geannuleerd', value: 'canceled' },
        { label: 'Verlopen', value: 'expired' },
        { label: 'Mislukt', value: 'failed' },
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
    {
      name: 'confirmationToken',
      type: 'text',
      unique: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'confirmationTokenExpiresAt',
      type: 'date',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'personalDataRemoved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Persoonsgegevens automatisch verwijderd wegens bewaartermijn.',
      },
    },
    {
      name: 'privacyAcceptedAt',
      type: 'date',
      admin: {
        hidden: true,
      },
    },
  ],
  timestamps: true,
}
