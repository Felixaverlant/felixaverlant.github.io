## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Generating a resume (ATS PDF, EN / FR)

Resume content lives in one bilingual master: `public/resume-structured.md`
(format rules are documented at the top of that file). It compiles to ATS-valid PDFs via
moderncv + XeLaTeX. The base PDFs are written to `public/` because the website serves them.

**One-time setup** (TeX toolchain — only needed once):

```bash
brew install --cask basictex
# then, in a new shell (installs the LaTeX packages the template needs):
sudo /Library/TeX/texbin/tlmgr update --self
sudo /Library/TeX/texbin/tlmgr install moderncv latexmk fontspec fontawesome6 academicons geometry marvosym
```

> The TeX binaries live at `/Library/TeX/texbin`. If a command reports `xelatex not found`,
> add that folder to your `PATH` (e.g. prefix a command with `PATH="/Library/TeX/texbin:$PATH"`).

**Base resume** (the default, non-tailored CV — regenerates from the master):

```bash
yarn resume          # both languages
yarn resume:en       # English only
yarn resume:fr       # French only
```

Output: `public/resume-en.pdf` and/or `public/resume-fr.pdf` (the files your website serves;
committed to git so GitHub Pages deploys them).

**Job-specific resume** (tailored to a company + job description):

Run the `/tailor-resume` skill in Claude Code, then provide the **company name**, paste the
**job description**, and pick the **language** (`en`, `fr`, or `both`). It proposes tailored
edits (truthfully, no fabrication), waits for your approval, then writes
`resume-generator/applications/<company>/` containing the tailored `resume-structured.md`, the
`job-description.md`, and the generated PDF(s).

> Generated PDFs (and LaTeX `.tex`/aux files) are gitignored; each application's
> `resume-structured.md` + `job-description.md` are kept in git as your application history.

## Deploy on GitHub Pages

This project is configured for static export (`output: 'export'`), making it compatible with GitHub Pages.

### Option 1: GitHub Actions (recommended)

1. Create `.github/workflows/deploy.yml` in your repo with:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, master]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "yarn"

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build
        run: yarn build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. In your GitHub repo, go to **Settings → Pages** and set the source to **GitHub Actions**.

### Option 2: Manual deployment

1. Build the project locally:
   ```bash
   yarn install
   yarn build
   ```

2. The static site is generated in the `out` folder.

3. Push the contents to a `gh-pages` branch (or use a tool like [gh-pages](https://www.npmjs.com/package/gh-pages)):
   ```bash
   npx gh-pages -d out
   ```

4. In your repo, go to **Settings → Pages** and select the `gh-pages` branch as the source.
