import type { GlobalConfig } from 'payload'

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site-instellingen',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'organisatienaam',
      type: 'text',
      required: true,
      admin: {
        description: 'Officiële naam, bv. "Stichting Avondvierdaagse Drunen"',
      },
    },
    {
      name: 'weergavenaam',
      type: 'text',
      admin: {
        description:
          'Naam naast het logo, bv. "Avond4daagse Drunen". Valt terug op organisatienaam indien leeg.',
      },
    },
    {
      name: 'beschrijving',
      type: 'textarea',
      admin: {
        description: 'Korte introtekst in de footer',
      },
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'adres',
          type: 'group',
          fields: [
            { name: 'straat', type: 'text' },
            { name: 'postcode', type: 'text' },
            { name: 'plaats', type: 'text' },
          ],
        },
        { name: 'telefoon', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'kvkNummer', type: 'text', label: 'KvK-nummer' },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
