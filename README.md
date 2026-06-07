# marco-tech.se

Personal website for Marco Lundh — full-stack Python developer transitioning into AI engineering. The site serves two purposes: a professional portfolio and a daily AI news newsletter.

**Live:** [marco-tech.se](https://marco-tech.se)

---

## Features

- **Portfolio** — profile, experience, skills, and contact at `/portfolio`
- **AI News** — daily curated AI news at `/ai-news` with category filtering and newsletter signup
- **Daily newsletter** — top 10 AI stories delivered by email at 07:00 CET via Resend
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
    A --> C["/ai-news"]
    B --> D["Hero · About · Experience · Skills · Contact"]
    C --> E["25 Articles · Category Filter"]
    C --> F["Newsletter Signup → /api/subscribe"]
    F --> G["Supabase + Resend"]
```

---

## Newsletter Pipeline

Runs every day at 05:00 UTC (07:00 CET) via GitHub Actions.

```mermaid
flowchart TD
    A["GitHub Actions\ncron: 0 5 * * *"] --> B["Fetch RSS Feeds\n18 sources"]
    B --> C["Filter via seen.json\n7-day deduplication"]
    C --> D["Claude Haiku 4.5\nRank · Categorize · Summarize"]
    D --> E["news.json\n25 articles with categories"]
    D --> F["Update seen.json\ncommit back to repo"]
    D --> H["Resend batch API\nTop 10 articles"]
    E --> G["Git commit\n→ Vercel auto-redeploy"]
    C2["Supabase\nactive subscribers"] --> H
    G --> I["/ai-news page\nlive within minutes"]
    H --> J["Subscribers\n07:00 CET"]
```

### Subscriber Signup Flow

```mermaid
sequenceDiagram
    participant V as Visitor
    participant S as /ai-news
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
    R-->>E: Next morning at 07:00 CET — daily AI news
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
| `RESEND_API_KEY` | GitHub Actions Secret + Vercel | Sending confirmation + newsletter emails |
| `SUPABASE_URL` | GitHub Actions Secret + Vercel | Subscriber database endpoint |
| `SUPABASE_SERVICE_KEY` | GitHub Actions Secret + Vercel | Server-side database access (service role) |

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
  confirmed_at timestamptz
);
```

---

## Project Structure

```
marcolundh/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # Home
│   ├── portfolio/page.tsx       # Portfolio
│   ├── ai-news/page.tsx         # AI News
│   ├── confirm/page.tsx         # Double opt-in confirmation
│   ├── unsubscribe/page.tsx     # Unsubscribe landing
│   └── api/
│       ├── subscribe/route.ts   # Newsletter signup endpoint
│       └── unsubscribe/route.ts # One-click unsubscribe (List-Unsubscribe)
├── components/
│   ├── Nav.tsx
│   ├── StatusCard.tsx           # Confirm / unsubscribe result UI
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Experience.tsx
│   ├── Skills.tsx
│   └── Contact.tsx
├── contexts/
│   └── LanguageContext.tsx
├── lib/
│   ├── translations.ts
│   ├── supabase.ts              # Server-side Supabase client
│   └── email.ts                 # Resend client + confirmation email
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
