# Resumind — AI Resume Analyzer

Upload a resume, describe the job you're applying for, and get an ATS score plus
AI-powered feedback on tone & style, content, structure, and skills. Each analysis
can then be tracked through the application pipeline: Not applied → Applied →
Interview → Offer / Rejected.

## Pages

- **Dashboard** (`/`) — all analyses as cards with score rings, status badges, filtering and sorting
- **Applications** (`/applications`) — application tracker: searchable list with status pipeline and per-entry delete
- **Insights** (`/insights`) — analyses vs. applications sent, averages, category breakdowns, score distribution
- **Upload** (`/upload`) — job details + PDF upload, with an animated analysis screen
- **Review** (`/resume/:id`) — full report: overall score, ATS card, and detailed tips
- **Wipe** (`/wipe`) — maintenance page that deletes all stored app data (type-to-confirm)

## Stack

- [React Router 7](https://reactrouter.com/) (framework mode, SSR) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Puter.js](https://puter.com/) for auth, file storage, key-value store, and AI
  (Claude Sonnet via Puter — no API key needed; usage is billed to the signed-in Puter user)
- `pdfjs-dist` for client-side PDF → image conversion

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # react-router typegen + tsc
```

You'll be asked to sign in with a Puter account on first use — all data is stored
in that account, there is no backend of our own.

## Production

```bash
npm run build
npm run start      # serves ./build/server/index.js
```

A `Dockerfile` is included for containerized deployment.
