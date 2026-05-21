import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

const iconOptions = [
  { label: 'Gamepad', value: 'gamepad' },
  { label: 'Users', value: 'users' },
  { label: 'Star', value: 'star' },
  { label: 'Heart', value: 'heart' },
  { label: 'Sparkles', value: 'sparkles' },
  { label: 'Shield', value: 'shield' },
  { label: 'Trophy', value: 'trophy' },
  { label: 'Bolt', value: 'bolt' },
  { label: 'Target', value: 'target' },
  { label: 'Palette', value: 'palette' },
  { label: 'Rocket', value: 'rocket' },
  { label: 'Eye', value: 'eye' },
]

export const VisionMission: Block = {
  slug: 'visionMission',
  interfaceName: 'VisionMissionBlock',
  labels: {
    singular: 'Vision & Mission',
    plural: 'Vision & Mission',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      defaultValue: 'About Us',
      admin: {
        description: 'Small label shown in the pill above the heading.',
      },
    },
    {
      name: 'eyebrowIcon',
      type: 'select',
      defaultValue: 'gamepad',
      options: iconOptions,
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Any "&" character in the heading is highlighted in primary color.',
      },
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
      name: 'features',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'Feature', plural: 'Features' },
      admin: {
        description: 'Small feature pills shown below the body (e.g. SÁNG TẠO, KẾT NỐI, GIÁ TRỊ).',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'gamepad',
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
      ],
    },
    {
      name: 'mascot',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'vision',
      type: 'textarea',
      localized: true,
      label: 'Vision',
    },
    {
      name: 'mission',
      type: 'textarea',
      localized: true,
      label: 'Mission',
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
