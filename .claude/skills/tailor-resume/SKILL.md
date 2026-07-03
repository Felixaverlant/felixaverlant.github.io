---
name: tailor-resume
description: Generate a company-tailored, ATS-valid EN+FR resume PDF from a company name and a job description. Use when the user wants a resume for a specific job application.
---

# Tailor resume for a job application

Produce a company-specific version of Félix's resume that is tailored to a given job
description, then render both language PDFs. The tailoring must stay **truthful** — you
re-emphasize and rephrase existing facts, you never invent anything.

## Inputs

- **Company name** (required).
- **Job description** (required), supplied as **pasted text**.
- **Language** (required): `en`, `fr`, or `both`. The user will usually pick one. If not
  specified, ask which language(s) to generate before rendering.

If a required input is missing, ask for it once before proceeding.

## Steps

1. **Read the master** `public/resume-structured.md`. This is the pool of true
   content and the exact schema you must reproduce (bilingual `English ||| Français` lines,
   `---` frontmatter, `## Section ||| Section`, `### Entry`, `- key:` metadata bullets).

2. **Analyze the job description.** Identify: the role focus and seniority, must-have skills,
   the domain/industry, and the concrete ATS keywords/phrases the employer uses.

3. **Draft a tailored version** in the **same schema** as the master:
   - Rewrite `summary_en` / `summary_fr` to speak directly to this role and company.
   - Reorder and re-emphasize experience bullets and skill groups so the most relevant ones
     come first and use the employer's vocabulary.
   - Weave in matching ATS keywords **only where they reflect real experience** already present
     in the master.
   - Trim the least-relevant bullets **only if the user asks** for a shorter / one-page CV.

   **Guardrails — do not violate:**
   - Never invent or alter employers, job titles, dates, or skills.
   - Only re-emphasize and rephrase facts that already exist in the master.
   - Keep the bilingual `|||` format and section/entry structure intact so the renderer parses it.

4. **Confirm before rendering (required).** Show the user a concise summary of the proposed
   changes (new summary, what was reordered/emphasized, keywords added). **Wait for their explicit
   approval or edits before generating any PDF.** Iterate until they approve.

5. **Write the approved files.** Create `resume-generator/applications/<company-slug>/` (slugify
   the company name: lowercase, spaces→`-`, strip punctuation) and write:
   - `resume-structured.md` — the approved tailored master (same schema).
   - `job-description.md` — the raw job description, for traceability.

6. **Render the requested language(s)** by running the deterministic renderer on the tailored
   file, passing `--lang` with the user's choice (`en`, `fr`, or `both`):
   ```
   node resume-generator/build.mjs resume-generator/applications/<company-slug>/resume-structured.md --lang <choice>
   ```
   This writes `resume-en.pdf` and/or `resume-fr.pdf` into that folder. If it fails because the TeX
   toolchain is missing, relay the install instructions it prints. (Note: the TeX binaries live at
   `/Library/TeX/texbin`; if `xelatex` is not found, prefix the command with
   `PATH="/Library/TeX/texbin:$PATH"`.)

7. **Report** the output paths and a short summary of what was tailored for this application.

## Notes

- The tailored `resume-structured.md` and `job-description.md` are tracked in git (they are the
  application history); the generated PDFs are gitignored.
- To (re)generate the untailored base resume, the user can run `yarn resume`.
