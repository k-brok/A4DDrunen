import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { getAdminEditionId } from '@/utilities/getAdminEditionId'

export const VrijwilligerBehoeften: CollectionConfig = {
  slug: 'vrijwilliger-behoeften',
  labels: {
    singular: 'Vrijwilligersbehoefte',
    plural: 'Vrijwilligersbehoeften',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['dag', 'positie', 'aantalBenodigd'],
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
      name: 'dag',
      type: 'relationship',
      relationTo: 'dagen',
      required: true,
      filterOptions: ({ data }) => {
        if (!data?.edition) return true
        return { edition: { equals: data.edition } }
      },
    },
    {
      name: 'positie',
      type: 'relationship',
      relationTo: 'vrijwilliger-posities',
      required: true,
    },
    {
      name: 'routes',
      type: 'relationship',
      relationTo: 'routes',
      hasMany: true,
      admin: {
        description:
          'Optioneel: alleen invullen als deze post specifiek voor (een van) deze route(s) is, bijvoorbeeld een drankpost. Leeg laten als de positie voor de hele dag geldt.',
      },
    },
    {
      name: 'aantalBenodigd',
      type: 'number',
      required: true,
      min: 1,
      defaultValue: 1,
    },
  ],
  timestamps: true,
}
