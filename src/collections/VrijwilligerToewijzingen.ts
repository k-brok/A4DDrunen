import type { CollectionConfig, Where } from 'payload'

import { authenticated } from '../access/authenticated'
import { getAdminEditionId } from '@/utilities/getAdminEditionId'

export const VrijwilligerToewijzingen: CollectionConfig = {
  slug: 'vrijwilliger-toewijzingen',
  labels: {
    singular: 'Vrijwilligerstoewijzing',
    plural: 'Vrijwilligerstoewijzingen',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['persoon', 'positie', 'edition'],
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
      name: 'persoon',
      type: 'relationship',
      relationTo: 'personen',
      required: true,
    },
    {
      name: 'positie',
      type: 'relationship',
      relationTo: 'vrijwilliger-posities',
      required: true,
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, originalDoc }) => {
        if (!data?.edition || !data?.persoon || !data?.positie) return data

        const andConditions: Where[] = [
          { edition: { equals: data.edition } },
          { persoon: { equals: data.persoon } },
          { positie: { equals: data.positie } },
        ]

        if (originalDoc?.id) {
          andConditions.push({ id: { not_equals: originalDoc.id } })
        }

        const existing = await req.payload.find({
          collection: 'vrijwilliger-toewijzingen',
          where: { and: andConditions },
          limit: 1,
          req,
        })

        if (existing.docs.length > 0) {
          throw new Error('Deze persoon is al toegewezen aan deze positie voor deze editie.')
        }

        return data
      },
    ],
  },
  timestamps: true,
}
