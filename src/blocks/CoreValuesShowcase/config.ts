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

export const CoreValuesShowcase: Block = {
  slug: 'coreValuesShowcase',
  interfaceName: 'CoreValuesShowcaseBlock',
  labels: {
    singular: 'Core Values Showcase',
    plural: 'Core Values Showcase',
  },
  fields: [
    // ── Vision & Mission content ──────────────────────────────
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      defaultValue: 'About Us',
      admin: { description: 'Small label shown in the pill above the heading.' },
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
      admin: { description: 'Any "&" is highlighted in primary color.' },
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
        description: 'Small feature pills shown below the body.',
      },
      fields: [
        { name: 'icon', type: 'select', defaultValue: 'gamepad', options: iconOptions },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'text', localized: true },
      ],
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
    // ── Mascot ───────────────────────────────────────────────
    {
      name: 'mascot',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Character shown in the center of the scroll animation.' },
    },
    // ── Core Values ──────────────────────────────────────────
    {
      name: 'valuesEyebrow',
      type: 'text',
      localized: true,
      defaultValue: 'Core Values',
      label: 'Values eyebrow label',
    },
    {
      name: 'valuesDescription',
      type: 'text',
      localized: true,
      label: 'Values description',
      admin: { description: 'Short subtitle shown below the Core Values heading.' },
    },
    {
      name: 'values',
      type: 'array',
      maxRows: 6,
      labels: { singular: 'Value', plural: 'Values' },
      fields: [
        { name: 'icon', type: 'select', defaultValue: 'sparkles', options: iconOptions },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'description', type: 'text', localized: true },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Image revealed when this card is hovered/expanded.' },
        },
        {
          name: 'imageCaption',
          type: 'text',
          localized: true,
          admin: { description: 'Caption shown below the expanded image.' },
        },
      ],
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: { name: 'cta', maxRows: 1, label: 'CTA' },
    }),
  ],
}
