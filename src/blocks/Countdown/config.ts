import type { Block } from 'payload'

export const Countdown: Block = {
  slug: 'countdown',
  interfaceName: 'CountdownBlock',
  labels: {
    singular: 'Countdown',
    plural: 'Countdowns',
  },
  imageURL: '/img/blocks/countdown-thumbnail.svg',
  fields: [
    {
      name: 'targetDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd-MM-yyyy HH:mm',
          overrides: {
            timeFormat: 'HH:mm',
            timeIntervals: 15,
          },
        },
        description: 'De datum/tijd waar naartoe wordt afgeteld',
      },
    },
  ],
}
