import { emailLayout } from './layout'

type Participant = {
  name: string
  routeTitle: string
  distance: number
  options: { label: string; price: number }[]
}

type RegistrationConfirmationArgs = {
  contactName: string
  editionTitle: string
  totalAmount: number
  participants: Participant[]
  setPasswordURL?: string
}

export function registrationConfirmationEmail({
  contactName,
  editionTitle,
  totalAmount,
  participants,
  setPasswordURL,
}: RegistrationConfirmationArgs): string {
  const participantsHTML = participants
    .map((p) => {
      const optionsHTML = p.options.length
        ? `<div style="color:#6B6B6B; font-size:12px; margin-top:2px;">
             ${p.options.map((o) => `${o.label} (+€${o.price.toFixed(2)})`).join(', ')}
           </div>`
        : ''

      return `
        <div style="padding:10px 0; border-bottom:1px dashed #E6E0D8;">
          <strong style="color:#4A4A4A;">${p.name}</strong>
          <div style="color:#6B6B6B; font-size:13px;">${p.distance} km — ${p.routeTitle}</div>
          ${optionsHTML}
        </div>
      `
    })
    .join('')

  const setPasswordHTML = setPasswordURL
    ? `
      <div style="margin-top:24px; padding:16px; background-color:#FFF8F2; border-radius:12px;">
        <p style="color:#4A4A4A; font-size:14px; margin:0 0 12px;">
          We hebben voor je e-mailadres een account aangemaakt. Stel je wachtwoord in om je inschrijvingen terug te kunnen zien:
        </p>
        <a href="${setPasswordURL}" style="display:inline-block; padding:10px 20px; background-color:#2B9AC8; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:bold; font-size:13px;">
          Wachtwoord instellen
        </a>
      </div>
    `
    : ''

  const bodyHTML = `
    <h1 style="color:#E6007E; font-size:22px; margin:0 0 8px;">Bedankt voor je inschrijving!</h1>
    <p style="color:#4A4A4A; font-size:14px; line-height:1.5;">
      Hoi ${contactName},<br /><br />
      Je inschrijving voor de ${editionTitle} is bevestigd. Hieronder vind je een overzicht.
    </p>
    <div style="margin-top:16px;">${participantsHTML}</div>
    <p style="color:#4A4A4A; font-size:14px; margin-top:16px;">
      <strong>Totaal betaald: €${totalAmount.toFixed(2)}</strong>
    </p>
    ${setPasswordHTML}
    <p style="color:#6B6B6B; font-size:12px; margin-top:24px;">
      Tot snel bij de Avond4daagse Drunen!
    </p>
  `

  return emailLayout({
    previewText: `Je inschrijving voor ${editionTitle} is bevestigd`,
    bodyHTML,
  })
}
