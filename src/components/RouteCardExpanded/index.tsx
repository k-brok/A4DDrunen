import { Clock, MapPin } from 'lucide-react'
import React from 'react'

import { formatDayLabelNL, formatTimeNL } from '@/utilities/formatDateRangeNL'
import { resolveRouteDayInfo } from '@/utilities/resolveRouteDayInfo'

type DayItem = {
  id: string
  date: string
  startTime?: string | null
  endTime?: string | null
  startLocation?: string | null
  routeOverrides?: {
    route: { id: string | number } | string | number
    startTime?: string | null
    endTime?: string | null
    startLocation?: string | null
  }[]
}

type RouteItem = {
  id: string
  title: string
  description?: string | null
  distance: number
  emoji?: string | null
  iconType?: string | null
  icon?: { url?: string | null; alt?: string | null } | null
  highlights?: { text: string }[] | null
}

const colorClasses = [
  { text: 'text-accent', bullet: 'bg-accent', border: 'border-accent' },
  { text: 'text-primary', bullet: 'bg-primary', border: 'border-primary' },
  { text: 'text-success', bullet: 'bg-success', border: 'border-success' },
]

type Props = {
  route: RouteItem
  days: DayItem[]
  editionTitle?: string
  editionDateRange?: string
  index?: number
}

export const RouteCardExpanded: React.FC<Props> = ({
  route,
  days,
  editionTitle,
  editionDateRange,
  index = 0,
}) => {
  const color = colorClasses[index % colorClasses.length]
  const distanceLabel = String(route.distance).replace('.', ',')

  return (
    <div className="overflow-hidden rounded-3xl bg-card p-8 shadow-md md:p-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        {/* Linkerkolom: info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <span className={['text-6xl font-bold', color.text].join(' ')}>{distanceLabel}</span>
            <span className="pb-2 text-lg font-medium text-muted-foreground">km</span>
          </div>

          <h3 className="text-xl font-bold text-card-foreground">{route.title}</h3>

          {route.description && (
            <p className="text-sm text-muted-foreground">{route.description}</p>
          )}

          {route.highlights && route.highlights.length > 0 && (
            <ul className="flex flex-col gap-2">
              {route.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className={['h-1.5 w-1.5 rounded-full', color.bullet].join(' ')} />
                  {h.text}
                </li>
              ))}
            </ul>
          )}

          {days.length > 0 && (
            <>
              <div className={['my-2 border-t border-dashed', color.border].join(' ')} />

              <div className="flex flex-col gap-2">
                {days.map((day) => {
                  const resolved = resolveRouteDayInfo(day, route.id)

                  return (
                    <div
                      key={resolved.id}
                      className="flex flex-col gap-1 text-sm text-muted-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className={['h-4 w-4', color.text].join(' ')} />
                        <span>
                          {formatDayLabelNL(resolved.date)}
                          {resolved.startTime && ` — ${formatTimeNL(resolved.startTime)}`}
                          {resolved.endTime && ` tot ${formatTimeNL(resolved.endTime)}`} uur
                        </span>
                      </div>
                      {resolved.startLocation && (
                        <div className="flex items-center gap-2 pl-6">
                          <MapPin className={['h-4 w-4 shrink-0', color.text].join(' ')} />
                          <span>{resolved.startLocation}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Rechterkolom: kaart-placeholder */}
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-muted bg-muted/40 md:min-h-full">
          <MapPin className="h-8 w-8 text-muted-foreground" />
          <span className="font-semibold text-muted-foreground">Routekaart volgt</span>
          <span className="text-sm text-muted-foreground">{distanceLabel} km route</span>
        </div>
      </div>

      {(editionTitle || editionDateRange) && (
        <div className="mt-8 flex items-center justify-between border-t border-dashed border-muted pt-4">
          {editionTitle && (
            <span className={['text-xs font-bold uppercase tracking-wide', color.text].join(' ')}>
              {editionTitle}
            </span>
          )}
          {editionDateRange && (
            <span className="text-xs text-muted-foreground">{editionDateRange}</span>
          )}
        </div>
      )}
    </div>
  )
}
