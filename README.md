# Majestic UI Web

Lightweight documentation site for the `majestic_ui` Flutter widget CLI. The
landing page stays in `src/app/page.tsx`; documentation is powered by Fumadocs
and plain MDX files in `content/docs`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Editing Docs

General docs live in `content/docs`. Widget docs live in `content/docs/widgets`.
To add a widget:

1. Add a new `content/docs/widgets/my-widget.mdx` file.
2. Add the page slug to `content/docs/widgets/meta.json`.
3. Fill in frontmatter such as `preview_url`, `cli`, `dependencies`, and
   `files`.

See `content/docs/widgets/star-rush-background.mdx` for the widget template.

## Import from CSV

To regenerate widget MDX from a Prisma/content export (columns: `name`, `label`,
`description`, `dependencies`, `demo`, `files`, `preview_url`):

```bash
node scripts/import-content-csv.mjs /path/to/content_rows.csv
```

This overwrites matching files under `content/docs/widgets/` and refreshes `meta.json`.

## Scripts

- `npm run dev` starts the local docs site.
- `npm run build` builds the static landing and docs pages.
- `npm run lint` runs ESLint.
