import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'
import { mollieClient } from '@/utilities/mollie'
import { registrationConfirmationEmail } from '@/email/templates/registrationConfirmation'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const paymentId = formData.get('id') as string

    if (!paymentId) {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const payment = await mollieClient.payments.get(paymentId)
    const payload = await getPayload({ config })

    const { docs: registrations } = await payload.find({
      collection: 'inschrijvingen',
      where: { molliePaymentId: { equals: paymentId } },
      limit: 1,
      depth: 1,
    })

    const registration = registrations[0] as any
    if (!registration) {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    // Voorkom dubbel verwerken als Mollie de webhook meerdere keren stuurt
    if (registration.status === 'paid') {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    if (payment.status !== 'paid') {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    await payload.update({
      collection: 'inschrijvingen',
      id: registration.id,
      data: { status: 'paid' },
    })

    // Deelnemers + hun route ophalen voor de bevestigingsmail
    const { docs: deelnemers } = await payload.find({
      collection: 'deelnemers',
      where: { registration: { equals: registration.id } },
      depth: 2,
      limit: 50,
    })

    const edition = registration.edition

    const participants = (deelnemers as any[]).map((d) => ({
      name: d.name,
      routeTitle: typeof d.route === 'object' ? d.route.title : '',
      distance: typeof d.route === 'object' ? d.route.distance : 0,
      options: (d.selectedOptions || []).map((o: any) => ({
        label: typeof o.option === 'object' ? o.option.label : '',
        price: o.priceAtRegistration,
      })),
    }))

    let setPasswordURL: string | undefined

    if (registration.newAccountCreated) {
      const { token } = await payload.forgotPassword({
        collection: 'klanten',
        data: { email: registration.contactEmail },
        disableEmail: true,
      })
      setPasswordURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/account/wachtwoord-instellen/${token}`
    }

    const html = registrationConfirmationEmail({
      contactName: registration.contactName,
      editionTitle: typeof edition === 'object' ? edition.title : '',
      totalAmount: registration.totalAmount,
      participants,
      setPasswordURL,
    })

    await payload.sendEmail({
      to: registration.contactEmail,
      subject: 'Bevestiging van je inschrijving',
      html,
    })

    await payload.update({
      collection: 'inschrijvingen',
      id: registration.id,
      data: { confirmationEmailSent: true },
    })

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Mollie webhook fout:', error)
    // Altijd 200 teruggeven, anders blijft Mollie de webhook herhalen
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
