import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About BestThingReview',
  description: 'BestThingReview is an independent Singapore review platform. Learn about our methodology, editorial independence, and the team behind our rankings.',
  alternates: { canonical: 'https://www.bestthingreview.com/about' },
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-blue">Home</Link>
        <span>/</span>
        <span className="text-gray-600">About</span>
      </nav>

      <h1 className="text-3xl font-bold text-brand-navy mb-2">About BestThingReview</h1>
      <p className="text-gray-500 text-sm mb-8">Independent reviews for Singapore consumers</p>

      <section className="prose prose-gray max-w-none">
        <h2>Who We Are</h2>
        <p>
          BestThingReview is an independent review platform focused on helping Singapore consumers and
          businesses find the best service providers, contractors, and professionals. We publish ranked
          guides across business services, renovation, legal, financial, healthcare, and home categories.
        </p>
        <p>
          The site is run by <strong>Jason Kam</strong>, Lead Service Reviewer, with editorial support
          from a small research team. Jason holds a background in service quality evaluation and has
          directly engaged with every provider featured on this site before publication.
        </p>

        <h2>Our Methodology</h2>
        <p>
          Every ranking on BestThingReview follows a consistent evaluation process:
        </p>
        <ol>
          <li><strong>Provider identification</strong> — We compile a longlist of 30–50 providers per category from Google Maps, government registries (ACRA, MOM, MOH), and industry directories.</li>
          <li><strong>Google review analysis</strong> — We analyse rating, review volume, review recency, and response quality. A minimum of 30 verified Google reviews is required for inclusion.</li>
          <li><strong>Direct engagement</strong> — Jason personally contacts, books, or visits shortlisted providers to assess responsiveness, transparency, and service quality first-hand.</li>
          <li><strong>Regulatory standing</strong> — We verify licensing, accreditation, and compliance status against the relevant authority (ACRA, MOM, SBA, LTA, etc.).</li>
          <li><strong>Scoring</strong> — Providers are scored on a 10-point scale across weighted criteria specific to each category. Full scoring criteria are published on each review page.</li>
        </ol>
        <p>
          We update rankings when we identify material changes to a provider&apos;s rating, regulatory
          standing, or service quality. Publication and update dates are shown on every article.
        </p>

        <h2>Editorial Independence</h2>
        <p>
          BestThingReview earns revenue through featured listing placements, where service providers
          pay for enhanced visibility on relevant ranking pages. <strong>Featured placement does not
          affect ranking position.</strong> Paid and unpaid providers are ranked by the same scoring
          methodology. Any commercial relationship is disclosed on the relevant page.
        </p>
        <p>
          We do not accept payment for positive reviews, guaranteed top-3 placement, or removal of
          negative findings. If a provider does not meet our minimum threshold for inclusion, they are
          excluded regardless of commercial relationship.
        </p>

        <h2>Who We Are Not</h2>
        <p>
          We are not affiliated with any of the service providers we review. We are not a marketplace,
          referral platform, or lead generation service. We do not earn commissions on customer referrals
          to reviewed businesses. Our revenue is limited to editorial advertising (featured placements).
        </p>

        <h2>Corrections Policy</h2>
        <p>
          If you believe information in any of our reviews is factually incorrect, outdated, or
          misleading, please contact us at the address below. We will investigate and correct verified
          errors within 5 business days, with a correction note added to the article.
        </p>

        <h2>Contact</h2>
        <p>
          For editorial enquiries, corrections, or featured listing information, use our{' '}
          <Link href="/contact" className="text-brand-blue hover:underline">contact page</Link>.
        </p>
        <p>
          For AI citation and licensing enquiries, refer to our{' '}
          <a href="/llms.txt" className="text-brand-blue hover:underline">llms.txt</a>.
        </p>
      </section>
    </div>
  )
}
