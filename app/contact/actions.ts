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

  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.error('BREVO_API_KEY not set')
    return { status: 'error', message: 'Email service not configured. Please try again later.' }
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name, email },
      to: [{ email: 'jasyscotech@gmail.com', name: 'Best Thing Review' }],
      replyTo: { email, name },
      subject: `[Contact] ${subject}`,
      textContent: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      htmlContent: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
    }),
  })

  if (!res.ok) {
    console.error('Brevo error:', await res.text())
    return { status: 'error', message: 'Failed to send message. Please try again later.' }
  }

  return {
    status: 'success',
    message: "Thanks for reaching out. We'll get back to you within 1–2 business days.",
  }
}
