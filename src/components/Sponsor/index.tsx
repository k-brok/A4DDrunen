'use client'

import React, { useEffect, useRef } from 'react'
import type { Media } from '@/payload-types'

type SponsorSize = 'small' | 'medium' | 'large'

type SponsorProps = {
  id: string
  name: string
  logo: Media
  url: string
  size?: SponsorSize
  rotationClass?: string
  borderColorClass?: string
}

export function Sponsor({
  id,
  name,
  logo,
  url,
  size = 'medium',
  rotationClass = '',
  borderColorClass = 'border-neutral-300',
}: SponsorProps) {
  const sponsorRef = useRef<HTMLAnchorElement>(null)
  const hasTrackedDisplay = useRef(false)

  useEffect(() => {
    const element = sponsorRef.current

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        if (hasTrackedDisplay.current) return

        hasTrackedDisplay.current = true

        fetch(`/api/sponsors/${id}/display`, {
          method: 'POST',
        }).catch(() => {
          // Tracking mag de UI nooit laten falen.
        })

        observer.disconnect()
      },
      {
        threshold: 0.5,
      },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [id])

  const handleClick = () => {
    fetch(`/api/sponsors/${id}/click`, {
      method: 'POST',
      keepalive: true,
    }).catch(() => {
      // Tracking mag de redirect niet blokkeren.
    })
  }

  const sizeClass = {
    small: 'h-20 w-32',
    medium: 'h-28 w-44',
    large: 'h-40 w-56',
  }[size]

  return (
    <a
      ref={sponsorRef}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={[
        'group relative flex items-center justify-center',
        'overflow-hidden',
        'border-2 border-dashed',
        borderColorClass,
        'rounded-tl-2xl rounded-br-2xl',
        'bg-white',
        'transition-colors hover:border-neutral-500',
        sizeClass,
        rotationClass,
      ].join(' ')}
      aria-label={`Bekijk ${name}`}
    >
      {logo.url ? (
        <img
          src={logo.url}
          alt={logo.alt || name}
          className="block max-h-[85%] max-w-[85%] object-contain transition-transform duration-200 group-hover:scale-105"
        />
      ) : (
        <span className="text-sm text-neutral-500">{name}</span>
      )}
    </a>
  )
}
