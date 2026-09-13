import type { Block } from 'payload'

export const CardColumns: Block = {
  slug: 'cardColumns',
  interfaceName: 'CardColumnsBlock',
  labels: {
    singular: 'Kaarten-rij',
    plural: 'Kaarten-rijen',
  },
  fields: [
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'iconType',
          type: 'radio',
          defaultValue: 'emoji',
          options: [
            { label: 'Emoji', value: 'emoji' },
            { label: 'Icoon (upload)', value: 'media' },
          ],
          admin: { layout: 'horizontal' },
        },
        {
          name: 'emoji',
          type: 'text',
          admin: {
            condition: (_, sibling) => sibling?.iconType === 'emoji',
            description: 'Bijvoorbeeld: 🎪',
          },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, sibling) => sibling?.iconType === 'media',
          },
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/CardColumns/RowLabel#RowLabel',
        },
      },
    },
  ],
}
