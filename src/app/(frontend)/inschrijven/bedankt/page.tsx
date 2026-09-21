import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { BetalingStatus } from './BetalingStatus'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ token?: string }>
}

export default async function BedanktPage({ searchParams }: Props) {
  const { token } = await searchParams

  if (!token) {
    notFound()
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
    notFound()
  }

  if (
    registration.confirmationTokenExpiresAt &&
    new Date(registration.confirmationTokenExpiresAt) < new Date()
  ) {
    notFound()
  }

  let participants: any[] = []

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

  return (
    <BetalingStatus
      token={token}
      initialStatus={{
        status: registration.status,
        contactName: registration.contactName,
        contactEmail: registration.contactEmail,
        totalAmount: registration.totalAmount,
        participants,
      }}
    />
  )
}
