import type { EmailAdapter, SendEmailOptions } from 'payload'

type GraphAdapterArgs = {
  tenantId: string
  clientId: string
  clientSecret: string
  senderEmail: string
  defaultFromName: string
}

let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken({ tenantId, clientId, clientSecret }: GraphAdapterArgs) {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value
  }

  const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Microsoft Graph token-aanvraag mislukt: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  return cachedToken.value
}

function toRecipientList(value?: string | string[]) {
  if (!value) return []
  const list = Array.isArray(value) ? value : [value]
  return list.map((address) => ({ emailAddress: { address } }))
}

// Payload verwacht een FACTORY die de EmailAdapter teruggeeft, zelfde patroon als
// nodemailerAdapter()/resendAdapter(): buiten-functie config, binnen-functie de echte adapter.
export function graphAdapter(args: GraphAdapterArgs) {
  const { senderEmail, defaultFromName } = args

  return (): EmailAdapter => ({
    name: 'microsoft-graph',
    defaultFromAddress: senderEmail,
    defaultFromName,
    sendEmail: async (message: SendEmailOptions) => {
      const token = await getAccessToken(args)

      const payload = {
        message: {
          subject: message.subject,
          body: {
            contentType: message.html ? 'HTML' : 'Text',
            content: message.html ? String(message.html) : String(message.text ?? ''),
          },
          toRecipients: toRecipientList(message.to),
          ccRecipients: toRecipientList(message.cc),
          bccRecipients: toRecipientList(message.bcc),
        },
        saveToSentItems: true,
      }

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderEmail)}/sendMail`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Microsoft Graph e-mail versturen mislukt: ${response.status} ${errorText}`)
      }
    },
  })
}
