import type { CollectionConfig } from 'payload'

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'displayCount', 'clickCount', 'updatedAt'],
  },

  endpoints: [
    {
      path: '/:id/display',
      method: 'post',
      handler: async (req) => {
        const id = req.routeParams?.id

        if (!id) {
          return Response.json({ error: 'Sponsor ID ontbreekt' }, { status: 400 })
        }

        const sponsor = await req.payload.findByID({
          collection: 'sponsors',
          id: String(id),
        })

        await req.payload.update({
          collection: 'sponsors',
          id: String(id),
          data: {
            displayCount: (sponsor.displayCount || 0) + 1,
          },
        })

        return Response.json({
          success: true,
        })
      },
    },
    {
      path: '/:id/click',
      method: 'post',
      handler: async (req) => {
        const id = req.routeParams?.id

        if (!id) {
          return Response.json({ error: 'Sponsor ID ontbreekt' }, { status: 400 })
        }

        const sponsor = await req.payload.findByID({
          collection: 'sponsors',
          id: String(id),
        })

        await req.payload.update({
          collection: 'sponsors',
          id: String(id),
          data: {
            clickCount: (sponsor.clickCount || 0) + 1,
          },
        })

        return Response.json({
          success: true,
        })
      },
    },
  ],

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'cardBackground',
      type: 'select',
      defaultValue: 'light',
      required: true,
      options: [
        { label: 'Licht (wit)', value: 'light' },
        { label: "Donker (voor witte logo's)", value: 'dark' },
      ],
      admin: {
        description:
          'Kies "Donker" als het logo wit is en anders onzichtbaar wordt op een witte achtergrond.',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      validate: (value: string | null | undefined) => {
        if (!value) return 'URL is verplicht'

        try {
          new URL(value)
          return true
        } catch {
          return 'Voer een geldige URL in'
        }
      },
    },
    {
      name: 'displayCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
        description: 'Aantal keer dat deze sponsor daadwerkelijk is weergegeven.',
      },
    },
    {
      name: 'clickCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
        description: 'Aantal keer dat op deze sponsor is geklikt.',
      },
    },
    {
      name: 'ticketAssignmentCount',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
        description:
          'Aantal keer dat deze sponsor op een ticket is geplaatst (voor eerlijke verdeling).',
      },
    },
  ],
}
