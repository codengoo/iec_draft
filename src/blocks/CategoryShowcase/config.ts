import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const CategoryShowcase: Block = {
  slug: 'categoryShowcase',
  interfaceName: 'CategoryShowcaseBlock',
  labels: {
    singular: 'Category Showcase',
    plural: 'Category Showcase',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      defaultValue: 'JOIN WITH US',
      admin: {
        description: 'Small uppercase label shown above the heading.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Build the Next Modular Masterpiece',
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {
        description: 'Only posts in this category will be shown in the block.',
      },
    },
    {
      name: 'pillsCount',
      type: 'number',
      defaultValue: 3,
      admin: {
        description: 'How many posts to show as pill rows in the left column.',
        step: 1,
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      defaultValue: 'Xem tất cả',
      admin: {
        description: 'Optional CTA label shown under the pill list.',
      },
    },
  ],
}
