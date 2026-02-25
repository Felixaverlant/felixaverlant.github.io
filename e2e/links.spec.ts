import { test, expect } from '@playwright/test'

const PAGES = ['/fr', '/en'] as const
const LANGS = ['fr', 'en'] as const

const SKIP_PREFIXES = ['mailto:', 'tel:', 'javascript:']

function isSkipped (href: string): boolean {
  const trimmed = href.trim()
  if (!trimmed || trimmed === '#') return true
  return SKIP_PREFIXES.some((p) => trimmed.toLowerCase().startsWith(p))
}

function resolveUrl (href: string, baseUrl: string): string {
  const trimmed = href.trim().split('#')[0]
  if (!trimmed) return ''
  try {
    return new URL(trimmed, baseUrl).href
  } catch {
    return ''
  }
}

test.describe('link verification', () => {
  for (const path of PAGES) {
    test(`${path}: every link returns 2xx (no 404 or other error)`, async ({ page, request, baseURL }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' })

      const rawLinks = await page.evaluate(() => {
        const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href]')
        return Array.from(anchors).map((a) => ({
          rawHref: a.getAttribute('href') ?? '',
          absoluteHref: a.href,
          text: a.textContent?.slice(0, 50) ?? '',
        }))
      })

      const base = baseURL ?? 'http://localhost:3000'
      const seen = new Set<string>()
      const toCheck: { url: string; label: string }[] = []

      for (const { rawHref, absoluteHref, text } of rawLinks) {
        if (isSkipped(rawHref)) continue
        const url = absoluteHref || resolveUrl(rawHref, base)
        if (!url || seen.has(url)) continue
        seen.add(url)
        toCheck.push({ url, label: text || url })
      }

      for (const { url, label } of toCheck) {
        const response = await request.get(url, { timeout: 15_000 })
        expect(
          response.ok(),
          `Link "${label}" -> ${url} returned ${response.status()} ${response.statusText()}`
        ).toBe(true)
      }
    })
  }

  for (const lang of LANGS) {
    test(`resume (${lang}): returns 200 and serves PDF`, async ({ request, baseURL }) => {
      const base = baseURL ?? 'http://localhost:3000'
      const resumeUrl = `${base.replace(/\/$/, '')}/resume-${lang}.pdf`
      const response = await request.get(resumeUrl, { timeout: 15_000 })

      expect(response.status(), `Resume ${resumeUrl} should return 200`).toBe(200)
      const contentType = response.headers()['content-type'] ?? ''
      expect(
        contentType.toLowerCase().includes('pdf'),
        `Resume should be a PDF file, got Content-Type: ${contentType}`
      ).toBe(true)
    })
  }
})
