#!/usr/bin/env node
// Deterministic resume renderer: parses a bilingual structured Markdown file and
// compiles an ATS-friendly EN + FR PDF each, using moderncv + XeLaTeX.
//
// Usage:
//   node build.mjs [source.md] [outDir] [--lang en|fr|both] [--dry]
// Defaults: source = <this dir>/resume-structured.md, outDir = dirname(source),
//           --lang both. --dry writes the .tex only (no TeX toolchain needed).
//
// See resume-structured.md for the expected input format.

import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))

// ---- Styling knobs (tweak here) -------------------------------------------
const STYLE = 'banking' // single-column moderncv style, ATS-friendlier
const COLOR = 'black' // no color, for maximum ATS compatibility
const MAIN_FONT = 'Arial' // standard, widely-installed, cleanly extractable
const GEOMETRY_SCALE = '0.85'
const LANGS = [
  { code: 'en', idx: 0, summary: 'Summary' },
  { code: 'fr', idx: 1, summary: 'Profil' },
]
const META_KEYS = ['company', 'industry', 'period', 'location', 'institution']

// ---- Small helpers --------------------------------------------------------
function loc (text, idx) {
  if (typeof text !== 'string') return ''
  return text.includes('|||') ? text.split('|||')[idx].trim() : text.trim()
}

// Escape LaTeX-special ASCII. XeLaTeX + fontspec handles Unicode (é, €, —) natively.
function tex (text) {
  return String(text)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
}

// ---- Parser ---------------------------------------------------------------
function parse (raw) {
  const lines = raw.split(/\r?\n/)
  const personal = {}
  const sections = []
  let section = null
  let entry = null
  let i = 0

  // Frontmatter between the first pair of --- fences.
  if (lines[0].trim() === '---') {
    i = 1
    let key = null
    for (; i < lines.length; i++) {
      const line = lines[i]
      if (line.trim() === '---') { i++; break }
      const m = line.match(/^([a-zA-Z_]+):\s?(.*)$/)
      if (m) {
        key = m[1]
        personal[key] = m[2]
      } else if (key && line.trim()) {
        personal[key] += ' ' + line.trim() // folded continuation
      }
    }
  }

  for (; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('<!--') || trimmed.startsWith('-->')) continue

    if (trimmed.startsWith('## ')) {
      const title = trimmed.slice(3).trim()
      section = { key: loc(title, 0).toLowerCase(), title, entries: [], items: [] }
      sections.push(section)
      entry = null
      continue
    }
    if (trimmed.startsWith('### ')) {
      entry = { heading: trimmed.slice(4).trim(), meta: {}, items: [] }
      if (section) section.entries.push(entry)
      continue
    }
    if (trimmed.startsWith('- ')) {
      const body = trimmed.slice(2)
      const meta = body.match(/^([a-zA-Z]+):\s?(.*)$/)
      if (entry && meta && META_KEYS.includes(meta[1])) {
        entry.meta[meta[1]] = meta[2]
      } else if (entry) {
        entry.items.push(body)
      } else if (section) {
        section.items.push(body)
      }
    }
  }

  return { personal, sections }
}

// ---- moderncv renderer ----------------------------------------------------
function renderTex (model, lang) {
  const { personal, sections } = model
  const p = (k) => personal[k] || ''
  const [first, ...rest] = p('name').split(' ')
  const last = rest.join(' ')
  const linkedin = p('linkedin')
  const handle = linkedin.split('/in/').pop().replace(/\/$/, '')
  const website = p('website')
  const contactLine = [p('email'), p('phone'), linkedin, website]
    .filter(Boolean).map(tex).join(' \\textperiodcentered{} ')

  const head = `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{${STYLE}}
\\moderncvcolor{${COLOR}}
\\usepackage{fontspec}
\\setmainfont{${MAIN_FONT}}
\\usepackage[scale=${GEOMETRY_SCALE}]{geometry}
\\setlength{\\hintscolumnwidth}{2.6cm}
\\name{${tex(first)}}{${tex(last)}}
\\title{${tex(p(`title_${lang.code}`))}}
\\email{${tex(p('email'))}}
\\phone[mobile]{${tex(p('phone'))}}
\\social[linkedin]{${tex(handle)}}
\\homepage{${tex(website)}}
\\begin{document}
\\makecvtitle
\\begin{center}\\small ${contactLine}\\end{center}
\\vspace{-0.4em}
`

  // Summary (fixed, localized label; text comes from frontmatter).
  const summary = p(`summary_${lang.code}`)
  const summaryBlock = summary
    ? `\\section{${tex(lang.summary)}}\n\\cvitem{}{${tex(summary)}}\n`
    : ''

  const body = sections.map((s) => renderSection(s, lang)).join('\n')

  return head + summaryBlock + body + '\n\\end{document}\n'
}

function renderSection (section, lang) {
  const title = tex(loc(section.title, lang.idx))
  let out = `\\section{${title}}\n`

  if (section.key === 'experience') {
    out += section.entries.map((e) => {
      const items = e.items.map((it) => `    \\item ${tex(loc(it, lang.idx))}`).join('\n')
      const desc = items ? `{%\n  \\begin{itemize}\n${items}\n  \\end{itemize}}` : '{}'
      return `\\cventry{${tex(loc(e.meta.period, lang.idx))}}` +
        `{${tex(loc(e.heading, lang.idx))}}` +
        `{${tex(loc(e.meta.company, lang.idx))}}` +
        `{${tex(loc(e.meta.location, lang.idx))}}` +
        `{${tex(loc(e.meta.industry, lang.idx))}}` +
        desc
    }).join('\n')
  } else if (section.key === 'education') {
    out += section.entries.map((e) =>
      `\\cventry{${tex(loc(e.meta.period, lang.idx))}}` +
      `{${tex(loc(e.heading, lang.idx))}}` +
      `{${tex(loc(e.meta.institution, lang.idx))}}{}{}{}`
    ).join('\n')
  } else if (section.key === 'skills') {
    out += section.entries.map((e) => {
      const items = e.items.map((it) => tex(loc(it, lang.idx)))
        .join(' \\textperiodcentered{} ')
      return `\\cvitem{${tex(loc(e.heading, lang.idx))}}{${items}}`
    }).join('\n')
  } else {
    // Flat list sections (languages, interests): one compact line.
    const items = section.items.map((it) => tex(loc(it, lang.idx)))
      .join(' \\textperiodcentered{} ')
    out += `\\cvitem{}{${items}}`
  }

  return out
}

// ---- Compilation ----------------------------------------------------------
function have (cmd) {
  return spawnSync(cmd, ['--version'], { stdio: 'ignore' }).status === 0
}

function preflight () {
  if (have('latexmk') && have('xelatex')) return
  console.error(
    '\nMissing TeX toolchain (need xelatex + latexmk). Install one of:\n' +
    '  Lean : brew install --cask basictex\n' +
    '         then, in a new shell:\n' +
    '         sudo tlmgr update --self && sudo tlmgr install moderncv latexmk fontspec fontawesome5 marvosym geometry\n' +
    '  Full : brew install --cask mactex-no-gui\n')
  process.exit(1)
}

function compile (texPath, outDir) {
  const run = spawnSync('latexmk', [
    '-xelatex', '-interaction=nonstopmode', '-halt-on-error',
    `-output-directory=${outDir}`, texPath,
  ], { cwd: outDir, encoding: 'utf8' })

  if (run.status !== 0) {
    const log = texPath.replace(/\.tex$/, '.log')
    if (existsSync(log)) {
      const tail = readFileSync(log, 'utf8').split('\n').slice(-40).join('\n')
      console.error(tail)
    } else {
      console.error(run.stdout || run.stderr || '')
    }
    throw new Error(`XeLaTeX failed for ${texPath}`)
  }
  // Clean auxiliary files, keep the PDF.
  spawnSync('latexmk', ['-c', `-output-directory=${outDir}`, texPath], { cwd: outDir })
}

// ---- Main -----------------------------------------------------------------
function parseLangArg (args) {
  // Accept "--lang en", "--lang=fr", or a bare "en"/"fr"/"both" flag-less token later.
  let value = 'both'
  const eq = args.find((a) => a.startsWith('--lang='))
  if (eq) value = eq.slice('--lang='.length)
  const idx = args.indexOf('--lang')
  if (idx !== -1 && args[idx + 1]) value = args[idx + 1]
  value = value.toLowerCase()
  if (!['en', 'fr', 'both'].includes(value)) {
    console.error(`Invalid --lang "${value}". Use en | fr | both.`)
    process.exit(1)
  }
  return value
}

function main () {
  const args = process.argv.slice(2)
  const dry = args.includes('--dry') // write .tex only, skip TeX toolchain
  const langChoice = parseLangArg(args)
  // Strip flag values so they aren't mistaken for positional args.
  const langIdx = args.indexOf('--lang')
  const positional = args.filter((a, i) =>
    !a.startsWith('--') && !(langIdx !== -1 && i === langIdx + 1))
  const defaultSource = resolve(scriptDir, '..', 'public', 'resume-structured.md')
  const source = resolve(positional[0] || defaultSource)
  const outDir = resolve(positional[1] || dirname(source))
  if (!existsSync(source)) {
    console.error(`Source not found: ${source}`)
    process.exit(1)
  }

  const langs = LANGS.filter((l) => langChoice === 'both' || l.code === langChoice)

  if (!dry) preflight()
  const model = parse(readFileSync(source, 'utf8'))

  for (const lang of langs) {
    const texPath = join(outDir, `resume-${lang.code}.tex`)
    writeFileSync(texPath, renderTex(model, lang), 'utf8')
    if (dry) {
      console.log(`✓ ${texPath} (dry)`)
      continue
    }
    compile(texPath, outDir)
    rmSync(texPath, { force: true }) // keep only the PDF (esp. important in public/)
    console.log(`✓ ${join(outDir, `resume-${lang.code}.pdf`)}`)
  }
}

main()
