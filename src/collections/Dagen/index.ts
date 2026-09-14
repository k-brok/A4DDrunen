import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { getAdminEditionId } from '@/utilities/getAdminEditionId'

export const Dagen: CollectionConfig = {
  slug: 'dagen',
  labels: {
    singular: 'Dag',
    plural: 'Dagen',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'date', 'startTime', 'startLocation'],
    baseListFilter: async ({ req }) => {
      const editionId = await getAdminEditionId(req)
      if (!editionId) return null

      return {
        edition: { equals: editionId },
      }
    },
  },
  defaultSort: 'date',
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
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'label',
      type: 'text',
      admin: {
        position: 'sidebar',
        description:
          'Automatisch ingevuld op basis van de datum (bv. "Dinsdag 2 juni 2026"), tenzij je hier iets eigens invult.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'HH:mm',
              overrides: {
                timeFormat: 'HH:mm',
                timeIntervals: 15,
              },
            },
          },
        },
        {
          name: 'endTime',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
              displayFormat: 'HH:mm',
              overrides: {
                timeFormat: 'HH:mm',
                timeIntervals: 15,
              },
            },
          },
        },
      ],
    },
    {
      name: 'startLocation',
      type: 'text',
      admin: {
        description: 'Bijvoorbeeld: "Sporthal De Kubus"',
      },
    },
    {
      name: 'routeOverrides',
      type: 'array',
      admin: {
        description:
          'Alleen invullen als een route op deze dag een afwijkende tijd of locatie heeft. Leeg = gebruik de standaardtijd/locatie hierboven.',
        initCollapsed: true,
        components: {
          RowLabel: '@/collections/Dagen/RouteOverrideRowLabel#RouteOverrideRowLabel',
        },
      },
      fields: [
        {
          name: 'route',
          type: 'relationship',
          relationTo: 'routes',
          required: true,
          filterOptions: ({ data }) => {
            const editionId = data?.edition
            if (!editionId) return true // nog geen editie gekozen, geen filter

            return {
              edition: { equals: editionId },
            }
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'startTime',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'timeOnly',
                  displayFormat: 'HH:mm',
                  overrides: {
                    timeFormat: 'HH:mm',
                    timeIntervals: 15,
                  },
                },
              },
            },
            {
              name: 'endTime',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'timeOnly',
                  displayFormat: 'HH:mm',
                  overrides: {
                    timeFormat: 'HH:mm',
                    timeIntervals: 15,
                  },
                },
              },
            },
          ],
        },
        {
          name: 'startLocation',
          type: 'text',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Genereer automatisch een leesbaar label als de gebruiker er zelf niets heeft ingevuld.
        if (!data?.label && data?.date) {
          const formatted = new Intl.DateTimeFormat('nl-NL', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(new Date(data.date))

          data.label = formatted.charAt(0).toUpperCase() + formatted.slice(1)
        }
        return data
      },
    ],
  },
}
