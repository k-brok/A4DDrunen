const months = [
  'januari',
  'februari',
  'maart',
  'april',
  'mei',
  'juni',
  'juli',
  'augustus',
  'september',
  'oktober',
  'november',
  'december',
]

export function formatDateRangeNL(startISO: string, endISO: string): string {
  const start = new Date(startISO)
  const end = new Date(endISO)

  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()

  if (sameMonth) {
    return `${start.getDate()} t/m ${end.getDate()} ${months[end.getMonth()]}`
  }

  return `${start.getDate()} ${months[start.getMonth()]} t/m ${end.getDate()} ${months[end.getMonth()]}`
}

export function formatDayLabelNL(dateISO: string): string {
  const d = new Date(dateISO)
  const weekdays = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za']
  return `${weekdays[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`
}

export function formatTimeNL(dateISO: string): string {
  const d = new Date(dateISO)
  return d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
}
