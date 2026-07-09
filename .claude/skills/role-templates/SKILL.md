---
name: role-templates
description: Generate reusable role-targeted base resume templates (e.g. Founding Product Manager, Head of Product, Product Director) from Félix's CPO master — one tuned EN+FR variant per role, no job description needed. Use when the user wants a ready-to-send resume for a role family rather than a specific job posting.
---

# Generate role-targeted resume templates

Produce reusable, role-family versions of Félix's resume — one tuned variant per target role
(e.g. **Founding Product Manager**, **Head of Product**, **Product Director**). Unlike
`tailor-resume`, there is **no company and no job description**: the input is a role archetype,
and the output is a standalone base template Félix can send directly or later hand to
`tailor-resume` for job-specific polish. The master (`public/resume-structured.md`) remains the
untouched **Chief Product Officer** source of truth; variants never modify it.

Same truthfulness rule as `tailor-resume`: you re-emphasize, reorder and rephrase **existing**
facts to fit the role's altitude — you never invent titles, employers, dates, metrics or skills.

## Inputs

- **Role(s)** (required): one or more of the known archetypes below, or `all`. If the user names
  a role not yet in the catalogue, add it only after confirming its archetype with them.
- **Language** (required): `en`, `fr`, or `both`. If not specified, ask before rendering.

### Invocation format

```
/role-templates head-of-product
both
```

First line → role slug(s) (comma-separated or `all`). Second line → language. Be tolerant: if the
second line isn't a valid language token, ask which language(s) to generate.

## Role archetypes (the catalogue)

Each archetype defines the **headline title**, the **hero entry** to lead with, what to emphasize,
and what a recruiter/ATS is screening for. All anchors below are real entries in the master —
reframing only, never invention.

- **founding-product-manager** → title **Founding Product Manager**.
  - Hero: **SustainSoft (Co-founder & CPTO)** — he literally founded the product & tech.
  - Emphasize: 0-to-1, MVP shipped in 6 months, end-to-end build (product/eng/UX/AI), continuous
    discovery, seed raise, comfort in ambiguity, hands-on. Lead the Skills with AI + Tech
    (a founding PM is expected to build), then Product leadership.
  - Screened for: scrappy builder who ships fast without process and works directly with founders
    and engineers. **Dial down exec/scale framing** — this altitude values the builder, not the org chart.

- **head-of-product** → title **Head of Product**.
  - Hero: **Adot (Head of Product — a real held title)**.
  - Emphasize: team leadership (3 Scrum squads, ~15 via PMs & POs), roadmap ownership, scaling
    30→100+ / €6M→€24M, discovery, cross-functional & exec alignment. Skills lead with Product
    leadership (team building, roadmap, OKRs), then AI, then UX.
  - Screened for: scaling-stage leader who structures the product function and delivers predictably.

- **product-director** → title **Product Director**.
  - Hero: **Adot**, reinforced by **Director of Analytics** (a real "Director" title anchor).
  - Emphasize: product strategy across teams, operating model / process maturity, OKRs & outcomes,
    stakeholder and exec-adjacent alignment, mentoring PMs. Skills lead with Product leadership
    (strategy, OKRs, team building, stakeholder & exec alignment).
  - Screened for: multi-team / portfolio leader with process maturity, one notch below VP/CPO.

Add new archetypes in this same shape (title · hero · emphasize · screened-for) as Félix needs them.

## Steps

1. **Read the master** `public/resume-structured.md` and the **skills database**
   `resume-generator/skills-database.md` — same schema and rules as `tailor-resume` (bilingual
   `English ||| Français` lines, `## Section`, `### Entry`, `- key:` metadata; keep Skills to ~2
   lines per group; only use skill lines that exist in the database).

2. **For each requested role, draft the variant** in the **same schema** as the master, applying
   that archetype's title / hero / emphasis:
   - **Set the headline title** to the archetype title verbatim (`title_en` / `title_fr`).
     Unlike `tailor-resume` this **replaces** the CPO headline (it is not a "CPO / X" composite) —
     the whole point is a clean, truthful headline at the role's real altitude. Do **not** claim a
     title above what the master supports.
   - **Reorder Experience** so the archetype's hero entry reads first *only if the master's own
     order doesn't already lead with it* — but **never change any entry's role, employer, dates or
     metrics**. (Reordering entries is allowed; rewriting their facts is not.)
   - **Reorder / re-emphasize Skills groups and bullets** to match the archetype, staying ~2 lines
     per group and drawing only from the skills database. Trim obscure jargon that adds no recruiter
     or ATS value for this altitude.
   - **Write the summary in a human voice, not an AI one** — same rule as `tailor-resume`: avoid
     em-dash triads, "As a <title>, I…" openers, buzzword pile-ups and vague superlatives; prefer
     plain, concrete phrasing with one real proof point (a metric). Draft **2–3 distinct options**
     per language so the user has real choices.

   **Guardrails (identical to tailor-resume):** never invent or alter employers, dates, per-entry
   roles or metrics; keep the bilingual `|||` format and section/entry structure intact so the
   renderer parses it.

3. **Validate and iterate the profile/summary with the user (required loop — do not skip).**
   The summary is where AI phrasing shows most and where Félix's voice matters most.
   - Present the 2–3 summary options (per requested language) plus the other proposed changes
     (title, reordering, skill emphasis, any jargon trimmed) for each role.
   - Invite the user to pick, rewrite, or flag anything that "sounds too AI", and **iterate —
     redraft and re-show — until they approve the wording.** Generate no PDF before sign-off.

4. **Write the approved template(s).** For each role, create
   `resume-generator/variants/<role-slug>/` and write `resume-structured.md` (the approved variant,
   same schema). If the folder already exists, don't overwrite it: write to
   `resume-generator/variants/<role-slug>-<YYYYMMDD>/` instead (today's date), preserving history.
   (No `job-description.md` / `fit-assessment.md` here — these are role templates, not applications.)

5. **Render the requested language(s)** with the deterministic renderer:
   ```
   node resume-generator/build.mjs resume-generator/variants/<role-slug>/resume-structured.md --lang <choice>
   ```
   The renderer treats a `variants/` parent like an application build and stamps the role into the
   filename, writing `resume-en-averlant-<role-slug>.pdf` / `resume-fr-averlant-<role-slug>.pdf`
   into that folder. If the TeX toolchain isn't found, relay the install instructions it prints.
   (TeX binaries live at `/Library/TeX/texbin`; if `xelatex` is missing, prefix the command with
   `PATH="/Library/TeX/texbin:$PATH"`.)

6. **Report** the output paths and, per role, a one-line summary of how the variant was reframed.

## Notes

- Variants are tracked in git (they are reusable templates); the generated PDFs are gitignored,
  same as applications.
- The master stays the **CPO** source of truth — re-run `yarn resume` to regenerate the base.
- These templates are complementary to `tailor-resume`: use a variant as a ready-to-send resume
  for a role family, and `tailor-resume` when there's a specific company + job description to match.
