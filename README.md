# Resumind

> Smart feedback for your dream job.

**Resumind** is an AI-powered resume analyzer that scores your resume against real job descriptions and provides actionable improvement tips. Upload your PDF, enter the target position, and get detailed feedback on ATS compatibility, content quality, structure, tone, and skills — all powered by AI.

## Features

- **AI-Driven Analysis** — Uses Claude (via Puter.js) to evaluate resumes against a given job title and description
- **ATS Score** — Get a compatibility rating that estimates how well your resume would perform in Applicant Tracking Systems
- **Category Breakdown** — Detailed scores and tips for five areas: ATS, Tone & Style, Content, Structure, and Skills
- **PDF Upload & Preview** — Drag-and-drop your resume as PDF; it gets converted to an image preview automatically
- **Resume History** — All past analyses are saved and accessible from the dashboard
- **Authentication** — User accounts via Puter.js auth (sign in, sign out, session management)

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React Router v7 (SSR) |
| UI | React 19, Tailwind CSS v4 |
| State Management | Zustand |
| Backend Services | Puter.js (Auth, File Storage, KV Store, AI) |
| AI Model | Claude Sonnet (via Puter AI API) |
| PDF Processing | pdf.js (pdfjs-dist) |
| Language | TypeScript |
| Containerization | Docker |

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation
```bash
git clone https://github.com/<your-username>/ai-resume-analyzer.git
cd ai-resume-analyzer
npm install
```

### Development
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build
```bash
npm run build
npm run start
```

### Docker
```bash
docker build -t resumind .
docker run -p 3000:3000 resumind
```

## How It Works

1. **Sign in** with your Puter account
2. **Upload** your resume (PDF) and enter the company name, job title, and job description
3. The resume is uploaded to Puter's file system and converted to an image for AI processing
4. **Claude** analyzes the resume against the job description and returns a structured JSON evaluation
5. Results are displayed as scores (0–100) with actionable tips per category
6. All analyses are persisted in Puter's KV store so you can revisit them anytime

## Project Structure
```
app/
├── components/     # UI components (ATS, Summary, ScoreGauge, FileUploader, etc.)
├── lib/            # Puter store (Zustand), PDF-to-image conversion, utilities
├── routes/         # Pages: auth, home (dashboard), upload, resume detail
└── root.tsx        # App root
constants/          # AI prompt templates and response format definitions
public/             # Static assets (icons, images, backgrounds)
types/              # TypeScript type definitions
Dockerfile
```

## License

MIT
