import Image from 'next/image'
import React from 'react'

import type { InfoCardBlock as InfoCardBlockProps } from '@/payload-types'
import { IconBadge } from '@/components/IconBadge'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

const coloredBackgrounds: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  success: 'bg-success',
}

export const InfoCardBlock: React.FC<InfoCardBlockProps> = ({
  background,
  showHeader,
  iconType,
  emoji,
  icon,
  title,
  richText,
  highlightText,
  showButton,
  link,
}) => {
  const isColored = background && background !== 'card' && coloredBackgrounds[background]
  const bgClass = isColored ? coloredBackgrounds[background as string] : 'bg-card'
  const textClass = isColored ? 'text-white' : 'text-card-foreground'
  const borderClass = isColored ? '' : 'border-2 border-dashed border-primary/30'

  const proseColorOverride = isColored
    ? ({
        // Overschrijft de Typography-plugin's kleurvariabelen zodat RichText-tekst
        // wit wordt op een gekleurde achtergrond, zonder de globale prose-config te raken.
        '--tw-prose-body': '#ffffff',
        '--tw-prose-headings': '#ffffff',
        '--tw-prose-bold': '#ffffff',
        '--tw-prose-links': '#ffffff',
      } as React.CSSProperties)
    : undefined

  return (
    <div
      className={['rounded-2xl p-8 shadow-sm', bgClass, textClass, borderClass].join(' ')}
      style={proseColorOverride}
    >
      {showHeader && (title || emoji || icon) && (
        <div className="mb-4 flex items-center gap-3">
          <IconBadge
            iconType={iconType}
            emoji={emoji}
            icon={icon}
            label={title || ''}
            size="sm"
            colorClass={isColored ? 'bg-white/20' : 'bg-primary/10'}
          />
          {title && <h3 className="text-lg font-bold">{title}</h3>}
        </div>
      )}

      {richText && <RichText data={richText} enableGutter={false} />}

      {highlightText && (
        <p
          className={[
            'mt-4 font-bold uppercase tracking-wide',
            isColored ? 'text-white' : 'text-primary',
          ].join(' ')}
        >
          {highlightText}
        </p>
      )}

      {showButton && link && (
        <div className="mt-6">
          <CMSLink
            {...link}
            appearance="default"
            className={
              isColored ? '-rotate-1 rounded-xl bg-white text-primary hover:bg-white/90' : undefined
            }
          />
        </div>
      )}
    </div>
  )
}
