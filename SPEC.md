# Personal Website — Marco Lundh
## Project Specification

---

## Overview

A personal website for Marco Lundh, a fullstack and platform engineer at Doktor.se with 13+ years of experience. The site has three purposes:

1. **Portfolio** — showcase the projects Marco has built (live demos, screenshots, source)
2. **Profile / CV** — show who Marco is, what he has been up to, and where he is heading
3. **AI News** — run a daily curated AI news feed and newsletter (both currently paused behind feature flags)

**Primary goal:** Give visitors a clear picture of Marco's work and background, and let interested readers follow the AI news feed.

---

## Target Audience

- Anyone curious about Marco's background — colleagues, collaborators, or people who found him online
- AI/tech-interested people who want a daily curated news feed

---

## Design Direction

**Style:** Modern & tech-savvy — dark background, clean typography, subtle animations.

- Dark color scheme: deep navy `#0a0f1e` background
- Accent color: electric blue `#4f9cf9` for highlights and CTAs
- Monospace font for name/details: JetBrains Mono
- Smooth scroll, subtle entrance animations (Framer Motion)
- Minimal, no clutter — let content breathe
- Responsive (mobile-first)

**Tone of copy:** Professional but human. Confident, not arrogant.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| i18n | Custom React context (EN/SV, English default) |
| Deployment | Vercel |
| Email delivery | Resend (free tier) |
| Subscriber store | Supabase (Postgres) |
| News pipeline | Python · GitHub Actions · Claude Haiku 4.5 |

---

## Site Structure

Multi-page application:

| Route | Purpose |
|---|---|
| `/` | Home — two cards: Portfolio and About me |
| `/portfolio` | Project showcase (PulseGraph, AI News, Job Radar, CV Fit Score, DocuChat) |
| `/about` | Personal profile / CV (single-page, anchor nav) |
| `/ai-news` | Daily AI news (+ newsletter signup when enabled); redirects to `/portfolio` while AI News is paused |

### Navigation (`/portfolio`)
- Logo: `marco-tech.se` (links to `/`)
- Links: About (`/about`) · AI News (`/ai-news`)
- Language toggle: EN / SV
- ← Home link

### Navigation (`/about`)
- Logo: `marco-tech.se` (links to `/`)
- Links: About · Experience · Skills · Contact (in-page anchors) · Portfolio (`/portfolio`)
- Language toggle: EN / SV
- ← Home link

---

## Portfolio (`/portfolio`)

A showcase of projects Marco has designed and shipped. Each project is a row with
an alternating image/text layout:

- **Media** — a browser-framed screenshot gallery (macOS chrome) with a thumbnail
  grid; clicking opens a full-screen lightbox. The strip hides itself for a single
  image. While the newsletter is paused, the AI News project shows screenshots of
  the feed, signup flow and emails (plus an "Open the full feed" link when
  `NEXT_PUBLIC_AI_NEWS_ENABLED=true`); with
  `NEXT_PUBLIC_NEWSLETTER_ENABLED=true` it embeds the live signup form
  (`SubscribeForm` in `compact` mode) instead.
- **Copy** — mono label, title, description, tech-stack tags, and a "View code"
  link to the GitHub repo.

Project copy (label/title/description) is bilingual and lives in
`translations.projects.items`, keyed by slug. Language-neutral data (screenshots,
stack, repo URL) lives in `app/portfolio/ProjectShowcase.tsx`.

| Project | Slug | Highlights | Stack | Repo |
|---|---|---|---|---|
| AI News automation | `ai-news` | Screenshots of the (paused) daily feed and newsletter flow | Python · Claude Haiku · GitHub Actions · Vercel Cron · Resend · Supabase · Next.js | `Marco-Lundh/marcolundh` |
| Job Radar | `job-radar` | Multi-agent job search: rank → CV fit → cover letter | Python · FastAPI · Pydantic AI · Groq · SSE · HTMX/Alpine.js | `Marco-Lundh/job-radar` |
| CV Fit Score | `cv-fit-score` | AI CV-vs-job fit analysis (PDF/text, EN/SV) | Python · FastAPI · Groq · pdfplumber · Docker · Kubernetes | `Marco-Lundh/cv-fit-score` |
| DocuChat | `docuchat` | RAG CLI: chat with your PDFs, answers grounded in content | Python · RAG · FAISS · Sentence Transformers · Groq · PyMuPDF | `Marco-Lundh/docuchat` |

---

## About / CV (`/about`)

### 1. Hero

- Greeting: `Hello, world.`
- Name: **Marco Lundh**
- Title: `Full-Stack Python Developer · AI & Automation`
- Description: "I build reliable backends and AI-powered automation — integrating systems, APIs, and LLMs that actually work in production. Python specialist with 13+ years of experience."
- CTA: `View LinkedIn ↗`

---

### 2. About

**Content:**
> I'm a senior Python developer transitioning into AI engineering — combining 13 years of backend expertise with a growing focus on AI integration and automation. I'm particularly drawn to LLM integrations, AI agents, agentic workflows, and making AI work reliably in production — not just impressive in demos.
>
> I genuinely enjoy making systems talk to each other — whether that's APIs, pipelines, or LLMs. I thrive in smaller, accountable teams where quality and end-user impact matter, and I bring a holistic perspective from design through deployment and support.
>
> "A tight team can accomplish anything — it really is that simple."

**Stats:**
- `13+` Years Python
- `5` Industries
- `8` Companies
- `2` Languages

---

### 3. Experience (Timeline)

Vertical timeline, newest first. Each entry expands on click to show description + tech stack.

#### Brite Payments AB — Senior Python Developer
`May 2024 – March 2026 · FinTech`

Backend developer in a team building fast, secure account-to-account payment solutions. Worked on large-scale commercial backend systems with event-driven architecture, API integrations, and automated data pipelines. Used prompt engineering for architecture exploration and code generation.

**Stack:** Python · FastAPI · React · GCP · Cloud Run · BigQuery · Terraform · Docker · Kubernetes · gRPC · Protobuf · OAuth2.0 · JWT · CI/CD

---

#### Sigma Technology Systems AB — Senior Python Developer (Consultant)
`March 2022 – May 2024 · IT Consulting`

- **NIRA Dynamics** — Road Perception team (15 people). Vehicle-based environment sensing systems.
- **Ericsson** — Agile Scrum team automating delivery of networks, storage, and hardware (LabOps). Built Python integrations with multiple APIs and a new configuration management service.

**Stack:** Python · Flask · JavaScript · REST APIs · PostgreSQL · SQLite · Docker · Kubernetes · GitOps · Airflow · GitHub Actions · CI/CD

---

#### ContextVision AB — Software Developer
`February 2009 – February 2022 · MedTech AI · 13 years`

Grew from IT Administrator to Software Developer at a medical imaging AI company (deep learning, prostate cancer detection). Built delivery and license management tool that became the company's current product. Responsible for Customer Portal and Package & Delivery. Key technical role in the INIFY Prostate AI project.

**Stack:** Python · Flask · SQLAlchemy · Celery · Elasticsearch · React · MySQL · AWS · Apache · Prometheus · Grafana · CI/CD

---

#### Östgötatrafiken AB — IT Technician
`May 2006 – May 2009 · Public Transport`

#### Nokia Home Communications & earlier
`1998 – 2006 · Telecom · Retail`

---

### 4. Skills

#### AI & Automation
LLM Integration · OpenAI API · Anthropic API · LangChain · RAG · Vector Databases · Prompt Engineering · AI Agents · Airflow · Celery

#### Frameworks & Databases
FastAPI · Flask · SQLAlchemy · React · Bootstrap · PostgreSQL · MySQL · Elasticsearch · Django

#### Cloud & Infrastructure
Google Cloud Platform · AWS · Docker · Kubernetes · Terraform · Linux · Nginx · Apache

#### Tools & Methods
Git · CI/CD · Scrum · Agile · Unit testing · E2E testing · gRPC · OAuth2.0 · JWT · Grafana · Prometheus

---

### 5. Contact

- Headline: `Let's connect`
- Copy: "I'm not looking for a new role - I'm happily building at Doktor.se. But I'm always up for a chat about AI, platform engineering, or an interesting side project."
- CTA: `Connect on LinkedIn`
- No contact form.

---

## AI News (`/ai-news`)

### Purpose
A daily curated feed of the most relevant AI news — ranked and summarized by Claude Haiku, refreshed every morning.

### Pipeline (GitHub Actions, triggered every morning by Vercel Cron via `repository_dispatch`)

**Status: paused.** The cron route skips the dispatch unless `NEXT_PUBLIC_AI_NEWS_ENABLED=true`; the workflow can still be run manually via `workflow_dispatch`.

1. Fetch articles from 18 RSS sources
2. Claude Haiku ranks and categorizes 25 articles into 10 categories
3. Writes `app/data/news.json` (overwritten daily — no archive)
4. Updates `pipeline/seen.json` (deduplication, 7-day window) — committed back to repo
5. If `NEWSLETTER_ENABLED=true` (GitHub repo variable): reads active subscribers from Supabase, sends top 10 articles via Resend. Paused by default.

### `/ai-news` Page
- Shows all 25 articles
- Client-side category filtering (10 categories)
- Newsletter signup form → `/api/subscribe` (Vercel serverless, hides Supabase + Resend credentials) — hidden, and the endpoint returns `503`, unless `NEXT_PUBLIC_NEWSLETTER_ENABLED=true`

### Newsletter (paused)
- Status: paused behind the flags above; all code is intact
- Email delivery: Resend (free ≤ 3 000 emails/month, 100/day)
- Subscriber store: Supabase Postgres (`subscribers` table, RLS enabled)
- GDPR: double opt-in and unsubscribe handled in-house
  - `/api/subscribe` creates a `pending` subscriber + sends a confirmation email
  - `/confirm?token=...` activates the subscriber
  - `/unsubscribe?token=...` (+ one-click `List-Unsubscribe` header) opts out
- Email: HTML layout, top 10 articles, same for all subscribers
- Each email carries a unique unsubscribe link per recipient

### News Categories (10)
1. LLMs & Models
2. AI Agents & Automation
3. Open Source AI
4. AI Tools & Frameworks
5. MLOps & Infrastructure
6. Research & Papers
7. AI in Industry
8. Ethics & Policy
9. Generative Media
10. Funding & Business

### RSS Sources

**AI Labs & Manufacturers**
Anthropic · OpenAI · Google DeepMind · Meta AI · Microsoft AI · NVIDIA · AWS Machine Learning · Apple ML Research · Mistral AI · Cohere · xAI · Hugging Face

**Tech Journalism**
MIT Technology Review AI · Ars Technica AI · The Verge AI · VentureBeat AI

**Community & Independent**
Simon Willison · The Batch (DeepLearning.AI)

### Config
`pipeline/news-config.json` — edit sources/topics without touching pipeline code.

---

## i18n

- Languages: English (default) and Swedish
- Toggle: EN/SV button in every page navbar (portfolio, about, AI News)
- Translations: `lib/translations.ts` (incl. `projects.items` for project copy)
- Context: `contexts/LanguageContext.tsx` (provided once in `app/layout.tsx`)
- Job descriptions in the experience timeline stay in English (standard in Swedish tech); project labels/titles/descriptions are translated

---

## File Structure

```
marcolundh/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # Home — Portfolio + About me cards
│   ├── portfolio/
│   │   ├── page.tsx             # Project showcase
│   │   ├── ProjectsNav.tsx
│   │   └── ProjectShowcase.tsx
│   ├── about/
│   │   └── page.tsx             # Profile / CV
│   └── ai-news/
│       ├── page.tsx
│       ├── AiNewsNav.tsx
│       ├── ArticleList.tsx
│       └── SubscribeForm.tsx    # also embedded (compact) on /portfolio
├── components/                  # CV/about + shared
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Experience.tsx
│   ├── Skills.tsx
│   └── Contact.tsx
├── contexts/
│   └── LanguageContext.tsx
├── lib/
│   └── translations.ts
├── public/projects/             # one folder per project slug
│   ├── job-radar/  cv-fit-score/  docuchat/
├── pipeline/
│   ├── curate.py
│   ├── seen.json
│   └── news-config.json
├── app/data/
│   └── news.json
└── .github/workflows/
    └── daily-news.yml
```

---

## SEO & Metadata

- `/portfolio` title: `Marco Lundh — Portfolio & Projects`
- `/about` title: `Marco Lundh — About & CV`
- Meta description: Full-stack Python developer with 13+ years of experience. Focused on AI integration and automation.
- Open Graph tags for social sharing

---

## Out of Scope

- Blog / articles section
- Contact form
- CMS / admin panel
- Authentication
- News history / archive

---

*Spec version 3.0 — June 2026*
