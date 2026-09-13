import type { Block } from 'payload'

export const BadgeStamp: Block = {
  slug: 'badgeStamp',
  interfaceName: 'BadgeStampBlock',
  labels: {
    singular: 'Badge',
    plural: 'Badges',
  },
  imageURL: '/img/blocks/badge-stamp-thumbnail.svg',
  imageAltText: 'Badge stempel block',
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      admin: {
        description: 'Bijvoorbeeld: "57e Editie • 2 t/m 5 juni 2026"',
      },
    },
  ],
}
