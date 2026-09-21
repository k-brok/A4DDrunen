import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  if (!token) {
    return NextResponse.json({ error: 'Ongeldige token' }, { status: 404 })
  }

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'inschrijvingen',
    where: {
      confirmationToken: {
        equals: token,
      },
    },
    limit: 1,
    depth: 1,
  })

  const registration = docs[0] as any

  if (!registration) {
    return NextResponse.json({ error: 'Inschrijving niet gevonden' }, { status: 404 })
  }

  if (
    registration.confirmationTokenExpiresAt &&
    new Date(registration.confirmationTokenExpiresAt) < new Date()
  ) {
    return NextResponse.json({ error: 'Deze link is verlopen' }, { status: 410 })
  }

  let participants: Array<{
    name: string
    routeTitle: string
    distance: number
    options: { label: string; price: number }[]
  }> = []

  if (registration.status === 'paid') {
    const { docs: deelnemers } = await payload.find({
      collection: 'deelnemers',
      where: { registration: { equals: registration.id } },
      depth: 2,
      limit: 50,
    })

    participants = (deelnemers as any[]).map((d) => ({
      name: d.name,
      routeTitle: typeof d.route === 'object' ? d.route.title : '',
      distance: typeof d.route === 'object' ? d.route.distance : 0,
      options: (d.selectedOptions || []).map((o: any) => ({
        label: typeof o.option === 'object' ? o.option.label : '',
        price: o.priceAtRegistration,
      })),
    }))
  }

  return NextResponse.json({
    status: registration.status,
    contactName: registration.contactName,
    contactEmail: registration.contactEmail,
    totalAmount: registration.totalAmount,
    participants,
  })
}
