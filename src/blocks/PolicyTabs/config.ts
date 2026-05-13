import type { Block } from 'payload'

export const PolicyTabs: Block = {
  slug: 'policyTabs',
  interfaceName: 'PolicyTabsBlock',
  labels: {
    singular: 'Policy Tabs',
    plural: 'Policy Tabs',
  },
  fields: [
    {
      name: 'tabs',
      type: 'array',
      label: 'Tabs',
      minRows: 1,
      fields: [
        {
          name: 'tabName',
          type: 'text',
          label: 'Tab Name',
          localized: true,
          required: true,
        },
        {
          name: 'items',
          type: 'array',
          label: 'Checklist Items',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Item Text',
              localized: true,
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
