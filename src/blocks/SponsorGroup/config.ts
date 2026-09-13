import type { Block } from 'payload'

export const SponsorGroup: Block = {
  slug: 'sponsorGroup',

  interfaceName: 'SponsorGroupBlock',

  labels: {
    singular: 'Sponsoren',
    plural: 'Sponsoren',
  },

  imageURL: '/img/blocks/sponsor-group-thumbnail.svg',

  imageAltText: 'Sponsor groep block',

  fields: [
    {
      name: 'max',
      type: 'select',
      defaultValue: 'all',
      required: true,
      options: [
        {
          label: 'Alle',
          value: 'all',
        },
        {
          label: '1 sponsor',
          value: '1',
        },
        {
          label: '2 sponsors',
          value: '2',
        },
        {
          label: '3 sponsors',
          value: '3',
        },
        {
          label: '4 sponsors',
          value: '4',
        },
        {
          label: '6 sponsors',
          value: '6',
        },
        {
          label: '8 sponsors',
          value: '8',
        },
      ],
      admin: {
        description: 'Aantal sponsoren dat maximaal wordt getoond.',
      },
    },

    {
      name: 'size',
      type: 'select',
      defaultValue: 'medium',
      required: true,
      options: [
        {
          label: 'Klein',
          value: 'small',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Groot',
          value: 'large',
        },
      ],
      admin: {
        description: 'Grootte van alle sponsor-tegels.',
      },
    },
  ],
}
