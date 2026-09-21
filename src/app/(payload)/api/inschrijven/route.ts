import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { randomBytes } from 'crypto'
import crypto from 'crypto'

import config from '@payload-config'
import { getMollieClient } from '@/utilities/mollie'
import { assignSponsorFairly } from '@/utilities/assignSponsorFairly'
import { assignParticipantNumber } from '@/utilities/assignParticipantNumber'

type ParticipantInput = {
  name: string
  birthDate: string
  routeId: string
  optionIds: string[]
  optionInputs?: Record<string, string>
}

type RequestBody = {
  contactName: string
  contactEmail: string
  contactPhone?: string
  createAccount?: boolean
  privacyAccepted?: boolean
  participants: ParticipantInput[]
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json()
    const {
      contactName,
      contactEmail,
      contactPhone,
      createAccount,
      privacyAccepted,
      participants,
    } = body

    if (!contactName || !contactEmail || !participants?.length) {
      return NextResponse.json({ error: 'Ontbrekende gegevens' }, { status: 400 })
    }

    if (!privacyAccepted) {
      return NextResponse.json(
        { error: 'Je moet akkoord gaan met de privacyverklaring om door te gaan.' },
        { status: 400 },
      )
    }

    if (participants.some((p) => !p.name || !p.birthDate || !p.routeId)) {
      return NextResponse.json(
        { error: 'Vul voor elke deelnemer naam, geboortedatum en route in.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    const { docs: editions } = await payload.find({
      collection: 'edities',
      where: { active: { equals: true } },
      limit: 1,
    })
    const edition = editions[0] as any
    if (!edition) {
      return NextResponse.json({ error: 'Geen actieve editie gevonden' }, { status: 400 })
    }

    const { docs: existingUsers } = await payload.find({
      collection: 'users',
      where: { email: { equals: contactEmail } },
      limit: 1,
    })

    let account = existingUsers[0] as any
    let newAccountCreated = false

    if (!account && createAccount) {
      const randomPassword = crypto.randomBytes(16).toString('hex')
      account = await payload.create({
        collection: 'users',
        data: {
          name: contactName,
          email: contactEmail,
          password: randomPassword,
          role: 'klant',
        },
      })
      newAccountCreated = true
    }

    const allOptionIds = Array.from(new Set(participants.flatMap((p) => p.optionIds || [])))
    const { docs: options } =
      allOptionIds.length > 0
        ? await payload.find({
            collection: 'prijs-opties',
            where: { id: { in: allOptionIds.map(Number) } },
            limit: 100,
          })
        : { docs: [] as any[] }

    const optionsById = new Map(options.map((o: any) => [String(o.id), o]))

    let totalAmount = 0
    const participantData = participants.map((p) => {
      const optionDocs = (p.optionIds || [])
        .map((id) => optionsById.get(String(id)))
        .filter(Boolean)
      const optionsTotal = optionDocs.reduce((sum, o: any) => sum + Number(o.price), 0)
      totalAmount += Number(edition.pricePerParticipant) + optionsTotal

      return {
        name: p.name,
        birthDate: p.birthDate,
        route: Number(p.routeId),
        selectedOptions: optionDocs.map((o: any) => ({
          option: Number(o.id),
          priceAtRegistration: o.price,
          inputValue: p.optionInputs?.[String(o.id)] || undefined,
        })),
      }
    })

    const confirmationToken = randomBytes(32).toString('hex')

    const registration = await payload.create({
      collection: 'inschrijvingen',
      data: {
        edition: edition.id,
        account: account ? account.id : undefined,
        contactName,
        contactEmail,
        contactPhone,
        confirmationToken,
        confirmationTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        status: 'pending',
        privacyAcceptedAt: new Date().toISOString(),
        totalAmount,
        newAccountCreated,
      },
    })

    for (const p of participantData) {
      const sponsorId = await assignSponsorFairly(payload)
      const participantNumber = await assignParticipantNumber(payload, edition.id)

      await payload.create({
        collection: 'deelnemers',
        data: {
          ...p,
          registration: registration.id,
          sponsor: sponsorId ?? undefined,
          participantNumber,
        },
      })
    }

    const mollieClient = getMollieClient()
    const payment = await mollieClient.payments.create({
      amount: {
        value: totalAmount.toFixed(2),
        currency: 'EUR',
      },
      description: `Inschrijving ${edition.title}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/inschrijven/bedankt?registration=${registration.id}&token=${confirmationToken}`,
      webhookUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/inschrijven/webhook`,
      metadata: {
        registrationId: String(registration.id),
      },
    })

    await payload.update({
      collection: 'inschrijvingen',
      id: registration.id,
      data: {
        molliePaymentId: payment.id,
      },
    })

    return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() })
  } catch (error) {
    console.error('Inschrijving mislukt:', error)
    return NextResponse.json({ error: 'Er ging iets mis, probeer het opnieuw.' }, { status: 500 })
  }
}
