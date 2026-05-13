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
    {
      name: 'noFitCard',
      type: 'group',
      label: 'No Perfect Fit Card',
      admin: {
        description: 'The card displayed at the bottom of the job list for open applications',
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: "Don't see a perfect fit?",
          label: 'Heading',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue:
            'We are always looking for passionate people to join us. Send us your CV and tell us how you can make a difference at IEC Games.',
          label: 'Subtitle',
        },
        {
          name: 'cvUrl',
          type: 'text',
          label: 'CV / Apply URL',
          admin: {
            description: 'Link for the "Send Us Your CV" button',
          },
        },
        {
          name: 'innovatorLabel',
          type: 'text',
          defaultValue: 'Join 100+ Innovators today',
          label: 'Innovator Label',
        },
        {
          name: 'innovatorAvatars',
          type: 'array',
          label: 'Innovator Avatars (stacked)',
          maxRows: 5,
          fields: [
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
