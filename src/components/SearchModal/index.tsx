'use client'

import { Link } from '@/i18n/navigation'
import { useSearchModal } from '@/providers/SearchModal'
import { useDebounce } from '@/utilities/useDebounce'
import { IconFileText, IconSearch } from '@tabler/icons-react'
import React, { useEffect, useRef, useState } from 'react'

type SearchResult = {
  id: string
  title: string
  slug: string
  doc?: {
    relationTo: string
    value: { id: string; slug: string }
  }
  meta?: {
    description?: string
  }
}

function getResultHref(result: SearchResult): string {
  if (result.doc?.relationTo === 'posts') return `/posts/${result.slug}`
  return `/${result.slug}`
}

export const SearchModal: React.FC = () => {
  const { isOpen, closeModal } = useSearchModal()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  // Focus input and reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Lock scroll + ESC handler
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Fetch results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    const params = new URLSearchParams()
    params.set('where[or][0][title][like]', debouncedQuery)
    params.set('where[or][1][slug][like]', debouncedQuery)
    params.set('where[or][2][meta.description][like]', debouncedQuery)
    params.set('limit', '8')
    params.set('depth', '1')

    fetch(`/api/search?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setResults(data?.docs ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-9999 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-lg mx-4 bg-background rounded-xl shadow-2xl overflow-hidden border border-divider"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-divider">
          <IconSearch size={18} className="text-foreground-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you searching for?"
            className="flex-1 bg-transparent text-foreground placeholder:text-foreground-400 outline-none text-sm"
          />
          <kbd className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-foreground-400 bg-default-100 rounded border border-default-300 select-none">
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <p className="px-4 py-6 text-center text-sm text-foreground-400">Searching…</p>
          )}

          {!loading && debouncedQuery.trim() && results.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-foreground-400">No results found</p>
          )}

          {!loading && !debouncedQuery.trim() && (
            <p className="px-4 py-6 text-center text-sm text-foreground-400">
              Type to start searching…
            </p>
          )}

          {!loading && results.length > 0 && (
            <ul className="py-2">
              {results.map((result) => (
                <li key={result.id}>
                  <Link
                    href={getResultHref(result)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-default-100 transition-colors group"
                    onClick={closeModal}
                  >
                    <IconFileText
                      size={16}
                      className="text-foreground-400 shrink-0 group-hover:text-primary transition-colors"
                    />
                    <span className="text-sm text-foreground truncate">{result.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
