import { NextRequest, NextResponse } from 'next/server'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  const headers = await getHeaders()
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers })
  if (!user || (user as any).role === 'klant') {
    return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
  }

  const { token } = await req.json()
  if (!token) {
    return NextResponse.json({ error: 'Geen token ontvangen' }, { status: 400 })
  }

  const { docs: deelnemerDocs } = await payload.find({
    collection: 'deelnemers',
    where: { checkInToken: { equals: token } },
    depth: 2,
    limit: 1,
  })

  const deelnemer = deelnemerDocs[0] as any
  if (!deelnemer) {
    return NextResponse.json({ error: 'Onbekend ticket' }, { status: 404 })
  }

  const route = deelnemer.route
  const edition = typeof route === 'object' ? route.edition : undefined
  const editionId = typeof edition === 'object' ? edition?.id : edition

  if (!editionId) {
    return NextResponse.json({ error: 'Kon editie niet bepalen' }, { status: 500 })
  }

  // "Vandaag" bepalen: de dagen-entry van deze editie die overeenkomt met de huidige kalenderdag.
  const todayIso = new Date().toISOString().slice(0, 10)
  const { docs: dagenDocs } = await payload.find({
    collection: 'dagen',
    where: { edition: { equals: editionId } },
    limit: 100,
  })

  const today = (dagenDocs as any[]).find(
    (d) => new Date(d.date).toISOString().slice(0, 10) === todayIso,
  )

  if (!today) {
    return NextResponse.json({ error: 'Vandaag is geen dag van dit evenement' }, { status: 400 })
  }

  const { docs: existingToday } = await payload.find({
    collection: 'incheckmomenten',
    where: {
      and: [{ deelnemer: { equals: deelnemer.id } }, { dag: { equals: today.id } }],
    },
    sort: 'createdAt',
    limit: 10,
  })

  const hasIn = (existingToday as any[]).some((e) => e.type === 'in')
  const hasUit = (existingToday as any[]).some((e) => e.type === 'uit')

  if (hasIn && hasUit) {
    return NextResponse.json(
      {
        error: 'Al in- en uitgecheckt vandaag',
        participantName: deelnemer.name,
      },
      { status: 409 },
    )
  }

  const type = hasIn ? 'uit' : 'in'

  await payload.create({
    collection: 'incheckmomenten',
    data: {
      deelnemer: deelnemer.id,
      dag: today.id,
      type,
      scannedBy: user.id,
    },
  })

  return NextResponse.json({
    success: true,
    type,
    participantName: deelnemer.name,
    routeTitle: typeof route === 'object' ? route.title : '',
  })
}
