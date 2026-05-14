'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'
import { IconLanguage } from '@tabler/icons-react'
import { useLocale } from 'next-intl'
import React, { useTransition } from 'react'

const locales = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
] as const

export const LanguageSwitcher: React.FC = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const switchLocale = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <button
          type="button"
          disabled={isPending}
          aria-label="Change language"
          className="inline-flex items-center justify-center rounded-full p-2 text-foreground transition-colors hover:bg-foreground/5 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <IconLanguage size={20} />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        selectionMode="single"
        selectedKeys={new Set([locale])}
        onAction={(key) => switchLocale(String(key))}
      >
        {locales.map(({ code, label, flag }) => (
          <DropdownItem
            key={code}
            startContent={<span className="text-lg leading-none">{flag}</span>}
            className={code === locale ? 'font-semibold' : ''}
          >
            {label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
