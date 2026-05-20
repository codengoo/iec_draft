import type { Block } from 'payload'

export const GamesPortfolio: Block = {
  slug: 'gamesPortfolio',
  interfaceName: 'GamesPortfolioBlock',
  labels: {
    singular: 'Games Portfolio',
    plural: 'Games Portfolio',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      defaultValue: 'PORTFOLIO',
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Gaming Work',
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'selection',
      options: [
        { label: 'Collection', value: 'collection' },
        { label: 'Individual Selection', value: 'selection' },
      ],
    },
    {
      name: 'selectedGames',
      type: 'relationship',
      hasMany: true,
      relationTo: 'games',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
    },
  ],
}
