// components/feature-cta.tsx
interface FeatureCtaProps {
  heading?: string
  subtext?: string
  buttonText?: string
  href?: string
}

export function FeatureCta({
  heading = 'Want to be featured?',
  subtext = 'Get your business listed as a top pick and reach thousands of Singapore customers actively searching for your services.',
  buttonText = 'Contact Us Now',
  href = '/contact',
}: FeatureCtaProps) {
  return (
    <div className="not-prose my-8 rounded-xl bg-gradient-to-br from-brand-navy to-brand-blue p-6 md:p-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{heading}</h3>
          <p className="text-blue-100 text-sm md:text-base max-w-xl">{subtext}</p>
        </div>
        <a
          href={href}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-brand-gold px-6 py-3 text-sm font-bold text-brand-navy hover:brightness-110 transition-all flex-shrink-0"
        >
          {buttonText}
        </a>
      </div>
    </div>
  )
}
