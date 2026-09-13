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

export type ResolvedDayInfo = {
  id: string
  date: string
  startTime?: string | null
  endTime?: string | null
  startLocation?: string | null
}

export function resolveRouteDayInfo(day: DayItem, routeId: string | number): ResolvedDayInfo {
  const override = day.routeOverrides?.find((o) => {
    const overrideRouteId = typeof o.route === 'object' ? o.route.id : o.route
    return String(overrideRouteId) === String(routeId)
  })

  return {
    id: day.id,
    date: day.date,
    startTime: override?.startTime ?? day.startTime,
    endTime: override?.endTime ?? day.endTime,
    startLocation: override?.startLocation ?? day.startLocation,
  }
}
