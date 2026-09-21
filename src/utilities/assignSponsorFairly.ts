import type { Payload, PayloadRequest } from 'payload'

export async function assignSponsorFairly(
  payload: Payload,
  req?: PayloadRequest,
): Promise<number | null> {
  const { docs: sponsors } = await payload.find({
    collection: 'sponsors',
    sort: 'ticketAssignmentCount',
    limit: 1,
    req,
  })

  const sponsor = sponsors[0] as any
  if (!sponsor) return null

  await payload.update({
    collection: 'sponsors',
    id: sponsor.id,
    data: { ticketAssignmentCount: (sponsor.ticketAssignmentCount || 0) + 1 },
    req,
  })

  return sponsor.id
}
