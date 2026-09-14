import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { forgotPasswordEmail } from '@/email/templates/forgotPassword'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: (args) => {
        if (!args) {
          throw new Error('Forgot password email parameters ontbreken')
        }

        const { token, user } = args

        const resetURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/reset/${token}`

        return forgotPasswordEmail({
          name: user.name || user.email,
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
      defaultValue: 'editor',
      required: true,
      options: [
        { label: 'Editor', value: 'editor' },
        { label: 'Admin', value: 'admin' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
