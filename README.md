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
