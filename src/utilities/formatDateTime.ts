import { formatInTimeZone } from 'date-fns-tz'
import { nl } from 'date-fns/locale'

const TIMEZONE = process.env.NEXT_PUBLIC_DISPLAY_TIMEZONE || 'Europe/Amsterdam'

/**
 * Formatteert een datum/tijd in de vaste weergave-tijdzone, met date-fns format-tokens
 * (let op: kleine letters, bv. 'dd-MM-yyyy HH:mm', niet Moment-stijl 'DD-MM-YYYY').
 */
export function formatDateTime(timestamp: string | number | Date, formatStr: string): string {
  return formatInTimeZone(timestamp, TIMEZONE, formatStr, { locale: nl })
}

export function formatDateRangeNL(startISO: string, endISO: string): string {
  const sameMonth = formatDateTime(startISO, 'yyyy-MM') === formatDateTime(endISO, 'yyyy-MM')

  if (sameMonth) {
    const startDay = formatDateTime(startISO, 'd')
    const endDay = formatDateTime(endISO, 'd')
    const endMonth = formatDateTime(endISO, 'MMMM')
    return `${startDay} t/m ${endDay} ${endMonth}`
  }

  const start = formatDateTime(startISO, 'd MMMM')
  const end = formatDateTime(endISO, 'd MMMM')
  return `${start} t/m ${end}`
}

export function formatDayLabelNL(dateISO: string): string {
  return formatDateTime(dateISO, 'EEE d MMMM')
}

export function formatTimeNL(dateISO: string): string {
  return formatDateTime(dateISO, 'HH:mm')
}
