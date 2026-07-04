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
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))

// ---- Styling knobs (tweak here) -------------------------------------------
// Note: colors/fonts/spacing are purely visual — an ATS reads the PDF text
// layer, which is unaffected by any of these. Tuned to fit on a single page.
const STYLE = 'banking' // single-column moderncv style, ATS-friendlier
const COLOR = 'black' // moderncv base scheme; color1/color2 overridden below
const MAIN_FONT = 'Arial' // standard, widely-installed, cleanly extractable
const FONT_SIZE = '10pt' // 10pt keeps a dense senior CV to one page, still legible
// Header type sizes, pinned so they don't ride on moderncv's style defaults
// (banking's default name is ~34pt). Font size is invisible to ATS parsing; this
// is purely recruiter hierarchy + reclaiming vertical space at the top of the page.
const NAME_SIZE = '22pt' // name: clear and confident, not a billboard
const NAME_LEADING = '26pt'
const TITLE_SIZE = '12pt' // role: a subtitle, clearly subordinate to the name
const TITLE_LEADING = '14pt'
const GEOMETRY_SCALE = '0.94' // usable text area as a fraction of the A4 page
// Accent palette lifted from the personal site (src/app/globals.css):
//   --color-theme-blue: #4a7c8e   --color-theme-bg (navy): #1a2f42
const ACCENT_BLUE = '4A7C8E' // name + section headings + rules (color1)
const ACCENT_NAVY = '1A2F42' // job title (color2)
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
  const website = p('website')
  const location = p('location')
  const contactLine = [p('email'), p('phone'), linkedin, website, location]
    .filter(Boolean).map(tex).join(' \\textperiodcentered{} ')

  const head = `\\documentclass[${FONT_SIZE},a4paper,sans]{moderncv}
\\moderncvstyle{${STYLE}}
\\moderncvcolor{${COLOR}}
% Accent colors from the personal site. Re-assert every derived color explicitly
% so the result is independent of moderncv's style/color load order. Body text and
% date hints stay black (color0) for print legibility; color is invisible to ATS.
\\definecolor{accentblue}{HTML}{${ACCENT_BLUE}}
\\definecolor{accentnavy}{HTML}{${ACCENT_NAVY}}
\\colorlet{color1}{accentblue}
\\colorlet{color2}{accentnavy}
\\colorlet{namecolor}{accentblue}
\\colorlet{lastnamecolor}{accentblue}
\\colorlet{firstnamecolor}{accentblue}
\\colorlet{titlecolor}{accentnavy}
\\colorlet{sectioncolor}{accentblue}
\\colorlet{subsectioncolor}{accentblue}
\\colorlet{bodyrulecolor}{accentblue}
\\usepackage{fontspec}
% Disable common ligatures (ﬀ ﬁ ﬂ ﬃ ﬄ). They render as single Unicode glyphs
% in the PDF text layer, which breaks ATS keyword matching (e.g. "Officer").
% Applies to every font loaded after this line.
\\defaultfontfeatures{Ligatures=NoCommon}
\\setmainfont{${MAIN_FONT}}
\\setsansfont{${MAIN_FONT}}
\\usepackage[scale=${GEOMETRY_SCALE}]{geometry}
\\setlength{\\hintscolumnwidth}{2.6cm}
% moderncv's \\labelitemi routes \\textbullet through the legacy OMS math font,
% which under XeLaTeX+Arial falls back to an emoji glyph (U+1F7E4) — that garbles
% the ATS text layer and scrambles reading order. Force a literal Arial bullet.
\\renewcommand*{\\labelitemi}{\\strut\\textbullet}
% Stop line-break word-splitting: auto-hyphenation and breaks at explicit hyphens
% (e.g. "go-to-market" -> "goto-market") corrupt keywords in the text layer.
\\hyphenpenalty=10000
\\exhyphenpenalty=10000
\\tolerance=2000
\\emergencystretch=3em
% Pin the name/title sizes so they don't inherit moderncv banking's oversized
% defaults (~34pt name). Keeps the color macros set above; only the size is fixed.
% Purely visual: font size never reaches the ATS text layer.
\\renewcommand*{\\firstnamestyle}[1]{{\\fontsize{${NAME_SIZE}}{${NAME_LEADING}}\\selectfont\\mdseries\\textcolor{firstnamecolor}{#1}}}
\\renewcommand*{\\lastnamestyle}[1]{{\\fontsize{${NAME_SIZE}}{${NAME_LEADING}}\\selectfont\\mdseries\\textcolor{lastnamecolor}{#1}}}
\\renewcommand*{\\titlestyle}[1]{{\\fontsize{${TITLE_SIZE}}{${TITLE_LEADING}}\\selectfont\\mdseries\\textcolor{titlecolor}{#1}}}
% Drop moderncv's "Name | Title" pipe: render the job title on its own line so an
% ATS can't mis-read the title as part of the candidate name. Self-contained
% override (we don't use moderncv's detail fields — contact is a separate line).
\\makeatletter
\\renewcommand*{\\makehead}{%
  \\parbox{\\textwidth}{\\centering
    \\firstnamestyle{\\@firstname\\ }\\lastnamestyle{\\@lastname}%
    \\ifthenelse{\\equal{\\@title}{}}{}{\\\\[0.15em]\\titlestyle{\\@title}}}%
}
% Remove the page-number footer ("1/2") so it can't leak into the ATS text stream.
\\nopagenumbers{}
% --- Single-page spacing (visual only; text layer unchanged) ---------------
% Re-inline moderncv's section macro (banking is fixed to mixedrules+left) so we
% control the vertical skips directly. Values are set to let the content breathe
% on one page rather than to cram it — loosen/tighten the addvspace below to taste.
\\RenewDocumentCommand{\\section}{sm}{%
  \\par\\addvspace{2.6ex}%
  \\phantomsection{}%
  \\strut\\sectionstyle{#2}%
  \\sectionrule%
  \\par\\nobreak\\addvspace{0.55ex}\\@afterheading}
% Trim the oversized gap moderncv leaves between the header and the first section.
\\renewcommand*{\\makecvhead}{\\recomputecvlengths\\makehead\\par\\vspace{0.3em}}
% Inter-item spacing (summary/skills/languages/interests lines).
\\renewcommand*{\\cvitem}[3][.22em]{\\ifstrempty{#2}{}{\\hintstyle{#2}: }{#3}\\par\\addvspace{#1}}
\\makeatother
% Slightly open leading; content breathes a touch while staying on one page.
\\linespread{0.98}
\\name{${tex(first)}}{${tex(last)}}
\\title{${tex(p(`title_${lang.code}`))}}
% Contact info is rendered as a single plain-text line below (moderncv's icon
% fields leak icon names into the PDF text layer, which pollutes ATS parsing).
\\begin{document}
\\makecvtitle
\\begin{center}\\small ${contactLine}\\end{center}
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
      // Fold industry inline with the employer ("Company — Industry") instead of
      // moderncv's trailing "grade" slot: it reads as a company descriptor rather
      // than a standalone metadata field, and the domain keyword still lands in the
      // ATS text layer. Grade slot is left empty.
      const company = loc(e.meta.company, lang.idx)
      const industry = loc(e.meta.industry, lang.idx)
      const employer = industry ? `${company} — ${industry}` : company
      // Title-leads layout (7-second-scan tuned). The banking style renders the
      // 3rd/4th cventry slots bold on the top line (left/right) and the 1st/2nd in
      // muted italic below. We drive that VISUAL slotting rather than the semantic
      // arg order: the ROLE takes the bold top-left slot (a senior candidate's
      // strongest anchor) and DATES the bold top-right slot (tenure scans harder
      // than location). Company+industry and location drop to the italic line —
      // still fully legible, just subordinate. ATS reads the text regardless of slot.
      const role = loc(e.heading, lang.idx)
      const period = loc(e.meta.period, lang.idx)
      const place = loc(e.meta.location, lang.idx)
      // [.28em] gives each role a little air; loosen/tighten to fill the page.
      return `\\cventry[.28em]{${tex(place)}}` + // → italic, bottom-right (muted)
        `{${tex(employer)}}` + //                  → italic, bottom-left (muted)
        `{${tex(role)}}` + //                      → bold, top-left (lead anchor)
        `{${tex(period)}}` + //                    → bold, top-right (tenure)
        `{}` +
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

// TeX installs (BasicTeX/MacTeX) drop binaries here but don't always add them to
// PATH for non-login shells, so `yarn resume` fails despite a working toolchain.
// Prepend the known bin dir(s) when the tools aren't already on PATH.
const TEX_BIN_DIRS = ['/Library/TeX/texbin']
function ensureTexOnPath () {
  if (have('xelatex') && have('latexmk')) return
  const extra = TEX_BIN_DIRS.filter((d) => existsSync(d))
  if (extra.length) {
    process.env.PATH = [...extra, process.env.PATH].filter(Boolean).join(':')
  }
}

function preflight () {
  ensureTexOnPath()
  if (have('latexmk') && have('xelatex')) return
  console.error(
    '\nMissing TeX toolchain (need xelatex + latexmk). Install one of:\n' +
    '  Lean : brew install --cask basictex\n' +
    '         then, in a new shell:\n' +
    '         sudo tlmgr update --self && sudo tlmgr install moderncv latexmk fontspec fontawesome6 academicons marvosym geometry\n' +
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

  // For tailored builds under applications/<company-slug>/, append the tokenized
  // company name to the filename (resume-<lang>-<slug>.pdf). The base build in public/
  // keeps the plain resume-<lang>.pdf names the website serves.
  const isApplication = basename(dirname(outDir)) === 'applications'
  const slugSuffix = isApplication ? `-${basename(outDir)}` : ''

  if (!dry) preflight()
  const model = parse(readFileSync(source, 'utf8'))

  for (const lang of langs) {
    const fileName = `resume-${lang.code}${slugSuffix}`
    const texPath = join(outDir, `${fileName}.tex`)
    writeFileSync(texPath, renderTex(model, lang), 'utf8')
    if (dry) {
      console.log(`✓ ${texPath} (dry)`)
      continue
    }
    compile(texPath, outDir)
    rmSync(texPath, { force: true }) // keep only the PDF (esp. important in public/)
    console.log(`✓ ${join(outDir, `${fileName}.pdf`)}`)
  }
}

main()
