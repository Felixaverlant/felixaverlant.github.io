---
name: tailor-resume
description: Generate a company-tailored, ATS-valid EN+FR resume PDF from a company name and a job description. Use when the user wants a resume for a specific job application.
---

# Tailor resume for a job application

Produce a company-specific version of Félix's resume that is tailored to a given job
description, then render both language PDFs. The tailoring must stay **truthful** — you
re-emphasize and rephrase existing facts, you never invent anything. You can add and remove entries if it's the job description but always ask the user before that.

**Fit gate first:** before doing any tailoring, assess how well Félix's real experience matches
the job, surface the blocking gaps, give a 1–10 fit score, and ask the user whether to proceed
(step 3). Only continue if they say yes.

## Inputs

- **Company name** (required).
- **Job description** (required), supplied as **pasted text**.
- **Language** (required): `en`, `fr`, or `both`. The user will usually pick one. If not
  specified, ask which language(s) to generate before rendering.

### Invocation format (one-shot)

The skill args are parsed positionally so the user can supply everything in one call:

1. **First line** → company name.
2. **Second line** → language (`en`, `fr`, or `both`).
3. **Everything after the second line** → the pasted job description.

Example:

```
/tailor-resume Acme Corp
en
<paste the full job description here…>
```

Be tolerant: if the second line isn't a valid language token, treat it as part of the job
description and ask which language to generate. If a required input is still missing after
parsing, ask for it once before proceeding.

## Steps

1. **Read the master** `public/resume-structured.md`. This is the pool of true
   content and the exact schema you must reproduce (bilingual `English ||| Français` lines,
   `---` frontmatter, `## Section ||| Section`, `### Entry`, `- key:` metadata bullets).
   Also read the **skills database** `resume-generator/skills-database.md`: the full pool of
   truthful skill lines (same `|||` format, grouped identically). The master shows only ~2
   lines per skill group; when a job description emphasizes a skill that is in the database but
   not on the base resume, swap it in — but keep the tailored Skills section to ~2 lines per
   group so it stays scannable. Never add a skill that is absent from the database.

2. **Analyze the job description.** Identify: the role focus and seniority, must-have skills,
   the domain/industry, the **exact job title** (e.g. "Director of Product Management"), and
   the concrete ATS keywords/phrases the employer uses.

3. **Assess fit and get a go/no-go (required gate — do this before drafting anything).**
   Evaluate how well Félix's *real* experience (the master + skills database, nothing invented)
   matches the job's requirements, so he knows upfront whether it's worth applying.
   - Extract the JD's hard requirements: seniority, years of experience, domain/industry,
     must-have skills, scope (team size, revenue/budget), location, and any explicit dealbreakers.
   - Map each requirement against the master and skills database. Mark each **met / partial /
     missing**.
   - Surface the **blocking gaps** — what Félix does *not* have that could realistically screen
     him out (e.g. a required domain like HealthTech, team-size or revenue scope beyond his real
     numbers, a hard credential/certification, a specific tech). Be candid; identifying what's
     missing is the whole point of this step. Never paper over a gap.
   - Give a single **fit score from 1 to 10** (1 = very unlikely he should apply / clear
     mismatch; 10 = near-perfect fit). State the top 2–3 drivers of the score and the single
     biggest blocker.
   - **Present this assessment, then ask the user whether to proceed** (use AskUserQuestion:
     e.g. "Proceed with tailoring?" / "Stop here"). If they decline, **stop** — do not draft or
     render. If they approve, continue with the steps below.
   - Keep the assessment grounded only in truthful master content — same no-invention rule as
     the rest of the skill.
   - Preserve the full assessment (the requirement-by-requirement table, blocking gaps, fit
     score with its drivers and biggest blocker) — the exact report you showed the user gets
     saved verbatim to `fit-assessment.md` in step 6 if they proceed.

4. **Draft a tailored version** in the **same schema** as the master:
   - **Surface the exact target title.** The base headline is
     `Chief Product Officer`. Insert the exact title from the job
     description as a middle segment, keeping the surrounding framing (e.g.
     `Chief Product Officer / Director of Product Management `). ATS/recruiters
     search by exact title, so it must appear verbatim.
   - Rewrite `summary_en` / `summary_fr` to speak directly to this role and company, and
     **weave the exact target title into the summary** (Jobscan's recommended placement for
     a title not previously held under that exact name).
   - **Write the summary in a human voice, not an AI one.** The profile/summary is the most-read
     line *and* the one that most easily reads as machine-written — so avoid the tells: em-dash
     triads ("X — Y — Z"), "As a <title>, I…" openers, buzzword pile-ups (passionate, proven
     track record, leverage, drive impact, seamless, cutting-edge), and vague superlatives.
     Prefer plain, concrete, specific phrasing in Félix's own register. Draft **2–3 distinct
     summary options** (not one) so the user has real alternatives to react to in step 5.
   - Reorder and re-emphasize experience bullets and skill groups so the most relevant ones
     come first and use the employer's vocabulary.
   - Weave in matching ATS keywords **only where they reflect real experience** already present
     in the master.
   - Trim the least-relevant bullets **only if the user asks** for a shorter / one-page CV.

   **Guardrails — do not violate:**
   - Never invent or alter employers or dates. The per-entry job titles/roles under
     each `### Entry` (and their employers and dates) stay exactly as in the master — only the
     top **headline title line** and summary adopt the target title, as an emphasis of the
     same seniority, never a claim to a role actually held.
   - Keep the bilingual `|||` format and section/entry structure intact so the renderer parses it.

5. **Validate and iterate the profile/summary (required loop — do not skip).** The summary is
   where AI phrasing shows most and where Félix's voice matters most, so **never ship the first
   draft unreviewed.**
   - Present the drafted `summary_en` / `summary_fr` (the **2–3 options** from step 4) together
     with the other proposed changes (title, what was reordered/emphasized, keywords added).
   - Explicitly invite the user to pick, rewrite, or flag anything that "sounds too AI". Treat
     "sounds too AI" as a real instruction: strip the tells, plain it down, match his voice.
   - **Iterate — redraft from their edits and show the new version — until they approve the
     wording.** Do not treat one round as sufficient; keep looping until they explicitly sign off.
   - Only after the user approves the profile do you continue. **Generate no PDF before this
     sign-off.**

6. **Write the approved files.** Slugify the company name (lowercase, spaces→`-`, strip
   punctuation) to get `<company-slug>`. The target folder is
   `resume-generator/applications/<company-slug>/` — **but if that folder already exists**
   (a previous application to the same company), don't overwrite it: create a dated folder
   `resume-generator/applications/<company-slug>-<YYYYMMDD>/` instead (today's date, e.g.
   `acme-corp-20261230`), so each application is timestamped and the history is preserved.
   Use the resolved folder for every file below and for the render command in step 7. Write:
   - `resume-structured.md` — the approved tailored master (same schema).
   - `job-description.md` — the raw job description, for traceability.
   - `fit-assessment.md` — the full fit report from step 3 exactly as shown to the user: the
     requirement-by-requirement table (met / partial / missing), the blocking gaps, and the
     1–10 fit score with its drivers and biggest blocker. Save it verbatim so the applied-to
     decision is traceable alongside the tailored resume.

7. **Render the requested language(s)** by running the deterministic renderer on the tailored
   file, passing `--lang` with the user's choice (`en`, `fr`, or `both`):
   ```
   node resume-generator/build.mjs resume-generator/applications/<company-slug>/resume-structured.md --lang <choice>
   ```
   For application builds the renderer appends the name + company slug to the filename, so this
   writes `resume-en-averlant-<company-slug>.pdf` and/or `resume-fr-averlant-<company-slug>.pdf`
   into that folder. If it fails because the TeX
   toolchain is missing, relay the install instructions it prints. (Note: the TeX binaries live at
   `/Library/TeX/texbin`; if `xelatex` is not found, prefix the command with
   `PATH="/Library/TeX/texbin:$PATH"`.)

8. **Report** the output paths and a short summary of what was tailored for
   this application.

## Notes

- The tailored `resume-structured.md` and `job-description.md` are tracked in git (they are the
  application history); the generated PDFs are gitignored.
- To (re)generate the untailored base resume, the user can run `yarn resume`.
