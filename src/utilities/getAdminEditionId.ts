import type { PayloadRequest } from 'payload'

const PREFERENCE_KEY = 'admin-edition'

function isValidId(value: unknown): value is string | number {
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value === 'string') return value.trim().length > 0 && !Number.isNaN(Number(value))
  return false
}

export async function getAdminEditionId(req: PayloadRequest): Promise<string | number | undefined> {
  if (!req.user) return undefined

  const pref = await req.payload.find({
    collection: 'payload-preferences',
    where: {
      and: [{ key: { equals: PREFERENCE_KEY } }, { 'user.value': { equals: req.user.id } }],
    },
    limit: 1,
  })

  const preferredId = pref.docs[0]?.value
  if (isValidId(preferredId)) return preferredId

  const active = await req.payload.find({
    collection: 'edities',
    where: { active: { equals: true } },
    limit: 1,
  })

  const activeId = active.docs[0]?.id
  return isValidId(activeId) ? activeId : undefined
}
