#!/usr/bin/env python3
"""
Fetch Google Places photos for businesses listed in MDX articles.
Downloads top photo per business to public/images/places/{slug}.jpg

Usage:
  python3 scripts/fetch-place-photos.py <mdx-file>
  python3 scripts/fetch-place-photos.py content/reviews/business/best-ramen-singapore-2026.mdx
  python3 scripts/fetch-place-photos.py --all   # process all MDX files
"""

import sys
import os
import re
import json
import time
import argparse
import urllib.request
import urllib.parse
import subprocess
from pathlib import Path

API_KEY = "AIzaSyDIFFGlCCGG4QMX1LlhL8DL3f2i5RPTceU"
OUTPUT_DIR = Path("public/images/places")
MAX_WIDTH = 800


def compress_jpeg(path: Path):
    """Recompress JPEG to max 800px wide, quality 80, using sharp via node."""
    script = (
        f"const sharp=require('sharp');"
        f"sharp({repr(str(path))})"
        f".resize({{width:800,withoutEnlargement:true}})"
        f".jpeg({{quality:80,progressive:true,mozjpeg:true}})"
        f".toFile({repr(str(path)+'.tmp')})"
        f".then(()=>{{require('fs').renameSync({repr(str(path)+'.tmp')},{repr(str(path))})}});"
    )
    subprocess.run(["node", "-e", script], check=True, capture_output=True)

def slugify(name: str) -> str:
    name = name.lower()
    name = re.sub(r"[^a-z0-9]+", "-", name)
    return name.strip("-")

def get_place_photos(place_id: str) -> list:
    url = (
        f"https://maps.googleapis.com/maps/api/place/details/json"
        f"?place_id={place_id}&fields=photos,name&key={API_KEY}"
    )
    with urllib.request.urlopen(url) as resp:
        data = json.loads(resp.read())
    if data.get("status") != "OK":
        return []
    return data.get("result", {}).get("photos", [])

def download_photo(photo_reference: str, output_path: Path, max_width: int = MAX_WIDTH):
    url = (
        f"https://maps.googleapis.com/maps/api/place/photo"
        f"?maxwidth={max_width}&photo_reference={photo_reference}&key={API_KEY}"
    )
    with urllib.request.urlopen(url) as resp:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_bytes(resp.read())

def search_place(query: str) -> dict | None:
    encoded = urllib.parse.quote(query)
    url = (
        f"https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
        f"?input={encoded}&inputtype=textquery&fields=place_id,name,formatted_address&key={API_KEY}"
    )
    with urllib.request.urlopen(url) as resp:
        data = json.loads(resp.read())
    candidates = data.get("candidates", [])
    return candidates[0] if candidates else None

def extract_companies_from_mdx(mdx_path: Path) -> list[dict]:
    """
    Extract company names and place_ids from MDX.
    Looks for CompanyRating components and H3 headings.
    """
    content = mdx_path.read_text()
    companies = []

    # Match CompanyRating: name="..." placeId="..."
    pattern_cr = re.compile(
        r'<CompanyRating[^>]*name=["\']([^"\']+)["\'][^>]*(?:placeId=["\']([^"\']+)["\'])?',
        re.DOTALL
    )
    for m in pattern_cr.finditer(content):
        name = m.group(1)
        place_id = m.group(2) or ""
        companies.append({"name": name, "place_id": place_id})

    # Fallback: extract from PicksList if no CompanyRating found
    if not companies:
        # Extract author name from frontmatter to exclude it
        author_match = re.search(r'author:\s*\n\s*name:\s*["\']([^"\']+)["\']', content)
        author_name = author_match.group(1) if author_match else ""

        pattern_picks = re.compile(r'name:\s*["\']([^"\']+)["\']')
        for m in pattern_picks.finditer(content):
            name = m.group(1)
            if name != author_name:
                companies.append({"name": name, "place_id": ""})

    return companies

def process_mdx(mdx_path: Path, dry_run: bool = False):
    print(f"\n=== {mdx_path.name} ===")
    companies = extract_companies_from_mdx(mdx_path)

    if not companies:
        print("  No companies found.")
        return {}

    # Derive article slug from filename
    article_slug = mdx_path.stem.replace("-2026", "").replace("-2027", "")
    article_dir = OUTPUT_DIR / article_slug

    results = {}

    for company in companies:
        name = company["name"]
        place_id = company.get("place_id", "")
        slug = slugify(name)
        output_path = article_dir / f"{slug}.jpg"

        # Skip if already downloaded
        if output_path.exists():
            print(f"  ✓ {name} (cached)")
            results[name] = str(output_path)
            continue

        print(f"  → {name}", end="", flush=True)

        # Search for place if no place_id
        if not place_id:
            # Read frontmatter for location context
            match = re.search(r"singapore", mdx_path.read_text(), re.IGNORECASE)
            location = "Singapore" if match else ""
            query = f"{name} {location}".strip()

            place = search_place(query)
            if place:
                place_id = place.get("place_id", "")

        if not place_id:
            print(" ✗ no place_id found")
            continue

        # Fetch photos
        photos = get_place_photos(place_id)
        if not photos:
            print(" ✗ no photos")
            continue

        if dry_run:
            print(f" [dry-run] would download to {output_path}")
            results[name] = str(output_path)
            continue

        # Download first photo
        try:
            photo_ref = photos[0]["photo_reference"]
            download_photo(photo_ref, output_path)
            compress_jpeg(output_path)
            print(f" ✓ saved → {output_path}")
            results[name] = str(output_path)
        except Exception as e:
            print(f" ✗ error: {e}")

        time.sleep(0.2)  # Rate limiting

    return results


def inject_images_into_mdx(mdx_path: Path, photo_map: dict):
    """
    Adds <img> tags after each H3 company heading in the MDX if photo exists.
    Only adds if not already present.
    """
    content = mdx_path.read_text()
    article_slug = mdx_path.stem.replace("-2026", "").replace("-2027", "")

    modified = False
    for company_name, photo_path in photo_map.items():
        # Build web path
        web_path = "/" + photo_path.replace("public/", "")

        # Find H3 heading for this company
        # Pattern: ### N. Company Name — tagline
        slug = slugify(company_name)
        heading_pattern = re.compile(
            r'(### \d+\. ' + re.escape(company_name) + r'[^\n]*\n)',
            re.IGNORECASE
        )

        # Check if image already injected
        if web_path in content:
            continue

        def add_image(m):
            nonlocal modified
            modified = True
            return (
                m.group(1) +
                f'\n<img src="{web_path}" alt="{company_name}" '
                f'className="w-full rounded-lg my-4 object-cover" '
                f'style={{{{height: "300px"}}}} />\n'
            )

        content = heading_pattern.sub(add_image, content)

    if modified:
        mdx_path.write_text(content)
        print(f"  → Injected images into {mdx_path.name}")


def main():
    parser = argparse.ArgumentParser(description="Fetch Google Places photos for MDX articles")
    parser.add_argument("files", nargs="*", help="MDX files to process")
    parser.add_argument("--all", action="store_true", help="Process all business MDX files")
    parser.add_argument("--inject", action="store_true", help="Inject <img> tags into MDX after downloading")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be done without downloading")
    args = parser.parse_args()

    if args.all:
        mdx_files = sorted(Path("content/reviews/business").glob("*.mdx"))
    elif args.files:
        mdx_files = [Path(f) for f in args.files]
    else:
        parser.print_help()
        sys.exit(1)

    for mdx_path in mdx_files:
        if not mdx_path.exists():
            print(f"File not found: {mdx_path}")
            continue
        photo_map = process_mdx(mdx_path, dry_run=args.dry_run)
        if args.inject and photo_map and not args.dry_run:
            inject_images_into_mdx(mdx_path, photo_map)

    print("\nDone.")


if __name__ == "__main__":
    main()
