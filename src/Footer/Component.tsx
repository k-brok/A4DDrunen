import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const [footerData, siteSettings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('site-settings', 1)(),
  ])

  const navItems = footerData?.navItems || []
  const { organisatienaam, weergavenaam, beschrijving, contact } = siteSettings || {}
  const { adres, telefoon, email, kvkNummer } = contact || {}

  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-foreground text-white dark:bg-card">
      <div
        className="pointer-events-none absolute top-0 left-1/2 z-10 h-[80px] w-screen -translate-x-1/2 bg-repeat-x"
        style={{
          backgroundImage: 'url("/img/Vlaggetjes.svg")',
          backgroundPosition: 'bottom center',
          backgroundSize: '1200px 80px',
        }}
      />

      <div className="container relative z-20 grid gap-10 pt-20 pb-8 md:grid-cols-3">
        {/* Kolom 1: logo, naam, beschrijving */}
        <div className="flex flex-col gap-4">
          <Link className="flex items-center gap-3" href="/">
            <Logo className="!w-[80px] brightness-0 invert" />
          </Link>
          {(weergavenaam || organisatienaam) && (
            <span className="font-semibold text-sky-400">{weergavenaam || organisatienaam}</span>
          )}
          {beschrijving && <p className="max-w-xs text-sm text-white/70">{beschrijving}</p>}
        </div>

        {/* Kolom 2: navigatie */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-white">Snel naar</h3>
          <nav className="flex flex-col gap-3">
            {navItems.map(({ link }, i) => (
              <CMSLink className="text-white/80 hover:text-white" key={i} {...link} />
            ))}
          </nav>
        </div>

        {/* Kolom 3: contact */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-white">Contact</h3>
          <div className="flex flex-col gap-1 text-sm text-white/80">
            {organisatienaam && <span>{organisatienaam}</span>}
            {adres?.straat && <span>{adres.straat}</span>}
            {(adres?.postcode || adres?.plaats) && (
              <span>
                {adres?.postcode} {adres?.plaats}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 text-sm text-white/80">
            {telefoon && <a href={`tel:${telefoon.replace(/[^+\d]/g, '')}`}>{telefoon}</a>}
            {email && <a href={`mailto:${email}`}>{email}</a>}
          </div>
          {kvkNummer && <span className="text-sm text-white/50">KvK: {kvkNummer}</span>}
        </div>
      </div>

      <div className="container relative z-20 flex flex-col-reverse items-center justify-between gap-4 border-t border-white/10 py-4 text-sm text-white/50 md:flex-row">
        <span>
          © {year} {organisatienaam}
        </span>
        <ThemeSelector />
      </div>
    </footer>
  )
}
