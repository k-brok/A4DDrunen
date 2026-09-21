// app/api/account/tickets/[registrationId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateRegistrationTicketsPdf } from '@/utilities/tickets/generateTicketsPdf'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> },
) {
  const { registrationId } = await params
  const headers = await getHeaders()
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers })
  if (!user) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  const registration = await payload
    .findByID({
      collection: 'inschrijvingen',
      id: registrationId,
      depth: 0,
    })
    .catch(() => null)

  if (!registration) {
    return NextResponse.json({ error: 'Inschrijving niet gevonden' }, { status: 404 })
  }

  const account = (registration as any).account
  const accountId = typeof account === 'object' ? account?.id : account

  if (String(accountId) !== String(user.id)) {
    return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })
  }

  if (registration.status !== 'paid') {
    return NextResponse.json({ error: 'Ticket nog niet beschikbaar' }, { status: 400 })
  }

  const pdfBytes = await generateRegistrationTicketsPdf(payload, registrationId)

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="tickets-${registrationId}.pdf"`,
    },
  })
}
