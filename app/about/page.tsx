import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About BestThingReview',
  description: 'BestThingReview is a Singapore review platform. Learn about our methodology, how we work with commercial partners, and the team behind our rankings.',
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
      <p className="text-gray-500 text-sm mb-8">Ranked guides for Singapore consumers</p>

      <section className="prose prose-gray max-w-none">
        <h2>Who We Are</h2>
        <p>
          BestThingReview is a review platform focused on helping Singapore consumers and businesses
          find the best service providers, contractors, and professionals. We publish ranked guides
          across business services, renovation, legal, financial, healthcare, and home categories.
        </p>
        <p>
          The site is run by <strong>Jason Kam</strong>, Lead Service Reviewer, with editorial support
          from a small research team.
        </p>

        <h2>Our Methodology</h2>
        <p>
          Every ranking on BestThingReview follows a consistent evaluation process:
        </p>
        <ol>
          <li><strong>Provider identification</strong>: we compile a longlist of 30–50 providers per category from Google Maps, government registries (ACRA, MOM, MOH), and industry directories.</li>
          <li><strong>Google review analysis</strong>: we analyse rating, review volume, and review recency. Minimum review thresholds vary by category and are stated in each guide.</li>
          <li><strong>Website review</strong>: we check each provider&apos;s website for published pricing, service range, and credentials.</li>
          <li><strong>Regulatory standing</strong>: where a licence or accreditation applies, we check it against the relevant authority (ACRA, MOM, SBA, LTA, etc.).</li>
          <li><strong>Scoring</strong>: providers are scored on a 10-point scale across criteria specific to each category. Scoring criteria are published on each review page.</li>
        </ol>
        <p>
          We update rankings when we identify material changes to a provider&apos;s rating, regulatory
          standing, or service quality. Publication and update dates are shown on every article.
        </p>

        <h2>Commercial Partners</h2>
        <p>
          BestThingReview earns revenue from commercial partners: businesses that pay for featured
          placement in our guides. <strong>Featured placement can include a higher ranking
          position.</strong> Every guide that includes a partner carries a disclosure note at the top,
          and links to partner websites are marked as sponsored.
        </p>
        <p>
          Ratings and review counts are shown as they appear on Google Maps for every business,
          partners included. We do not accept payment to change factual content or remove competitors.
        </p>
        <p>
          Our deals pages contain affiliate and referral links, which may earn us a commission. These
          are disclosed on each deals page.
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
