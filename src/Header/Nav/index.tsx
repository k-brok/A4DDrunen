'use client'

import React, { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { Menu, SearchIcon, X } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Desktop navigatie, zichtbaar vanaf lg */}
      <nav className="hidden items-center gap-3 lg:flex">
        {navItems.map(({ link }, i) => (
          <CMSLink
            className="text-sm font-bold text-foreground hover:text-primary"
            key={i}
            {...link}
            appearance="link"
          />
        ))}
        <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>
      </nav>

      {/* Hamburger-trigger, zichtbaar onder lg */}
      <div className="flex items-center gap-3 lg:hidden">
        <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          aria-expanded={isOpen}
        >
          <Menu className="w-6 text-foreground" />
        </button>
      </div>

      {/* Mobiel uitklap-menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background lg:hidden">
          <div className="container flex items-center justify-between pt-3 pb-1">
            <span className="text-sm font-bold text-foreground">Menu</span>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Sluit menu">
              <X className="w-6 text-foreground" />
            </button>
          </div>

          <nav className="container flex flex-col gap-6 pt-8">
            {navItems.map(({ link }, i) => (
              <CMSLink
                className="text-lg font-bold text-foreground hover:text-primary"
                key={i}
                {...link}
                appearance="link"
                onClick={() => setIsOpen(false)}
              />
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
