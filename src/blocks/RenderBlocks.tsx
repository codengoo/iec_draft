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
import { CategoryShowcaseBlock } from '@/blocks/CategoryShowcase/Component'
import {
  CoreValuesBlock,
  CoreValuesHoverProvider,
  CoreValuesLeftContent,
  CoreValuesRightContent,
} from '@/blocks/CoreValues/Component'
import { FeatureTabsBlock } from '@/blocks/FeatureTabs/Component'
import { GamesPortfolioBlock } from '@/blocks/GamesPortfolio/Component'
import { IECLifeBlock } from '@/blocks/IECLife/Component'
import { SocialConnectBlock } from '@/blocks/SocialConnect/Component'
import {
  VisionMissionBlock,
  VisionMissionLeftContent,
  VisionMissionRightContent,
} from '@/blocks/VisionMission/Component'
import { PinnedCrossfade } from '@/components/PinnedCrossfade'

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
  categoryShowcase: CategoryShowcaseBlock,
}

// Blocks that manage their own vertical spacing — skip the outer `my-16` wrapper.
const flushBlocks = new Set(['aboutWithStats', 'iecLife', 'categoryShowcase'])

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (!hasBlocks) return null

  // Detect adjacent VisionMission → CoreValues pairs. The CV slot is skipped
  // from its own render position because PinnedCrossfade renders both at once.
  const pairs = new Map<number, number>()
  const skipIndices = new Set<number>()
  for (let i = 0; i < blocks.length - 1; i++) {
    if (blocks[i].blockType === 'visionMission' && blocks[i + 1].blockType === 'coreValues') {
      pairs.set(i, i + 1)
      skipIndices.add(i + 1)
    }
  }

  return (
    <Fragment>
      {blocks.map((block, index) => {
        if (skipIndices.has(index)) return null

        const { blockType } = block

        // Paired VM + CV → pinned staggered slide-up.
        // CoreValuesHoverProvider wraps the whole pair so Left cards and Right
        // image swap share a single hover state across the layered grids.
        if (pairs.has(index)) {
          const cvIndex = pairs.get(index)!
          const cvBlock = blocks[cvIndex]
          return (
            <CoreValuesHoverProvider key={index}>
              <PinnedCrossfade
                // @ts-expect-error block props are validated by Payload schema
                firstLeft={<VisionMissionLeftContent {...block} />}
                // @ts-expect-error block props are validated by Payload schema
                firstRight={<VisionMissionRightContent {...block} />}
                // @ts-expect-error block props are validated by Payload schema
                secondLeft={<CoreValuesLeftContent {...cvBlock} />}
                // @ts-expect-error block props are validated by Payload schema
                secondRight={<CoreValuesRightContent {...cvBlock} />}
              />
            </CoreValuesHoverProvider>
          )
        }

        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType]

          if (Block) {
            const isFlush = flushBlocks.has(blockType)
            return (
              <div className={isFlush ? undefined : 'my-16'} key={index}>
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
