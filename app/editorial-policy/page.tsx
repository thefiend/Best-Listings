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
      <p className="text-gray-500 text-sm mb-8">Last updated: October 2026</p>

      <section className="prose prose-gray max-w-none">
        <h2>Our Mission</h2>
        <p>
          BestThingReview publishes ranked guides to help Singapore consumers identify
          the best service providers in competitive, hard-to-evaluate categories such as renovation, legal,
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
          <li>Providers publish enough information (pricing, services, credentials) to compare them meaningfully</li>
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
          <li><strong>Google review rating</strong>: aggregate rating on Google Maps</li>
          <li><strong>Review volume</strong>: total number of Google reviews. Minimum thresholds vary by category and are stated in each guide.</li>
          <li><strong>Review recency</strong>: proportion of reviews within the last 12 months</li>
          <li><strong>Regulatory standing</strong>: registration or licensing with the relevant authority, where one applies</li>
          <li><strong>Pricing transparency</strong>: whether pricing and process are published or provided on request</li>
          <li><strong>Service breadth</strong>: range of relevant services or specialisations offered</li>
        </ul>
        <p>
          Scores and rankings are editorial judgements built from these criteria. Rank order does not
          strictly follow the score, and commercial partners may be placed higher (see Commercial
          Relationships below).
        </p>

        <h2>Research Process</h2>
        <ol>
          <li><strong>Longlist compilation</strong>: 30–50 providers per category identified from Google Maps, ACRA/MOM/MOH registries, and industry directories.</li>
          <li><strong>Data collection</strong>: Google Maps rating and review data captured at time of evaluation. Regulatory registration checked against official public registries where one applies.</li>
          <li><strong>Website review</strong>: provider websites checked for published pricing, service range, and credentials.</li>
          <li><strong>Scoring and ranking</strong>: providers scored against category-specific criteria. Top 10 are selected for publication.</li>
          <li><strong>Publication and update</strong>: articles are published with date of evaluation. Material changes (rating shifts, regulatory changes, closures) trigger a review and update cycle.</li>
        </ol>

        <h2>Commercial Relationships</h2>
        <p>
          BestThingReview generates revenue through <strong>commercial partnerships</strong> with some
          of the businesses that appear in our guides. Partners pay for featured placement, which can
          include a higher position in a ranking, an expanded description, and a link to their website.
        </p>
        <p><strong>How we disclose partnerships:</strong></p>
        <ul>
          <li>Every guide that includes a commercial partner shows a disclosure note at the top of the article.</li>
          <li>Links to partner websites are marked <code>rel=&quot;sponsored&quot;</code>.</li>
          <li>Ratings and review counts shown for partners are their real Google Maps figures, the same as for every other business.</li>
        </ul>
        <p>
          If you have questions about a specific commercial relationship, contact us via the{' '}
          <Link href="/contact" className="text-brand-blue hover:underline">contact page</Link>.
        </p>

        <h2>Corrections and Updates</h2>
        <p>
          We aim to keep rankings current. If you identify an error (a factual inaccuracy, outdated
          information, or a provider that has closed or changed materially), please contact us.
          Verified corrections are made within 5 business days with a correction note on the article.
        </p>
        <p>
          No commercial relationship lets a provider change factual content (ratings, review counts,
          prices, licensing) or have competitors removed from a guide.
        </p>

        <h2>Editorial Control</h2>
        <p>
          Our editorial team writes every guide. Partners can buy featured placement, but they do not
          write or approve what we publish about them or about other businesses in the same guide.
        </p>
      </section>
    </div>
  )
}
