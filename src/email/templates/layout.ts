type EmailLayoutArgs = {
  previewText?: string
  bodyHTML: string
}

export function emailLayout({ previewText, bodyHTML }: EmailLayoutArgs): string {
  const logoURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/logo-email.png`

  return `
    <div style="font-family: sans-serif; background-color: #FFF8F2; padding: 32px 0;">
      ${previewText ? `<span style="display:none; font-size:0; color:#FFF8F2;">${previewText}</span>` : ''}
      <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 1px 4px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="${logoURL}" alt="Avond4daagse Drunen" width="120" style="display: inline-block; height: auto; max-width: 120px;" />
        </div>
        ${bodyHTML}
      </div>
      <p style="text-align: center; color: #B8B8B8; font-size: 11px; margin-top: 16px;">
        Avondvierdaagse Drunen &middot; avondvierdaagsedrunen.nl
      </p>
    </div>
  `
}
