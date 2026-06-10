import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'BestThingReview privacy policy — how we collect, use, and protect your personal data under the Singapore Personal Data Protection Act (PDPA).',
  alternates: { canonical: 'https://www.bestthingreview.com/privacy' },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-blue">Home</Link>
        <span>/</span>
        <span className="text-gray-600">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-brand-navy mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: June 2026</p>

      <section className="prose prose-gray max-w-none">
        <p>
          BestThingReview (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your personal data in
          accordance with the Singapore Personal Data Protection Act 2012 (PDPA) and applicable
          data protection laws.
        </p>

        <h2>1. Data We Collect</h2>
        <p>We collect the following categories of personal data:</p>
        <ul>
          <li><strong>Contact form submissions</strong> — name, email address, and message content when you use our contact form.</li>
          <li><strong>Analytics data</strong> — anonymised usage data including pages visited, time on site, device type, and approximate geographic location, collected via Google Analytics 4 (GA4). This data does not identify individual users.</li>
          <li><strong>Technical data</strong> — IP address, browser type, and referral source collected automatically by our hosting provider (Vercel) as part of standard server operation. This data is retained for up to 30 days for security purposes.</li>
        </ul>

        <h2>2. How We Use Your Data</h2>
        <ul>
          <li>To respond to contact form enquiries</li>
          <li>To understand how visitors use our site and improve content quality</li>
          <li>To maintain site security and prevent abuse</li>
        </ul>
        <p>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>

        <h2>3. Third-Party Services</h2>
        <p>We use the following third-party services that may process your data:</p>
        <ul>
          <li><strong>Google Analytics 4</strong> — web analytics. Data is processed in accordance with Google&apos;s privacy policy. IP addresses are anonymised. You can opt out via <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">Google&apos;s opt-out browser add-on</a>.</li>
          <li><strong>Vercel</strong> — hosting and content delivery. Processes request logs as a data processor. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">Vercel&apos;s privacy policy</a>.</li>
        </ul>

        <h2>4. Data Retention</h2>
        <ul>
          <li>Contact form data: retained for up to 12 months, or until the enquiry is resolved.</li>
          <li>Analytics data: retained for 14 months per Google Analytics default settings.</li>
          <li>Server logs: retained for up to 30 days.</li>
        </ul>

        <h2>5. Your Rights</h2>
        <p>Under the PDPA, you have the right to:</p>
        <ul>
          <li>Access personal data we hold about you</li>
          <li>Correct inaccurate personal data</li>
          <li>Withdraw consent for data processing where consent is the legal basis</li>
        </ul>
        <p>
          To exercise these rights, contact us via our{' '}
          <Link href="/contact" className="text-brand-blue hover:underline">contact page</Link>.
          We will respond within 30 days.
        </p>

        <h2>6. Cookies</h2>
        <p>
          We use cookies for analytics purposes (Google Analytics). No marketing or tracking cookies
          are set. You can control cookies through your browser settings.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this policy periodically. Material changes will be noted with an updated
          &quot;Last updated&quot; date at the top of this page.
        </p>

        <h2>8. Contact</h2>
        <p>
          For privacy-related enquiries, use our{' '}
          <Link href="/contact" className="text-brand-blue hover:underline">contact page</Link>.
        </p>
      </section>
    </div>
  )
}
