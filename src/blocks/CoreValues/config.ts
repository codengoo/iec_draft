import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

const iconOptions = [
  { label: 'Sparkles', value: 'sparkles' },
  { label: 'Diamond', value: 'diamond' },
  { label: 'Sleep (Zzz)', value: 'sleep' },
  { label: 'Gamepad', value: 'gamepad' },
  { label: 'Heart', value: 'heart' },
  { label: 'Star', value: 'star' },
  { label: 'Users', value: 'users' },
  { label: 'Shield', value: 'shield' },
  { label: 'Trophy', value: 'trophy' },
  { label: 'Bolt', value: 'bolt' },
  { label: 'Target', value: 'target' },
  { label: 'Palette', value: 'palette' },
  { label: 'Rocket', value: 'rocket' },
  { label: 'Eye', value: 'eye' },
  { label: 'Flame', value: 'flame' },
  { label: 'Coffee', value: 'coffee' },
]

export const CoreValues: Block = {
  slug: 'coreValues',
  interfaceName: 'CoreValuesBlock',
  labels: {
    singular: 'Core Values',
    plural: 'Core Values',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      defaultValue: 'Core Values',
      admin: {
        description: 'Small label shown in the pill above the heading.',
      },
    },
    {
      name: 'eyebrowIcon',
      type: 'select',
      defaultValue: 'sparkles',
      options: iconOptions,
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      label: 'Heading (top line)',
    },
    {
      name: 'headingHighlight',
      type: 'text',
      localized: true,
      label: 'Heading highlight (bottom line, primary color)',
    },
    {
      name: 'body',
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
      name: 'values',
      type: 'array',
      maxRows: 6,
      labels: { singular: 'Value', plural: 'Values' },
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'sparkles',
          options: iconOptions,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'text',
          localized: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional image shown on the right when this card is hovered.',
          },
        },
        {
          name: 'imageCaption',
          type: 'text',
          localized: true,
          admin: {
            description: 'Short caption shown right below the hovered image.',
          },
        },
      ],
    },
    {
      name: 'mascot',
      type: 'upload',
      relationTo: 'media',
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        name: 'cta',
        maxRows: 1,
        label: 'CTA',
      },
    }),
  ],
}
