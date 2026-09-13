import type { Block } from 'payload'

export const IntroHeading: Block = {
  slug: 'introHeading',
  interfaceName: 'IntroHeadingBlock',
  labels: {
    singular: 'Titel met intro',
    plural: "Titels met intro's",
  },
  imageURL: '/img/blocks/intro-heading-thumbnail.svg',
  imageAltText: 'Intro hrading block',
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Bijvoorbeeld: "Héél Drunen"',
      },
    },
    {
      name: 'accentLine',
      type: 'text',
      admin: {
        description: 'Bijvoorbeeld: "wandelt weer!"',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description: 'Optionele beschrijvende tekst eronder',
      },
    },
  ],
}
