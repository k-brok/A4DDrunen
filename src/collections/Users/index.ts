import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import { forgotPasswordEmail } from '@/email/templates/forgotPassword'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req }) => Boolean(req.user) && (req.user as any).role !== 'klant',
    create: anyone,
    delete: authenticated,
    read: ({ req }) => {
      if (!req.user) return false
      if ((req.user as any).role !== 'klant') return true
      return { id: { equals: req.user.id } }
    },
    update: ({ req }) => {
      if (!req.user) return false
      if ((req.user as any).role !== 'klant') return true
      return { id: { equals: req.user.id } }
    },
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
    baseListFilter: () => ({ role: { not_equals: 'klant' } }),
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: (args) => {
        if (!args?.token || !args?.user) {
          throw new Error('Missing token or user for password reset email')
        }

        const { token, user } = args

        const isKlant = (user as any).role === 'klant'

        const resetURL = isKlant
          ? `${process.env.NEXT_PUBLIC_SERVER_URL}/account/wachtwoord-instellen/${token}`
          : `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/reset/${token}`

        return forgotPasswordEmail({
          name: user.name,
          resetURL,
        })
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'klant',
      required: true,
      options: [
        { label: 'Klant', value: 'klant' },
        { label: 'Editor', value: 'editor' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        update: ({ req }) => Boolean(req.user) && (req.user as any).role === 'admin',
        create: ({ req }) => Boolean(req.user) && (req.user as any).role === 'admin',
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}