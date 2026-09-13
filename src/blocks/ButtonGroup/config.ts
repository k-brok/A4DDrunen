import type { Block } from 'payload'

import { link } from '@/fields/link'

export const ButtonGroup: Block = {
  slug: 'buttonGroup',
  interfaceName: 'ButtonGroupBlock',
  labels: {
    singular: 'Knoppengroep',
    plural: 'Knoppengroepen',
  },
  imageURL: '/img/blocks/button-group-thumbnail.svg',
  fields: [
    {
      name: 'buttons',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'size',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Klein', value: 'sm' },
            { label: 'Normaal', value: 'default' },
            { label: 'Groot', value: 'lg' },
            { label: 'heelGroot', value: 'xl' },
          ],
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/ButtonGroup/RowLabel#RowLabel',
        },
      },
    },
  ],
}
