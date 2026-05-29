export type TocHeading = { id: string; text: string; level: 2 | 3 }

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function extractHeadings(content: string): TocHeading[] {
  const regex = /^(#{2,3})\s+(.+)$/gm
  const headings: TocHeading[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3
    const text = match[2].replace(/\*\*(.+?)\*\*/g, '$1').trim()
    const id = slugify(text)
    headings.push({ id, text, level })
  }

  return headings
}
