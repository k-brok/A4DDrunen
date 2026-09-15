import type { CollectionConfig } from 'payload'
import type { Where } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Edities: CollectionConfig = {
  slug: 'edities',
  labels: {
    singular: 'Editie',
    plural: 'Edities',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'active'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description:
          'Bijvoorbeeld: "57e editie 2026" — deze tekst verschijnt ook onderaan de routekaarten',
      },
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      admin: {
        description: 'Bijvoorbeeld: 2026',
      },
    },
    {
      name: 'pricePerParticipant',
      type: 'number',
      required: true,
      admin: {
        description: "Basisprijs per deelnemer in euro's, bijvoorbeeld 5.00",
        step: 0.01,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
        },
        {
          name: 'endDate',
          type: 'date',
          required: true,
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Dit is de huidige/actieve editie',
      },
    },
    slugField({
      position: undefined,
    }),
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        if (data?.active) {
          const where: Where = originalDoc?.id
            ? {
                and: [
                  {
                    active: {
                      equals: true,
                    },
                  },
                  {
                    id: {
                      not_equals: originalDoc.id,
                    },
                  },
                ],
              }
            : {
                active: {
                  equals: true,
                },
              }

          await req.payload.update({
            collection: 'edities',
            where,
            data: {
              active: false,
            },
            req,
          })
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        if (!doc?.startDate || !doc?.endDate) return doc

        // Kalenderdagen (zonder tijd) tussen start en eind, inclusief beide uitersten.
        const toDateOnly = (value: string) => {
          const d = new Date(value)
          return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
        }

        const start = toDateOnly(doc.startDate)
        const end = toDateOnly(doc.endDate)
        const days: Date[] = []

        for (
          let cursor = new Date(start);
          cursor <= end;
          cursor.setUTCDate(cursor.getUTCDate() + 1)
        ) {
          days.push(new Date(cursor))
        }

        const existing = await req.payload.find({
          collection: 'dagen',
          where: { edition: { equals: doc.id } },
          limit: 100,
          req,
        })

        const existingDates = new Set(
          existing.docs.map((d) => new Date(d.date).toISOString().slice(0, 10)),
        )

        for (const day of days) {
          const iso = day.toISOString().slice(0, 10)
          if (!existingDates.has(iso)) {
            await req.payload.create({
              collection: 'dagen',
              data: {
                edition: doc.id,
                date: day.toISOString(),
              },
              req,
            })
          }
        }

        return doc
      },
    ],
  },
}
