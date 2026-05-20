import type { Block } from 'payload'

export const CoreValues: Block = {
  slug: 'coreValues',
  interfaceName: 'CoreValuesBlock',
  labels: {
    singular: 'Core Values',
    plural: 'Core Values',
  },
  fields: [
    {
      name: 'accentIcon',
      type: 'upload',
      relationTo: 'media',
      label: 'Accent Icon',
      admin: {
        description: 'Small decorative icon shown above the heading.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'values',
      type: 'array',
      maxRows: 6,
      labels: { singular: 'Value', plural: 'Values' },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'mascot',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
