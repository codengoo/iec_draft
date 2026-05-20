import type { Block } from 'payload'

export const IECLife: Block = {
  slug: 'iecLife',
  interfaceName: 'IECLifeBlock',
  labels: {
    singular: 'IEC Life',
    plural: 'IEC Life',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      defaultValue: "WHAT'S NEW",
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'IEC LIFE',
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      defaultValue: 'See More',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 5,
      admin: {
        description: 'How many recent posts to show (1 featured + the rest in the side list).',
        step: 1,
      },
    },
  ],
}
