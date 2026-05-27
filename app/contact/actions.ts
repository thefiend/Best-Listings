'use server'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const subject = (formData.get('subject') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()

  if (!name || !email || !subject || !message) {
    return { status: 'error', message: 'All fields are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  // TODO: wire up to email provider (e.g. Resend, SendGrid)
  console.log('Contact form submission:', { name, email, subject, message })

  return {
    status: 'success',
    message: "Thanks for reaching out. We'll get back to you within 1–2 business days.",
  }
}
