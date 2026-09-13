import type { Field } from 'payload'

export const addressFields: Field[] = [
  {
    name: 'adres',
    type: 'group',
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'straat',
            type: 'text',
          },
          {
            name: 'huisnummer',
            type: 'text',
          },
          {
            name: 'toevoeging',
            type: 'text',
          },
        ],
      },

      {
        type: 'row',
        fields: [
          {
            name: 'postcode',
            type: 'text',
          },
          {
            name: 'plaats',
            type: 'text',
          },
        ],
      },

      {
        name: 'land',
        type: 'text',
        defaultValue: 'Nederland',
      },
    ],
  },
]
