import type { Payload, PayloadRequest } from 'payload'

export async function assignParticipantNumber(
  payload: Payload,
  editionId: string | number,
  req?: PayloadRequest,
): Promise<number> {
  const edition = await payload.findByID({ collection: 'edities', id: editionId, req })
  const next = ((edition as any).participantCounter || 0) + 1

  await payload.update({
    collection: 'edities',
    id: editionId,
    data: { participantCounter: next },
    req,
  })

  return next
}
