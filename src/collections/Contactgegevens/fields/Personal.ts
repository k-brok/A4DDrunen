import type { Field } from 'payload'

export const personalFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'voornaam',
        type: 'text',
        required: true,
      },
      {
        name: 'achternaam',
        type: 'text',
        required: true,
      },
    ],
  },

  {
    name: 'organisatie',
    type: 'text',
  },
]
