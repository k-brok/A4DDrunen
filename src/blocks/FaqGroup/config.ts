import type { Block } from 'payload'

export const FaqGroup: Block = {
  slug: 'faqGroup',
  interfaceName: 'FaqGroupBlock',
  labels: {
    singular: 'FAQ-groep',
    plural: 'FAQ-groepen',
  },
  imageURL: '/img/blocks/faq-group-thumbnail.svg',
  fields: [
    {
      name: 'max',
      type: 'select',
      defaultValue: 'all',
      required: true,
      options: [
        { label: 'Alle', value: 'all' },
        { label: '1 vraag', value: '1' },
        { label: '2 vragen', value: '2' },
        { label: '3 vragen', value: '3' },
        { label: '4 vragen', value: '4' },
        { label: '6 vragen', value: '6' },
        { label: '8 vragen', value: '8' },
      ],
      admin: {
        description: 'Aantal vragen dat maximaal wordt getoond, op volgorde van het order-veld.',
      },
    },
  ],
}
