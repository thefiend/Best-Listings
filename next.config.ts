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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
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
      "best-audit-firms-singapore",
      "best-chauffeur-service-singapore",
      "best-commercial-cleaning-singapore",
      "best-corporate-lawyers-singapore",
      "best-divorce-lawyers-singapore",
      "best-home-renovation-singapore",
      "best-insurance-agencies-singapore",
      "best-maid-agencies-singapore",
      "best-mortgage-brokers-singapore",
      "best-moving-companies-singapore",
      "best-pest-control-singapore",
      "best-plastic-surgeons-singapore",
      "best-property-agents-singapore",
      "best-renovation-contractor-singapore",
      "best-roof-contractors-singapore",
      "best-security-systems-singapore",
      "best-seo-agency-singapore",
      "best-seo-company-singapore",
      "best-solar-companies-singapore",
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
      // Tech slug cleanup
      {
        source: "/tech/best-laptops-2024",
        destination: "/tech/best-laptops",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
