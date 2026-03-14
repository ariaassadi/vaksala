# Vaksala FIFA

A FIFA Ultimate Team-inspired web app for Vaksala's indoor football league (KR-cupen 25/26). Generates player cards with stats, leaderboards, special awards, and a presentation mode for showcasing results.

## Features

- **Player Cards** — FIFA-style cards generated from match data with calculated ratings and stats (PAC, SHO, PAS, DRI, DEF, PHY)
- **Special Cards** — MOTM, TOTW, and other data-driven award cards
- **Leaderboard** — Sortable stats table with goals + assists rankings
- **Presentation Mode** — Keyboard-navigated slideshow with animations for displaying results at events
- **PNG Download** — Export individual player cards as images

## Tech Stack

- [Next.js](https://nextjs.org) 16 / React 19
- [Tailwind CSS](https://tailwindcss.com) 4
- [shadcn/ui](https://ui.shadcn.com) components
- [html-to-image](https://github.com/bubkoo/html-to-image) for card export
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Data Pipeline

Player stats are parsed from an Excel spreadsheet at build time:

```bash
npm run parse-data
```

This reads `data/Vaksala KR-cupen 25_26.xlsx` and generates the JSON used by the app. The parse step also runs automatically before `npm run build`.
