#!/usr/bin/env python3
"""
Generate lib/company-data.json with extracted services and highlights
per company, parsed from MDX content.

Run: python3 scripts/generate-company-data.py
"""

import re
import os
import json

CONTENT_DIR = os.path.join(os.path.dirname(__file__), '..', 'content', 'reviews', 'business')
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'lib', 'company-data.json')

# Brand names to exclude from service lists
BRAND_FILTER = {
    'daikin', 'mitsubishi', 'panasonic', 'lg', 'samsung', 'fujitsu', 'hitachi',
    'toshiba', 'sharp', 'carrier', 'york', 'midea', 'mcquay',
}

# Article-slug → category-specific keyword fallback for services
KEYWORD_FALLBACKS: dict[str, list[tuple[str, list[str]]]] = {
    'best-aircon-cleaning-singapore-2026': [
        ('General Servicing',   ['general serv', 'quarterly service', 'routine maintenance']),
        ('Chemical Wash',       ['chemical wash']),
        ('Chemical Overhaul',   ['chemical overhaul', 'full strip']),
        ('Gas Top-Up',          ['gas top-up', 'gas refill', 'refrigerant top']),
        ('Installation',        ['installation', 'new unit install', 'dismantl']),
        ('Repair',              ['repair', 'troubleshoot', 'fault diagnosis', 'capacitor', 'pcb board', 'compressor fault']),
        ('Commercial Systems',  ['commercial system', 'vrv system', 'chilled water', 'retail unit']),
        ('Residential',         ['residential', 'hdb', 'condo', 'landed property', 'home owner']),
    ],
    'best-bhutan-travel-agency-2026': [
        ('Tour Packages',    ['tour package', 'package deal', 'itinerary']),
        ('Visa Assistance',  ['visa', 'tourist permit', 'permit processing']),
        ('Hotel Booking',    ['hotel', 'accommodation', 'lodge', 'farmhouse stay']),
        ('Airport Transfers',['airport transfer', 'paro airport', 'pickup']),
        ('Cultural Tours',   ['cultural', 'monastery', 'dzong', 'festival', 'temple', 'heritage']),
        ('Trekking',         ['trek', 'hike', 'high-altitude', 'walking trail']),
        ('Custom Tours',     ['custom', 'tailor-made', 'bespoke', 'private tour']),
    ],
    'best-chauffeur-service-singapore-2026': [
        ('Airport Transfers', ['airport transfer', 'airport pickup', 'arrival transfer', 'departure transfer']),
        ('Corporate Travel',  ['corporate', 'executive', 'roadshow', 'business travel']),
        ('Wedding Cars',      ['wedding', 'bridal', 'solemnisation', 'rom']),
        ('Hourly Hire',       ['hourly', 'by the hour', 'disposal service']),
        ('Long Distance',     ['malaysia', 'johor', 'jb', 'long distance', 'cross-border']),
        ('Maxi Cab',          ['maxi cab', 'maxicab', '7-seater', '13-seater', 'minibus']),
        ('Limousine',         ['limousine', 'limo', 'mercedes', 'bmw', 'luxury sedan']),
    ],
    'best-home-renovation-singapore-2026': [
        ('Full Renovation',  ['full renovation', 'turnkey', 'whole-house', 'hacking work']),
        ('Interior Design',  ['interior design', 'design concept', 'space planning']),
        ('Carpentry',        ['carpentry', 'wardrobe', 'built-in cabinet', 'custom carpentry']),
        ('Electrical',       ['electrical', 'wiring', 'lighting', 'power point']),
        ('Plumbing',         ['plumbing', 'sanitary', 'waterpoint', 'bathroom work']),
        ('Tiling',           ['tiling', 'floor tile', 'wall tile', 'vinyl flooring']),
        ('False Ceiling',    ['false ceiling', 'gypsum board', 'cornice']),
        ('Painting',         ['painting', 'feature wall', 'colour scheme']),
    ],
    'best-renovation-contractor-singapore-2026': [
        ('Full Renovation',  ['full renovation', 'turnkey', 'whole-house', 'hacking']),
        ('Carpentry',        ['carpentry', 'wardrobe', 'cabinet', 'built-in']),
        ('Tiling',           ['tiling', 'tile work', 'flooring']),
        ('Electrical',       ['electrical', 'wiring', 'lighting']),
        ('Plumbing',         ['plumbing', 'bathroom', 'waterpoint']),
        ('False Ceiling',    ['false ceiling', 'gypsum']),
        ('Painting',         ['painting', 'wall paint']),
        ('Waterproofing',    ['waterproof', 'wet area', 'ponding']),
    ],
    'best-roof-contractors-singapore-2026': [
        ('Roof Repair',       ['roof repair', 'leaking roof', 'patch work', 'monsoon']),
        ('Waterproofing',     ['waterproof', 'membrane', 'liquid waterproof']),
        ('Metal Roofing',     ['metal roof', 'zinc', 'steel deck', 'metal deck']),
        ('Polycarbonate',     ['polycarbonate', 'skylight', 'transparent roof']),
        ('Roof Replacement',  ['roof replacement', 'reroofing', 're-roofing', 'new roof']),
        ('Roof Inspection',   ['inspection', 'assessment', 'roof survey', 'audit']),
        ('Residential',       ['residential', 'landed', 'terrace house', 'semi-detached']),
        ('Commercial',        ['commercial', 'industrial', 'factory', 'warehouse']),
    ],
    'best-seo-agency-singapore-2026': [
        ('SEO',                  ['seo', 'organic ranking', 'organic traffic', 'search engine optimis']),
        ('SEM / Google Ads',     ['sem', 'google ads', 'paid search', 'ppc']),
        ('Content Marketing',    ['content marketing', 'content strategy', 'content velocity']),
        ('Social Media',         ['social media', 'facebook ads', 'instagram']),
        ('Web Design',           ['web design', 'website design', 'web development', 'website build']),
        ('Performance Marketing',['performance marketing', 'digital marketing', 'full-stack digital']),
        ('E-commerce SEO',       ['e-commerce seo', 'ecommerce seo', 'shopify', 'woocommerce']),
    ],
    'best-seo-company-singapore-2026': [
        ('SEO',                  ['seo', 'organic ranking', 'organic traffic', 'search engine optimis']),
        ('SEM / Google Ads',     ['sem', 'google ads', 'paid search', 'ppc']),
        ('Content Marketing',    ['content marketing', 'content strategy']),
        ('Social Media',         ['social media', 'facebook', 'instagram']),
        ('Web Design',           ['web design', 'website design']),
        ('Performance Marketing',['performance marketing', 'digital marketing']),
        ('E-commerce SEO',       ['e-commerce', 'ecommerce', 'shopify', 'woocommerce']),
    ],
}

# Highlight extraction patterns: (regex, label_or_callable)
HIGHLIGHT_PATTERNS: list[tuple[str, object]] = [
    (r'psg[\s\-](?:pre-?approved|approved|eligible|grant)',
        'PSG Pre-Approved'),
    (r'google premier partner(?:\s+since\s+(\d{4}))?',
        lambda m: f"Google Premier Partner{' since ' + m.group(1) if m.group(1) else ''}"),
    (r'(\d{1,2})\+?\s+(?:in-?house\s+)?specialists?',
        lambda m: f"{m.group(1)}+ In-House Specialists"),
    (r'(\d{1,2})\+?\s+years?\s+(?:of\s+)?(?:experience|track record|operation)',
        lambda m: f"{m.group(1)}+ Years Experience"),
    (r'(\d)[- ]year[- ](?:warranty|guarantee)',
        lambda m: f"{m.group(1)}-Year {'Warranty' if 'warrant' in m.group(0).lower() else 'Guarantee'}"),
    (r'same[- ]day(?:\s+(?:response|service|appointment|booking))?',
        'Same-Day Response'),
    (r'no hidden fee',     'No Hidden Fees'),
    (r'24[\/\s\-]?7',      '24/7 Availability'),
    (r'workmanship guarantee', 'Workmanship Guarantee'),
    (r'(?:transparent|clear|itemis)(?:ed)? (?:pric|quot)',
        'Transparent Pricing'),
    (r'dedicated account manager',  'Dedicated Account Manager'),
    (r'published case stud',        'Published Case Studies'),
    (r'nea[- ]licen',               'NEA Licensed'),
    (r'bca[- ](?:approved|certif|registered)', 'BCA Approved'),
    (r'chas[- ](?:approved|certif)', 'CaseTrust/CHAS Approved'),
    (r'iso[- ](?:9001|certified)',   'ISO Certified'),
    (r'won the\b|award[- ]win',      'Award-Winning'),
    (r'price match',                 'Price Match Guarantee'),
    (r'free (?:site\s+)?(?:inspection|survey|consult|assessment|quote)',
        'Free Inspection / Quote'),
]


def slugify(s: str) -> str:
    return re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', s.lower()))


# Industry/client verticals to exclude from service lists
INDUSTRY_FILTER = {
    'retail', 'finance', 'hospitality', 'healthcare', 'f&b', 'education',
    'professional services', 'e-commerce', 'financial advisory', 'manufacturing',
    'b2b', 'b2c', 'smes', 'startups', 'enterprise', 'businesses',
}


def extract_service_lists(text: str) -> list[str]:
    """Extract explicit comma-separated service lists from prose."""
    services: list[str] = []
    lower = text.lower()

    # Only trigger on verbs that introduce service lists, not client industry lists
    trigger_patterns = [
        r'(?:covering|handles?|include[sd]?|offer(?:ing|s)?|provide[sd]?|ranging from)\s+((?:[\w\(\)\s\-\/]+,\s*){1,}(?:and\s+)?[\w\(\)\s\-\/]+)(?:\s+for|\s+from|\s+includ|\.|,\s+each)',
    ]
    for p in trigger_patterns:
        for m in re.finditer(p, lower):
            raw = m.group(1)
            items = re.split(r',\s*(?:and\s+)?', raw)
            for item in items:
                item = item.strip().rstrip('.')
                words = item.split()
                if (3 < len(item) < 50
                        and item.lower() not in BRAND_FILTER
                        and item.lower() not in INDUSTRY_FILTER
                        and not all(w in BRAND_FILTER for w in words)
                        and len(words) <= 5):
                    services.append(item.title() if item.islower() else item)

    # Deduplicate preserving order, cap at 6
    seen: set[str] = set()
    result: list[str] = []
    for s in services:
        key = s.lower()
        if key not in seen:
            seen.add(key)
            result.append(s)
    return result[:6]


def extract_highlights(text: str) -> list[str]:
    highlights: list[str] = []
    for pat, label in HIGHLIGHT_PATTERNS:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            highlights.append(label(m) if callable(label) else label)
    return highlights


def keyword_fallback_services(article_slug: str, text: str) -> list[str]:
    lower = text.lower()
    candidates = KEYWORD_FALLBACKS.get(article_slug, [])
    found = [label for label, kws in candidates if any(kw in lower for kw in kws)]
    return found[:6]


def parse_companies(filepath: str) -> list[dict]:
    article_slug = os.path.basename(filepath).replace('.mdx', '')
    with open(filepath) as f:
        content = f.read()

    # Get frontmatter title
    title_m = re.search(r'^title:\s*"([^"]+)"', content, re.MULTILINE)
    article_title = title_m.group(1) if title_m else article_slug

    sections = re.split(r'(?=<a id="business-\d+"></a>)', content)
    companies = []

    for section in sections:
        if '<a id="business-' not in section:
            continue

        name_m = re.search(r'^### (\d+)\. ([^,\n]+),\s*(.+)', section, re.MULTILINE)
        if not name_m:
            continue

        rank = int(name_m.group(1))
        name = name_m.group(2).strip()
        label = name_m.group(3).strip()

        desc_m = re.search(r'### \d+\. [^\n]+\n+([\s\S]+?)\n+📍', section)
        if not desc_m:
            continue
        description = desc_m.group(1).strip().replace('\n', ' ')

        # Extract services: try explicit list extraction first, fallback to keywords
        services = extract_service_lists(description)
        if len(services) < 2:
            services = keyword_fallback_services(article_slug, description)

        # Extract highlights from description
        desc_highlights = extract_highlights(description)

        companies.append({
            'slug': slugify(name),
            'name': name,
            'rank': rank,
            'label': label,
            'articleSlug': article_slug,
            'services': services,
            'descriptionHighlights': desc_highlights,
        })

    return companies


def main():
    all_companies: dict[str, dict] = {}
    seen_slugs: set[str] = set()

    for filename in sorted(os.listdir(CONTENT_DIR)):
        if not filename.endswith('.mdx'):
            continue
        filepath = os.path.join(CONTENT_DIR, filename)
        companies = parse_companies(filepath)
        for c in companies:
            if c['slug'] not in seen_slugs:
                seen_slugs.add(c['slug'])
                all_companies[c['slug']] = {
                    'services': c['services'],
                    'highlights': c['descriptionHighlights'],
                }

    with open(OUTPUT_PATH, 'w') as f:
        json.dump(all_companies, f, indent=2)

    print(f"Generated {OUTPUT_PATH}")
    print(f"Total companies: {len(all_companies)}")

    # Print sample for verification
    sample_slugs = ['sjr-aircon', '338-aircon-singapore', 'best-web-design-singapore',
                    'j-k-roof-contractors', 'bhutan-best-travel-tour', 'elite-lux-limousine']
    for slug in sample_slugs:
        if slug in all_companies:
            d = all_companies[slug]
            print(f"\n  {slug}")
            print(f"    services:   {d['services']}")
            print(f"    highlights: {d['highlights']}")


if __name__ == '__main__':
    main()
