import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'
import { Banner } from '@/blocks/Banner/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Code } from '@/blocks/Code/config'
import { Content } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { PolicyTabs } from '@/blocks/PolicyTabs/config'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Video Hero',
          value: 'videoHero',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      localized: true,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    // --- Video Hero fields ---
    {
      name: 'videoSource',
      type: 'select',
      label: 'Video Source',
      defaultValue: 'upload',
      options: [
        { label: 'Upload', value: 'upload' },
        { label: 'YouTube', value: 'youtube' },
      ],
      admin: {
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    {
      name: 'videoFile',
      type: 'upload',
      label: 'Video File',
      relationTo: 'media',
      admin: {
        condition: (_, { type, videoSource } = {}) =>
          type === 'videoHero' && videoSource === 'upload',
      },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube URL',
      admin: {
        description: 'Enter the full YouTube URL (e.g. https://www.youtube.com/watch?v=xxxxx)',
        condition: (_, { type, videoSource } = {}) =>
          type === 'videoHero' && videoSource === 'youtube',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      localized: true,
      admin: {
        description: 'Main heading displayed in the overlay area',
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      localized: true,
      admin: {
        description: 'Subtitle / description text below the heading',
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    {
      name: 'overlayContent',
      type: 'blocks',
      label: 'Overlay Content',
      admin: {
        description: 'Content displayed inside the overlay area (left 2/3 of the screen)',
        condition: (_, { type } = {}) => type === 'videoHero',
      },
      blocks: [CallToAction, Content, MediaBlock, Banner, Code, PolicyTabs],
    },
    // --- Video Hero buttons ---
    {
      name: 'primaryButtonLabel',
      type: 'text',
      label: 'Primary Button Label',
      localized: true,
      admin: {
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    {
      name: 'primaryButtonUrl',
      type: 'text',
      label: 'Primary Button URL',
      admin: {
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    {
      name: 'secondaryButtonLabel',
      type: 'text',
      label: 'Secondary Button Label',
      localized: true,
      admin: {
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    {
      name: 'secondaryButtonUrl',
      type: 'text',
      label: 'Secondary Button URL',
      admin: {
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
    {
      name: 'videoPopupUrl',
      type: 'text',
      label: 'Video Popup URL',
      admin: {
        description:
          'YouTube or direct video URL to open in a popup when the play button is clicked',
        condition: (_, { type } = {}) => type === 'videoHero',
      },
    },
  ],
  label: false,
}
