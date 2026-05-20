import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { JobBoardBlock } from '@/blocks/JobBoard/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { SendUsCVBlock } from '@/blocks/SendUsCV/Component'

import { AboutWithStatsBlock } from '@/blocks/AboutWithStats/Component'
import { CareersHighlightBlock } from '@/blocks/CareersHighlight/Component'
import { CoreValuesBlock } from '@/blocks/CoreValues/Component'
import { FeatureTabsBlock } from '@/blocks/FeatureTabs/Component'
import { GamesPortfolioBlock } from '@/blocks/GamesPortfolio/Component'
import { IECLifeBlock } from '@/blocks/IECLife/Component'
import { SocialConnectBlock } from '@/blocks/SocialConnect/Component'
import { VisionMissionBlock } from '@/blocks/VisionMission/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  jobBoard: JobBoardBlock,
  mediaBlock: MediaBlock,
  sendUsCV: SendUsCVBlock,
  aboutWithStats: AboutWithStatsBlock,
  gamesPortfolio: GamesPortfolioBlock,
  visionMission: VisionMissionBlock,
  coreValues: CoreValuesBlock,
  careersHighlight: CareersHighlightBlock,
  featureTabs: FeatureTabsBlock,
  socialConnect: SocialConnectBlock,
  iecLife: IECLifeBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
