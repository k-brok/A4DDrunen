import { emailLayout } from './layout'

type ForgotPasswordEmailArgs = {
  name?: string | null
  resetURL: string
}

export function forgotPasswordEmail({ name, resetURL }: ForgotPasswordEmailArgs): string {
  const bodyHTML = `
    <h1 style="color: #E6007E; font-size: 22px; margin: 0 0 8px;">Wachtwoord resetten</h1>
    <p style="color: #4A4A4A; font-size: 14px; line-height: 1.5;">
      Hoi ${name || ''},<br /><br />
      Er is een verzoek gedaan om het wachtwoord van dit account te resetten. Klik op de knop hieronder om een nieuw wachtwoord in te stellen.
    </p>
    <a href="${resetURL}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #E6007E; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
      Wachtwoord instellen
    </a>
    <p style="color: #6B6B6B; font-size: 12px; margin-top: 24px;">
      Heb je dit niet aangevraagd? Dan kun je deze e-mail negeren.
    </p>
  `

  return emailLayout({
    previewText: 'Stel je nieuwe wachtwoord in',
    bodyHTML,
  })
}
