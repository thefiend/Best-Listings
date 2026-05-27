import { ContactForm } from './contact-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the BestThingReview team for featured listing enquiries, advertising, or general questions.',
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-navy to-brand-blue text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-white/75 text-lg">
            Questions, featured listing enquiries, or just want to say hello?
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Sidebar */}
          <aside className="md:col-span-1 space-y-6">
            <div>
              <p className="text-sm font-semibold text-brand-navy mb-1">Featured Listings</p>
              <p className="text-sm text-gray-600">
                Want your business featured at the top of a category? We work with select partners across Singapore.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-navy mb-1">Response Time</p>
              <p className="text-sm text-gray-600">
                We aim to reply within 1–2 business days.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-navy mb-1">Content Corrections</p>
              <p className="text-sm text-gray-600">
                Spotted an error in one of our reviews? Let us know and we'll investigate promptly.
              </p>
            </div>
          </aside>

          {/* Form */}
          <div className="md:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  )
}
