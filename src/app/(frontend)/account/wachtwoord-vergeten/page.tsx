import { ForgotPasswordForm } from './ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex max-w-sm flex-col items-center gap-8 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Wachtwoord vergeten</h1>
        <p className="mt-2 text-muted-foreground">
          Vul je e-mailadres in en we sturen je een link om een nieuw wachtwoord in te stellen.
        </p>
      </div>

      <ForgotPasswordForm />
    </main>
  )
}
