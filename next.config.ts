import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://news.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
              "frame-ancestors 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  async redirects() {
    // 301 redirects: year-slug URLs → clean URLs
    const businessSlugs = [
      "best-accounting-firms-singapore",
      "best-aesthetic-clinics-singapore",
      "best-aircon-cleaning-singapore",
      "best-aircon-servicing-singapore",
      "best-airport-transfer-singapore",
      "best-audit-firms-singapore",
      "best-bak-kut-teh-singapore",
      "best-bakeries-singapore",
      "best-bhutan-travel-agencies-singapore",
      "best-breakfast-singapore",
      "best-brunch-cafes-singapore",
      "best-bubble-tea-singapore",
      "best-car-workshops-singapore",
      "best-catering-services-singapore",
      "best-chauffeur-service-singapore",
      "best-chicken-rice-singapore",
      "best-childcare-singapore",
      "best-chiropractor-singapore",
      "best-coffee-shops-singapore",
      "best-commercial-cleaning-singapore",
      "best-cooking-classes-singapore",
      "best-corporate-lawyers-singapore",
      "best-corporate-limousine-singapore",
      "best-dentists-singapore",
      "best-dermatologist-singapore",
      "best-digital-marketing-agencies-singapore",
      "best-dim-sum-singapore",
      "best-divorce-lawyers-singapore",
      "best-dog-groomers-singapore",
      "best-electricians-singapore",
      "best-english-tuition-singapore",
      "best-eye-specialist-singapore",
      "best-florists-singapore",
      "best-food-in-katong",
      "best-gp-clinic-singapore",
      "best-gyms-singapore",
      "best-hair-salons-singapore",
      "best-halal-restaurants-singapore",
      "best-hawker-food-singapore",
      "best-home-cleaning-services-singapore",
      "best-home-renovation-singapore",
      "best-insurance-agencies-singapore",
      "best-interior-design-companies-singapore",
      "best-italian-restaurant-singapore",
      "best-korean-bbq-singapore",
      "best-limo-rental-singapore",
      "best-limousine-service-singapore",
      "best-luxury-airport-transfer-singapore",
      "best-luxury-car-hire-singapore",
      "best-luxury-hotels-singapore",
      "best-maid-agencies-singapore",
      "best-massage-spa-singapore",
      "best-math-tuition-singapore",
      "best-metal-roof-canopy-singapore",
      "best-monthly-chauffeur-service-singapore",
      "best-mortgage-brokers-singapore",
      "best-moving-companies-singapore",
      "best-nail-salons-singapore",
      "best-nature-based-preschools-singapore",
      "best-orthodontist-singapore",
      "best-personal-trainers-singapore",
      "best-pest-control-singapore",
      "best-photography-studios-singapore",
      "best-physiotherapists-singapore",
      "best-pizza-singapore",
      "best-plastic-surgeons-singapore",
      "best-plumbers-singapore",
      "best-prata-singapore",
      "best-premium-limousine-singapore",
      "best-primary-school-tuition-singapore",
      "best-private-chauffeur-singapore",
      "best-preschools-singapore",
      "best-property-agents-singapore",
      "best-ramen-singapore",
      "best-renovation-contractor-singapore",
      "best-roof-contractors-singapore",
      "best-roof-leak-repair-singapore",
      "best-roof-waterproofing-singapore",
      "best-science-tuition-singapore",
      "best-seafood-restaurants-singapore",
      "best-secondary-school-tuition-singapore",
      "best-security-systems-singapore",
      "best-seo-agency-singapore",
      "best-seo-company-singapore",
      "best-solar-companies-singapore",
      "best-sushi-singapore",
      "best-swimming-lessons-singapore",
      "best-tcm-singapore",
      "best-thai-food-singapore",
      "best-tuition-centres-singapore",
      "best-vegetarian-restaurants-singapore",
      "best-web-design-companies-singapore",
      "best-website-development-companies-singapore",
      "best-wedding-car-rental-singapore",
      "best-yoga-studios-singapore",
      "best-zi-char-singapore",
      // SJR Air-Conditioned aircon articles — August 2026
      "best-aircon-installation-singapore",
      "best-daikin-aircon-repair-singapore",
      "best-mitsubishi-aircon-repair-singapore",
      "best-emergency-aircon-repair-singapore",
      "best-commercial-aircon-services-singapore",
      "best-industrial-hvac-singapore",
      "best-aircon-gas-top-up-singapore",
      "best-aircon-compressor-repair-singapore",
      "best-aircon-water-leaking-repair-singapore",
      "best-aircon-maintenance-contracts-singapore",
      // New articles — August 2026 batch
      "best-lasik-clinics-singapore",
      "best-fertility-clinics-singapore",
      "best-slimming-centres-singapore",
      "best-eyebrow-embroidery-singapore",
      "best-wedding-photographers-singapore",
      "best-travel-agency-singapore",
      "best-event-venues-singapore",
      "best-yacht-charters-singapore",
      "best-painting-contractors-singapore",
      "best-flooring-contractors-singapore",
      "best-cafes-singapore",
      "best-japanese-restaurants-singapore",
      "best-staycation-singapore",
      "best-bars-singapore",
      "best-facial-singapore",
      "best-psychologist-singapore",
      "best-paediatrician-singapore",
      "best-eyelash-extension-singapore",
      "best-pet-hotel-singapore",
      "best-self-storage-singapore",
      "best-window-grille-contractors-singapore",
      "best-confinement-nanny-agency-singapore",
      "best-car-rental-singapore",
      "best-financial-advisors-singapore",
      "best-coworking-spaces-singapore",
      "best-company-secretary-singapore",
      "best-music-schools-singapore",
      "best-immigration-consultants-singapore",
      "best-business-coaches-singapore",
      "best-cardiologist-singapore",
      "best-hotpot-singapore",
      "best-omakase-singapore",
      "best-nightclubs-singapore",
      "best-car-detailing-singapore",
      "best-steakhouse-singapore",
      "best-language-classes-singapore",
      "best-buffet-singapore",
      "best-rooftop-bars-singapore",
      "best-funeral-services-singapore",
      // SinHao contractor articles — August 2026
      "best-composite-timber-decking-singapore",
      "best-stainless-steel-fabrication-singapore",
      "best-aluminium-fabrication-singapore",
      "best-balcony-canopy-contractors-singapore",
      "best-polycarbonate-awning-singapore",
      "best-mcst-contractors-singapore",
      "best-frosted-glass-singapore",
      "best-tempered-glass-contractors-singapore",
      "best-parquet-flooring-singapore",
      "best-aa-works-contractors-singapore",
      // Therapist and counsellors — August 2026
      "best-therapist-singapore",
      // Health screening — August 2026
      "best-health-screening-singapore",
      // Orthopaedic surgeon — August 2026
      "best-orthopaedic-surgeon-singapore",
      // Teeth whitening — August 2026
      "best-teeth-whitening-singapore",
      // Skin clinic — August 2026
      "best-skin-clinic-singapore",
      // Dental implant — August 2026
      "best-dental-implant-singapore",
      // ENT specialist — August 2026
      "best-ent-specialist-singapore",
      // Indian restaurant — August 2026
      "best-indian-restaurant-singapore",
      // Nasi lemak — August 2026
      "best-nasi-lemak-singapore",
      // Satay — August 2026
      "best-satay-singapore",
      // Fine dining — August 2026
      "best-fine-dining-singapore",
      // Wonton mee — August 2026
      "best-wonton-mee-singapore",
      // Laksa — August 2026
      "best-laksa-singapore",
      // Burger — August 2026
      "best-burger-singapore",
      // Food/dining articles — August 2026 batch
      "best-chinese-restaurant-singapore",
      "best-char-kway-teow-singapore",
      // Hair transplant — August 2026
      "best-hair-transplant-singapore",
      // Gynaecologist — August 2026
      "best-gynaecologist-singapore",
      // Hair loss treatment — August 2026
      "best-hair-loss-treatment-singapore",
    ];

    const businessRedirects = businessSlugs.map((slug) => ({
      source: `/business/${slug}-2026`,
      destination: `/business/${slug}`,
      permanent: true,
    }));

    return [
      ...businessRedirects,
      // Bhutan travel moved from business to travel category
      {
        source: "/business/best-bhutan-travel-agency-2026",
        destination: "/travel/best-bhutan-travel-agency",
        permanent: true,
      },
      {
        source: "/travel/best-budget-bhutan-tour-packages-2026",
        destination: "/travel/best-budget-bhutan-tour-packages",
        permanent: true,
      },
      // Preschool location pages (filename suffix differs from slug)
      {
        source: "/business/best-preschools-bukit-timah-2026",
        destination: "/business/best-preschools-bukit-timah-singapore",
        permanent: true,
      },
      {
        source: "/business/best-preschools-katong-2026",
        destination: "/business/best-preschools-katong-singapore",
        permanent: true,
      },
      // Tech slug cleanup
      {
        source: "/tech/best-laptops-2024",
        destination: "/tech/best-laptops",
        permanent: true,
      },
      // Travel articles (year-suffixed redirect)
      {
        source: "/travel/best-private-car-singapore-johor-bahru-2026",
        destination: "/travel/best-private-car-singapore-johor-bahru",
        permanent: true,
      },
      {
        source: "/travel/best-hourly-chauffeur-singapore-2026",
        destination: "/travel/best-hourly-chauffeur-singapore",
        permanent: true,
      },
      {
        source: "/travel/best-private-city-tour-car-singapore-2026",
        destination: "/travel/best-private-city-tour-car-singapore",
        permanent: true,
      },
      {
        source: "/travel/best-bhutan-luxury-tours-2026",
        destination: "/travel/best-bhutan-luxury-tours",
        permanent: true,
      },
      // Bhutan travel articles — August 2026 batch
      {
        source: "/travel/best-bhutan-7-day-itinerary-packages-2026",
        destination: "/travel/best-bhutan-7-day-itinerary-packages",
        permanent: true,
      },
      {
        source: "/travel/best-bhutan-family-tour-packages-2026",
        destination: "/travel/best-bhutan-family-tour-packages",
        permanent: true,
      },
      {
        source: "/travel/best-bhutan-festival-tours-2026",
        destination: "/travel/best-bhutan-festival-tours",
        permanent: true,
      },
      {
        source: "/travel/best-bhutan-honeymoon-packages-2026",
        destination: "/travel/best-bhutan-honeymoon-packages",
        permanent: true,
      },
      {
        source: "/travel/best-bhutan-hotels-resorts-2026",
        destination: "/travel/best-bhutan-hotels-resorts",
        permanent: true,
      },
      {
        source: "/travel/best-bhutan-nepal-tour-packages-2026",
        destination: "/travel/best-bhutan-nepal-tour-packages",
        permanent: true,
      },
      {
        source: "/travel/best-bhutan-tour-packages-singapore-2026",
        destination: "/travel/best-bhutan-tour-packages-singapore",
        permanent: true,
      },
      {
        source: "/travel/best-bhutan-trekking-packages-2026",
        destination: "/travel/best-bhutan-trekking-packages",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
