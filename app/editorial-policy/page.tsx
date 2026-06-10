import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Editorial Policy & Methodology',
  description: 'How BestThingReview selects, evaluates, and scores Singapore service providers. Our scoring methodology, editorial standards, and commercial relationship disclosure.',
  alternates: { canonical: 'https://www.bestthingreview.com/editorial-policy' },
}

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-blue">Home</Link>
        <span>/</span>
        <span className="text-gray-600">Editorial Policy</span>
      </nav>

      <h1 className="text-3xl font-bold text-brand-navy mb-2">Editorial Policy &amp; Methodology</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: June 2026</p>

      <section className="prose prose-gray max-w-none">
        <h2>Our Mission</h2>
        <p>
          BestThingReview publishes independent ranked guides to help Singapore consumers identify
          the best service providers in competitive, hard-to-evaluate categories — renovation, legal,
          financial, healthcare, and professional services. Our goal is to reduce the information
          asymmetry between service providers and the people hiring them.
        </p>

        <h2>How We Select Categories</h2>
        <p>
          We publish guides in categories where:
        </p>
        <ol>
          <li>The quality gap between providers is significant and consequential to consumers</li>
          <li>Verification data (Google reviews, regulatory registration) is publicly available</li>
          <li>Direct engagement with providers is feasible for meaningful first-hand evaluation</li>
        </ol>
        <p>
          We do not publish guides where we cannot meaningfully differentiate providers or where
          the category lacks sufficient verifiable data.
        </p>

        <h2>Scoring Methodology</h2>
        <p>
          Providers are scored on a 10-point scale. The specific criteria and weightings vary by
          category and are published on each review page under the &quot;How We Ranked&quot; section.
          Common criteria across categories include:
        </p>
        <ul>
          <li><strong>Google review rating</strong> — verified aggregate rating on Google Maps</li>
          <li><strong>Review volume</strong> — total number of verified Google reviews (minimum threshold: 30)</li>
          <li><strong>Review recency</strong> — proportion of reviews within the last 12 months</li>
          <li><strong>Regulatory standing</strong> — verified registration or licensing with the relevant authority</li>
          <li><strong>Response quality</strong> — responsiveness to enquiries, transparency on pricing and process</li>
          <li><strong>Service breadth</strong> — range of relevant services or specialisations offered</li>
        </ul>
        <p>
          Final rankings reflect the composite score. Where two providers have identical scores,
          the provider with higher review volume is ranked higher as a tiebreaker.
        </p>

        <h2>Research Process</h2>
        <ol>
          <li><strong>Longlist compilation</strong> — 30–50 providers per category identified from Google Maps, ACRA/MOM/MOH registries, and industry directories.</li>
          <li><strong>Data collection</strong> — Google Maps rating and review data captured at time of evaluation. Regulatory registration verified via official public registries.</li>
          <li><strong>Direct engagement</strong> — Shortlisted providers are contacted directly by our reviewer to assess responsiveness, pricing transparency, and service quality.</li>
          <li><strong>Scoring and ranking</strong> — Providers scored against category-specific criteria. Top 10 are selected for publication.</li>
          <li><strong>Publication and update</strong> — Articles are published with date of evaluation. Material changes (rating shifts, regulatory changes, closures) trigger a review and update cycle.</li>
        </ol>

        <h2>Commercial Relationships</h2>
        <p>
          BestThingReview generates revenue through <strong>featured listing placements</strong>.
          Featured providers pay for enhanced visibility on relevant ranking pages (e.g., an expanded
          description, a &quot;Featured&quot; badge, or priority placement within the same ranking tier).
        </p>
        <p><strong>What featured placement does and does not affect:</strong></p>
        <ul>
          <li>Featured placement does <strong>not</strong> affect a provider&apos;s rank position. Rank is determined solely by score.</li>
          <li>Featured placement does <strong>not</strong> guarantee inclusion. Providers must meet our minimum threshold (30+ Google reviews, valid regulatory registration) to be considered.</li>
          <li>Featured placement does <strong>not</strong> protect providers from removal. If a provider&apos;s score drops below threshold or regulatory standing is revoked, they are removed regardless of commercial relationship.</li>
        </ul>
        <p>
          Pages containing featured providers are marked with a disclosure note. If you have questions
          about a specific commercial relationship, contact us via the{' '}
          <Link href="/contact" className="text-brand-blue hover:underline">contact page</Link>.
        </p>

        <h2>Corrections and Updates</h2>
        <p>
          We aim to keep rankings current. If you identify an error — factual inaccuracy, outdated
          information, or a provider that has closed or changed materially — please contact us.
          Verified corrections are made within 5 business days with a correction note on the article.
        </p>
        <p>
          Providers may not request removal from rankings, changes to their rank position, or
          modification of factual review content as a condition of any commercial relationship.
        </p>

        <h2>Independence Statement</h2>
        <p>
          Editorial decisions — which providers to include, how they are ranked, and what is written
          about them — are made solely by our editorial team. No advertiser, featured provider, or
          third party has editorial approval rights over our content.
        </p>
      </section>
    </div>
  )
}
