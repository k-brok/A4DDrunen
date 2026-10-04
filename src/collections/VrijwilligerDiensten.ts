import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { getAdminEditionId } from '@/utilities/getAdminEditionId'

export const VrijwilligerDiensten: CollectionConfig = {
  slug: 'vrijwilliger-diensten',
  labels: {
    singular: 'Vrijwilligersdienst',
    plural: 'Vrijwilligersdiensten',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['behoefte', 'persoon'],
    baseListFilter: async ({ req }) => {
      const editionId = await getAdminEditionId(req)
      if (!editionId) return null
      return { 'behoefte.edition': { equals: editionId } }
    },
  },
  fields: [
    {
      name: 'behoefte',
      type: 'relationship',
      relationTo: 'vrijwilliger-behoeften',
      required: true,
      filterOptions: async ({ req }) => {
        const editionId = await getAdminEditionId(req)
        if (!editionId) return true
        return { edition: { equals: editionId } }
      },
    },
    {
      name: 'persoon',
      type: 'relationship',
      relationTo: 'personen',
      required: true,
      // Toont alleen personen die voor deze editie+positie al als vrijwilliger geregistreerd staan
      // (dus uit de 'pool' van VrijwilligerToewijzingen), zodat je niet per ongeluk iemand
      // inplant die zich niet voor die rol heeft opgegeven.
      filterOptions: async ({ data, req }) => {
        if (!data?.behoefte) return true

        const behoefte = await req.payload.findByID({
          collection: 'vrijwilliger-behoeften',
          id: data.behoefte,
          req,
        })

        if (!behoefte) return true

        const toewijzingen = await req.payload.find({
          collection: 'vrijwilliger-toewijzingen',
          where: {
            and: [
              { edition: { equals: behoefte.edition } },
              { positie: { equals: behoefte.positie } },
            ],
          },
          limit: 200,
          req,
        })

        const toegestanePersoonIds = toewijzingen.docs.map((t: any) =>
          typeof t.persoon === 'object' ? t.persoon.id : t.persoon,
        )

        if (toegestanePersoonIds.length === 0) return true

        return { id: { in: toegestanePersoonIds } }
      },
    },
  ],
  timestamps: true,
}
