'use client'

import React, { useState } from 'react'
import type { PolicyTabsBlock as PolicyTabsBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Props = PolicyTabsBlockProps & { className?: string }

export const PolicyTabsBlock: React.FC<Props> = ({ tabs, className }) => {
  const [activeTab, setActiveTab] = useState(0)

  if (!tabs || tabs.length === 0) return null

  const currentTab = tabs[activeTab]

  return (
    <div className={cn('w-full', className)}>
      {/* Tab headers */}
      <div className="flex gap-0 border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={tab.id ?? index}
            onClick={() => setActiveTab(index)}
            className={cn(
              'px-4 py-2 text-xs font-semibold tracking-wide uppercase whitespace-nowrap transition-colors',
              index === activeTab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {tab.tabName}
          </button>
        ))}
      </div>

      {/* Tab content — checklist */}
      {currentTab?.items && currentTab.items.length > 0 && (
        <ul className="mt-4 space-y-2">
          {currentTab.items.map((item, i) => (
            <li key={item.id ?? i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
