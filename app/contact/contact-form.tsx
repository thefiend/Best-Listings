'use client'

import { useActionState } from 'react'
import { submitContact, ContactState } from './actions'

const SUBJECTS = [
  'Featured Listing Enquiry',
  'Advertising',
  'Content Correction',
  'General Inquiry',
  'Other',
]

const initialState: ContactState = { status: 'idle', message: '' }

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState)

  if (state.status === 'success') {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 p-6 text-center">
        <p className="text-green-800 font-medium text-lg mb-1">Message sent!</p>
        <p className="text-green-700 text-sm">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-5">
      {state.status === 'error' && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
          {state.message}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          required
          defaultValue=""
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        >
          <option value="" disabled>Select a subject</option>
          {SUBJECTS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
          placeholder="Tell us how we can help..."
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto px-8 py-3 rounded-lg bg-brand-navy text-white font-semibold text-sm hover:bg-brand-blue transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
