# Yashkumar Rank — Portfolio (Next.js)

Next.js 16 + Tailwind CSS 4 + Motion port of the Flutter portfolio, statically exported.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

## Edit content

All copy lives in `lib/data.ts` (profile, skills, experience, projects, posts, education, certificates).
Images are in `public/` (`certificates/`, `images/`).

## Interactive features

- Hero dot field that bends around the cursor; click to send a shockwave (`components/field.tsx`)
- Name decode/scramble, rotating role ticker, count-up stats, magnetic buttons
- `⌘K` / `Ctrl+K` command palette: jump to sections, copy email, open links
- Custom cursor that snaps onto buttons and links (desktop only)
- Skill domain explorer + marquee, scroll-linked experience timeline
- Filterable project cards with 3D tilt and cursor spotlight
- Certificate wall with lightbox (← → / Esc)
- Working terminal: `help`, `whoami`, `projects`, `open 2`, `skills`, `contact`, `hire`… (↑↓ history, Tab completes)
- Contact form that opens a prefilled email; click-to-copy email with toast

All motion respects `prefers-reduced-motion`.

## Deploy (Firebase Hosting)

`firebase.json` points the same hosting site (`yash-rank-portfolio1001`) at `out/`:

```bash
npm run build && firebase deploy --only hosting
```
