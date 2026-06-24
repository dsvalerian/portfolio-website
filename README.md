# dmitrisalov.com

Personal portfolio site — software projects, music releases, and contact.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Hosting | Cloudflare Pages |
| Form submissions | FormSubmit (AJAX) |

## Features

- Home page with scrolling ticker, bio, and contact form
- Projects index with hover-reveal case study links
- Full case study pages (overview, problem, solution, outcome) with inline markdown links
- Music page with clickable release artwork grid
- AJAX contact form — no page reload, inline success/error states
- Privacy policy page

## Project Structure

```
src/
├── assets/             # Local images (music artwork, etc.)
├── components/
│   ├── Button.astro
│   ├── ContactSection.astro
│   ├── Link.astro
│   ├── PageHeader.astro
│   └── SectionLabel.astro
├── data/
│   └── projects.ts     # Project content and metadata
├── layouts/
│   └── Layout.astro    # Shared HTML shell + nav + footer
├── pages/
│   ├── index.astro
│   ├── privacy.astro
│   ├── music/
│   │   └── index.astro
│   └── projects/
│       ├── index.astro
│       └── [slug].astro
└── styles/
    └── global.css      # Tailwind v4 theme + custom utilities
```

## Local Development

### Prerequisites

- Node.js 18+

### Environment Variables

Create a `.env` file in the project root:

```
PUBLIC_SITE_URL=http://localhost:4321
```

In production (Cloudflare Pages), set `PUBLIC_SITE_URL=https://dmitrisalov.com`.

### Install & Run

```bash
npm install
npm run dev
```

## Other Scripts

| Command | Action |
|---|---|
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |

## Deployment

Deployed on Cloudflare Pages. Pushes to `main` trigger automatic builds.
