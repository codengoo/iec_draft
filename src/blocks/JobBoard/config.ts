import type { Block } from 'payload'

export const JobBoard: Block = {
  slug: 'jobBoard',
  interfaceName: 'JobBoardBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Current Openings',
      label: 'Heading',
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Find the role that matches your expertise',
      label: 'Subtitle',
    },
  ],
}
