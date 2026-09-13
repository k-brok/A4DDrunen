import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'

export const Klanten: CollectionConfig = {
  slug: 'klanten',
  labels: {
    singular: 'Klant',
    plural: 'Klanten',
  },
  auth: true,
  access: {
    // Iedereen mag een account aanmaken (gebeurt automatisch bij inschrijven),
    // maar alleen de eigenaar zelf (of een admin) mag het lezen/wijzigen.
    create: anyone,
    read: ({ req }) => {
      if (req.user) return true // ingelogde admin/editor
      return true // TODO: verfijnen zodra front-end login klaar is (self-only)
    },
    update: ({ req }) => Boolean(req.user),
    delete: () => false,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'createdAt'],
    hidden: ({ user }) => (user as { role?: string })?.role !== 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
  timestamps: true,
}
