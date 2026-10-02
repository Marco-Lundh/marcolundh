# marco-tech.se

Personal website for Marco Lundh — fullstack and platform engineer at Doktor.se. The site serves three purposes: a project portfolio, a CV/about page, and a daily AI news feed (with an optional newsletter, currently paused).

**Live:** [marco-tech.se](https://marco-tech.se)

---

## Features

- **Portfolio** — project showcase at `/portfolio`: PulseGraph, AI News automation, Job Radar, CV Fit Score, and DocuChat. Each project has a browser-framed screenshot gallery with lightbox, a tech-stack list, and a link to its GitHub repo.
- **About / CV** — profile, experience timeline, skills, and contact at `/about`
- **AI News** — daily curated AI news at `/ai-news` with category filtering
- **Daily newsletter** — top 10 AI stories by email via Resend. **Paused** behind a feature flag (see [Newsletter flag](#newsletter-flag)); the code is intact
- **Bilingual** — English / Swedish toggle (auto-detected from browser language)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| i18n | Custom React context (EN/SV) |
| Deployment | Vercel |
| Email delivery | Resend |
| Subscriber store | Supabase (Postgres) |
| News pipeline | Python · GitHub Actions · Claude Haiku 4.5 |

---

## Site Structure

```mermaid
graph TD
    A["marco-tech.se /"] --> B["/portfolio"]
    A --> AB["/about"]
    A --> C["/ai-news"]
    B --> P["Projects: AI News · Job Radar · CV Fit Score · DocuChat"]
    P --> PD["Browser-frame gallery + lightbox · stack · GitHub link"]
    B --> F1["Embedded live demo → /api/subscribe"]
    AB --> D["Hero · About · Experience · Skills · Contact"]
    C --> E["25 Articles · Category Filter"]
    C --> F2["Newsletter Signup → /api/subscribe"]
    F1 --> G["Supabase + Resend"]
    F2 --> G
```

---

## Newsletter flag

The newsletter is paused by default. Two flags turn it back on — no code change needed:

| Flag | Where | Effect |
|---|---|---|
| `NEXT_PUBLIC_NEWSLETTER_ENABLED=true` | Vercel env (redeploy) | Shows the signup form on `/ai-news`, swaps the AI News screenshot gallery on `/portfolio` for the live signup demo, and lets `/api/subscribe` accept signups (otherwise `503`) |
| `NEWSLETTER_ENABLED=true` | GitHub repo variable (Settings → Secrets and variables → Actions → Variables) | Makes `pipeline/curate.py` send the daily email; otherwise it only updates the feed |

Confirm and unsubscribe links in already-sent emails keep working while paused.

## Newsletter Pipeline

Runs every morning. Vercel Cron triggers the workflow via `repository_dispatch`
for reliable timing (GitHub's own cron schedule drifts by hours).

```mermaid
flowchart TD
    A0["Vercel Cron\n0 5 * * *"] --> A1["/api/cron/trigger-news\nrepository_dispatch"]
    A1 --> A["GitHub Actions\npipeline"]
    A --> B["Fetch RSS Feeds\n18 sources"]
    B --> C["Filter via seen.json\n7-day deduplication"]
    C --> D["Claude Haiku 4.5\nRank · Categorize · Summarize"]
    D --> E["news.json\n25 articles with categories"]
    D --> F["Update seen.json\ncommit back to repo"]
    D --> H["Resend batch API\nTop 10 articles"]
    E --> G["Git commit\n→ Vercel auto-redeploy"]
    C2["Supabase\nactive subscribers"] --> H
    G --> I["/ai-news page\nlive within minutes"]
    H --> J["Subscribers\nevery morning"]
```

### Subscriber Signup Flow

```mermaid
sequenceDiagram
    participant V as Visitor
    participant S as /ai-news or /portfolio demo
    participant A as /api/subscribe
    participant DB as Supabase
    participant R as Resend
    participant E as Email inbox

    V->>S: Enters email and submits form
    S->>A: POST { email }
    A->>DB: Insert subscriber (status: pending)
    A->>R: Send confirmation email
    R->>E: Double opt-in confirmation email
    E->>V: Clicks confirm link
    V->>DB: /confirm sets status: active
    Note over DB: Active subscriber stored
    R-->>E: Next morning — daily AI news
```

### News Categories

| # | Category |
|---|---|
| 1 | LLMs & Models |
| 2 | AI Agents & Automation |
| 3 | Open Source AI |
| 4 | AI Tools & Frameworks |
| 5 | MLOps & Infrastructure |
| 6 | Research & Papers |
| 7 | AI in Industry |
| 8 | Ethics & Policy |
| 9 | Generative Media |
| 10 | Funding & Business |

### RSS Sources

**AI Labs:** Anthropic · OpenAI · Google DeepMind · Meta AI · Microsoft AI · NVIDIA · AWS Machine Learning · Apple ML Research · Mistral AI · Cohere · xAI · Hugging Face

**Journalism:** MIT Technology Review AI · Ars Technica AI · The Verge AI · VentureBeat AI

**Community:** Simon Willison · The Batch (DeepLearning.AI)

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | GitHub Actions Secret | Claude Haiku for news curation |
| `RESEND_API_KEY` | GitHub Actions Secret + Vercel | Sending confirmation + newsletter emails (only required while the newsletter is enabled) |
| `NEXT_PUBLIC_NEWSLETTER_ENABLED` | Vercel | `true` opens newsletter signups (default: paused) |
| `NEWSLETTER_ENABLED` | GitHub Actions Variable | `true` sends the daily newsletter email (default: paused) |
| `SUPABASE_URL` | GitHub Actions Secret + Vercel | Subscriber database endpoint |
| `SUPABASE_SERVICE_KEY` | GitHub Actions Secret + Vercel | Server-side database access (service role) |
| `CRON_SECRET` | Vercel | Vercel Cron sends this as a Bearer token; the cron route verifies it |
| `GITHUB_DISPATCH_TOKEN` | Vercel | PAT used by the cron route to fire the pipeline via `repository_dispatch` |

Never commit secrets to the repository. Add them via:
- **GitHub:** Settings → Secrets and variables → Actions
- **Vercel:** Project → Settings → Environment Variables

The `SUPABASE_SERVICE_KEY` bypasses Row Level Security — it is used only
server-side (API routes and the pipeline) and is never exposed to the browser.

### Database schema

The `subscribers` table in Supabase:

```sql
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text not null default 'pending',  -- pending | active | unsubscribed
  confirm_token text not null,
  unsubscribe_token text not null,
  created_at timestamptz default now(),
  confirmed_at timestamptz,
  confirmation_sent_at timestamptz  -- throttles repeat confirmation emails
);
```

---

## Project Structure

```
marcolundh/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # Home — Portfolio + About me cards
│   ├── portfolio/
│   │   ├── page.tsx             # Portfolio — project showcase
│   │   ├── ProjectsNav.tsx      # Portfolio nav (About · AI News · home)
│   │   └── ProjectShowcase.tsx  # Project rows: gallery + lightbox + live demo
│   ├── about/page.tsx           # About / CV (Hero · About · Experience · Skills · Contact)
│   ├── ai-news/
│   │   ├── page.tsx             # AI News feed
│   │   ├── AiNewsNav.tsx
│   │   ├── ArticleList.tsx
│   │   └── SubscribeForm.tsx    # Signup form (reused as `compact` live demo on /portfolio)
│   ├── confirm/page.tsx         # Double opt-in confirmation
│   ├── unsubscribe/page.tsx     # Unsubscribe landing
│   └── api/
│       ├── subscribe/route.ts   # Newsletter signup endpoint
│       ├── unsubscribe/route.ts # One-click unsubscribe (List-Unsubscribe)
│       └── cron/trigger-news/   # Vercel Cron → repository_dispatch
├── components/                  # CV/about + shared components
│   ├── Nav.tsx
│   ├── StatusCard.tsx           # Confirm / unsubscribe result UI
│   ├── UnsubscribeButton.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Experience.tsx
│   ├── Skills.tsx
│   └── Contact.tsx
├── contexts/
│   └── LanguageContext.tsx
├── lib/
│   ├── translations.ts          # EN/SV strings incl. projects.items
│   ├── supabase.ts              # Server-side Supabase client
│   └── email.ts                 # Resend client + confirmation email
├── public/projects/             # Project screenshots (one folder per slug)
│   ├── job-radar/               # 1.png … 9.png
│   ├── cv-fit-score/            # 1.png … 4.png
│   └── docuchat/                # 1.png
├── pipeline/
│   ├── curate.py                # Main pipeline script
│   ├── seen.json                # Deduplication state
│   └── news-config.json         # Sources and topics config
├── app/data/
│   └── news.json                # Daily output (overwritten daily)
└── .github/workflows/
    └── daily-news.yml           # Cron job definition
```

---

## Deployment

The site deploys automatically to Vercel on every push to `main`. The news pipeline commits `news.json` back to the repo daily, which triggers a Vercel redeploy — no manual steps needed.
