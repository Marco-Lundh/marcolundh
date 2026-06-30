export type Language = 'en' | 'sv'

export interface Stat {
  value: string
  label: string
}

export interface SkillCategory {
  label: string
  tags: string[]
}

const translationsData = {
  en: {
    common: {
      // Always describes switching to the *other* language, in the current one.
      langToggle: 'Switch to Swedish',
      emailLabel: 'Email address',
    },
    home: {
      heading: 'AI Engineering & Automation',
      subtitle:
        'AI-native development, agentic workflows, and daily AI news - built by Marco Lundh.',
      portfolio: {
        label: 'Portfolio',
        description:
          'Projects I have designed, built, and shipped - including a live, fully automated daily AI news pipeline you can try right here.',
        cta: 'View projects →',
      },
      about: {
        label: 'About me',
        description:
          'Senior fullstack and backend developer with 13+ years across FinTech, MedTech, and Telecom - with hands-on AI integration experience across the full development cycle.',
        cta: 'Read my story →',
      },
    },
    hero: {
      greeting: 'Hello, world.',
      description:
        'I build and ship full-stack solutions - Python backends, React/Next.js frontends, and cloud on GCP/AWS. Hands-on experience integrating AI into production systems. Software developer with',
      yearsExp: '13+ years',
      descriptionEnd: 'of experience.',
      linkedin: 'View LinkedIn ↗',
    },
    about: {
      section: '01. about me',
      heading: 'Who am I?',
      p1: "I'm a senior fullstack and backend developer with 13 years of software development experience and 20+ years in IT. I work across the full stack - from API design and Python backend to React/Next.js frontends and cloud on GCP/AWS - with documented experience from business-critical systems in fintech, medtech, and telecom.",
      p2: "What I'm looking for is an AI Engineer role. That means taking existing models and building real products on top of them - a chatbot, an intelligent search system, an autonomous agent, an automation workflow, a data pipeline that actually runs in production. It's a hands-on job. I ship solutions that work.",
      quote: 'A tight team can accomplish anything - it really is that simple.',
      stats: [
        { value: '13+', label: 'Years Python' },
        { value: '5', label: 'Industries' },
        { value: '7', label: 'Companies' },
        { value: '2', label: 'Languages' },
      ] satisfies Stat[],
    },
    experience: {
      section: '02. experience',
      heading: "Where I've worked",
    },
    skills: {
      section: '03. skills',
      heading: 'What I work with',
      categories: [
        {
          label: 'AI & Automation',
          tags: ['LLM Integration', 'OpenAI API', 'Anthropic API', 'LangChain', 'RAG', 'Vector Databases', 'Prompt Engineering', 'AI Agents', 'Airflow', 'Celery'],
        },
        {
          label: 'Frameworks & Databases',
          tags: ['FastAPI', 'Flask', 'SQLAlchemy', 'React', 'Bootstrap', 'PostgreSQL', 'MySQL', 'Elasticsearch', 'Django'],
        },
        {
          label: 'Cloud & Infrastructure',
          tags: ['Google Cloud Platform', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'Nginx', 'Apache'],
        },
        {
          label: 'Tools & Methods',
          tags: ['Git', 'CI/CD', 'Scrum', 'Agile', 'Unit testing', 'E2E testing', 'gRPC', 'OAuth2.0', 'JWT', 'Grafana', 'Prometheus'],
        },
      ] satisfies SkillCategory[],
    },
    contact: {
      section: '04. contact',
      heading: "Let's work together",
      body: "I'm currently open to new opportunities - ideally where full-stack skills and a serious interest in AI overlap. Let's talk.",
      linkedin: 'Connect on LinkedIn',
    },
    projects: {
      label: 'portfolio',
      heading: 'Selected work',
      intro:
        'Things I have designed, built, and shipped end-to-end - from automated content pipelines to this very site.',
      liveDemo: 'Live demo',
      openFeed: 'Open the full feed →',
      tryDemo: '← Try the live demo',
      viewCode: 'View code →',
      enlarge: 'Enlarge',
      showImage: 'Show',
      screenshot: 'screenshot',
      items: {
        'ai-news': {
          label: 'live project',
          title: 'AI News automation',
          description:
            'A fully automated daily pipeline: it pulls from 18 RSS sources, then ranks, categorizes and summarizes the stories with Claude Haiku. The top picks are published to a live feed and delivered as a morning email digest - orchestrated by GitHub Actions and Vercel Cron, with in-house double opt-in over Resend and Supabase.',
        },
        'job-radar': {
          label: 'project',
          title: 'Job Radar',
          description:
            'An AI-assisted job-hunting workspace built on a multi-agent pipeline. One agent scrapes and ranks listings against your profile; a second scores your CV fit with concrete strengths, gaps, and next steps; a third drafts a tailored, language-aware cover letter. Powered by Pydantic AI + Groq with SSE streaming, and it runs entirely locally - everything stored as JSON, no database.',
        },
        'cv-fit-score': {
          label: 'project',
          title: 'CV Fit Score',
          description:
            'Paste your CV and a job posting URL and get an honest, AI-powered fit analysis in seconds. It parses the posting and your CV (PDF or plain text) and returns matched strengths, missing requirements, and an overall verdict - in English or Swedish.',
        },
        docuchat: {
          label: 'project',
          title: 'DocuChat',
          description:
            'A retrieval-augmented chat tool for your own documents. It ingests a set of PDFs, builds local embeddings, and answers questions grounded strictly in their content - so replies stay accurate and cite the source material rather than hallucinating.',
        },
      },
    },
    aiNews: {
      label: 'daily ai news',
      heading: 'What matters in AI,',
      headingLine2: 'every morning.',
      subheading: '10 hand-picked stories - ranked by Claude, delivered every morning.',
      browseText: 'Browse and filter by category below.',
      placeholder: 'your@email.com',
      subscribeButton: 'Subscribe',
      subscribingButton: 'Subscribing…',
      successTitle: 'Almost there - check your inbox',
      successBody: 'We sent you a confirmation link. Click it to start receiving the daily newsletter.',
      errorText: 'Something went wrong - please try again.',
      disclaimer: 'Free · Unsubscribe anytime · No spam',
    },
    confirm: {
      confirmed: {
        title: "You're subscribed!",
        body: "You'll receive the daily AI newsletter every morning.",
      },
      already: {
        title: 'Already confirmed',
        body: 'Your subscription is already active. See you in your inbox tomorrow morning.',
      },
      invalid: {
        title: 'Invalid or expired link',
        body: 'This confirmation link is no longer valid. Try subscribing again.',
      },
    },
    unsubscribe: {
      prompt: {
        title: 'Unsubscribe',
        body: 'Click below to stop receiving the daily AI newsletter.',
        button: 'Unsubscribe',
        loading: 'Unsubscribing…',
      },
      unsubscribed: {
        title: "You're unsubscribed",
        body: "You won't receive the newsletter anymore. You can resubscribe anytime.",
      },
      already: {
        title: 'Already unsubscribed',
        body: 'This email is no longer subscribed to the newsletter.',
      },
      invalid: {
        title: 'Invalid link',
        body: 'This unsubscribe link is not valid.',
      },
    },
    askAI: {
      heading: 'Ask AI About Me',
      tooltipDefault: 'Opens with the prompt pre-filled',
      tooltipGemini: 'Copies the prompt - just paste it in Gemini',
      tooltipGeminiCopied: 'Prompt copied! Paste it in Gemini.',
    },
  },
  sv: {
    common: {
      langToggle: 'Byt till engelska',
      emailLabel: 'E-postadress',
    },
    home: {
      heading: 'AI-utveckling & Automation',
      subtitle:
        'AI-native utveckling, agentiska arbetsflöden och dagliga AI-nyheter - byggt av Marco Lundh.',
      portfolio: {
        label: 'Portfolio',
        description:
          'Projekt jag har designat, byggt och levererat - inklusive en live, helt automatiserad daglig AI-nyhetspipeline som du kan testa direkt här.',
        cta: 'Visa projekt →',
      },
      about: {
        label: 'Om mig',
        description:
          'Senior fullstack- och backendutvecklare med 13+ års erfarenhet inom FinTech, MedTech och Telekom - med praktisk erfarenhet av AI-integration genom hela utvecklingscykeln.',
        cta: 'Läs min historia →',
      },
    },
    hero: {
      greeting: 'Hello, world.',
      description:
        'Jag bygger och levererar fullstack-lösningar - Python-backends, React/Next.js-gränssnitt och molndrift på GCP/AWS. Praktisk erfarenhet av att integrera AI i produktionssystem. Systemutvecklare med',
      yearsExp: '13+ års',
      descriptionEnd: 'erfarenhet.',
      linkedin: 'Visa LinkedIn ↗',
    },
    about: {
      section: '01. om mig',
      heading: 'Vem är jag?',
      p1: 'Jag är en senior fullstack- och backendutvecklare med 13 års erfarenhet av systemutveckling och 20+ år inom IT. Jag arbetar i hela stacken - från API-design och Python-backend till React/Next.js-gränssnitt och molndrift på GCP/AWS - med dokumenterad erfarenhet från affärskritiska system inom fintech, medtech och telekom.',
      p2: 'Det jag söker är en AI Engineer-roll. Det handlar om att ta befintliga modeller och bygga konkreta produkter på dem - en chatbot, ett intelligent söksystem, en autonom agent, ett automationsflöde, en datapipeline som faktiskt körs i produktion. Det är ett praktiskt jobb. Jag skeppar lösningar som fungerar.',
      quote: 'Ett tight team kan åstadkomma vad som helst - det är verkligen så enkelt.',
      stats: [
        { value: '13+', label: 'År Python' },
        { value: '5', label: 'Branscher' },
        { value: '7', label: 'Bolag' },
        { value: '2', label: 'Språk' },
      ] satisfies Stat[],
    },
    experience: {
      section: '02. erfarenhet',
      heading: 'Var jag har jobbat',
    },
    skills: {
      section: '03. kompetens',
      heading: 'Vad jag jobbar med',
      categories: [
        {
          label: 'AI & Automation',
          tags: ['LLM Integration', 'OpenAI API', 'Anthropic API', 'LangChain', 'RAG', 'Vector Databases', 'Prompt Engineering', 'AI Agents', 'Airflow', 'Celery'],
        },
        {
          label: 'Ramverk & Databaser',
          tags: ['FastAPI', 'Flask', 'SQLAlchemy', 'React', 'Bootstrap', 'PostgreSQL', 'MySQL', 'Elasticsearch', 'Django'],
        },
        {
          label: 'Moln & Infrastruktur',
          tags: ['Google Cloud Platform', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'Nginx', 'Apache'],
        },
        {
          label: 'Verktyg & Metoder',
          tags: ['Git', 'CI/CD', 'Scrum', 'Agile', 'Unit testing', 'E2E testing', 'gRPC', 'OAuth2.0', 'JWT', 'Grafana', 'Prometheus'],
        },
      ] satisfies SkillCategory[],
    },
    contact: {
      section: '04. kontakt',
      heading: 'Låt oss jobba ihop',
      body: 'Jag är öppen för nya möjligheter - helst där full-stack-kompetens och ett seriöst intresse för AI möts. Hör av dig.',
      linkedin: 'Kontakta på LinkedIn',
    },
    projects: {
      label: 'portfolio',
      heading: 'Utvalda projekt',
      intro:
        'Saker jag har designat, byggt och levererat hela vägen - från automatiska innehållspipelines till den här sajten.',
      liveDemo: 'Live-demo',
      openFeed: 'Öppna hela flödet →',
      tryDemo: '← Testa live-demon',
      viewCode: 'Visa kod →',
      enlarge: 'Förstora',
      showImage: 'Visa',
      screenshot: 'skärmdump',
      items: {
        'ai-news': {
          label: 'live-projekt',
          title: 'AI News automation',
          description:
            'En helt automatiserad daglig pipeline: den hämtar från 18 RSS-källor och låter sedan Claude Haiku ranka, kategorisera och sammanfatta nyheterna. De bästa publiceras i ett live-flöde och skickas som ett morgonnyhetsbrev - orkestrerat av GitHub Actions och Vercel Cron, med egen double opt-in via Resend och Supabase.',
        },
        'job-radar': {
          label: 'projekt',
          title: 'Job Radar',
          description:
            'En AI-assisterad arbetsyta för jobbsök byggd på en multi-agent-pipeline. En agent hämtar och rankar annonser mot din profil; en andra poängsätter hur väl ditt CV matchar med konkreta styrkor, luckor och nästa steg; en tredje skriver ett skräddarsytt, språkanpassat personligt brev. Drivs av Pydantic AI + Groq med SSE-streaming och körs helt lokalt - allt sparas som JSON, ingen databas.',
        },
        'cv-fit-score': {
          label: 'projekt',
          title: 'CV Fit Score',
          description:
            'Klistra in ditt CV och en länk till en jobbannons och få en ärlig, AI-driven matchningsanalys på några sekunder. Den tolkar annonsen och ditt CV (PDF eller text) och returnerar matchade styrkor, saknade krav och ett helhetsomdöme - på svenska eller engelska.',
        },
        docuchat: {
          label: 'projekt',
          title: 'DocuChat',
          description:
            'Ett RAG-verktyg för dina egna dokument. Det läser in en uppsättning PDF:er, bygger lokala embeddings och svarar på frågor strikt utifrån innehållet - så att svaren förblir korrekta och hänvisar till källmaterialet i stället för att hallucinera.',
        },
      },
    },
    aiNews: {
      label: 'dagliga ai-nyheter',
      heading: 'Det viktiga inom AI,',
      headingLine2: 'varje morgon.',
      subheading: '10 handplockade nyheter - rankade av Claude, levererade varje morgon.',
      browseText: 'Bläddra och filtrera efter kategori nedan.',
      placeholder: 'din@epost.se',
      subscribeButton: 'Prenumerera',
      subscribingButton: 'Prenumererar…',
      successTitle: 'Nästan klart - kolla din inkorg',
      successBody: 'Vi har skickat en bekräftelselänk. Klicka på den för att börja få det dagliga nyhetsbrevet.',
      errorText: 'Något gick fel - försök igen.',
      disclaimer: 'Gratis · Avprenumerera när som helst · Ingen spam',
    },
    confirm: {
      confirmed: {
        title: 'Du prenumererar!',
        body: 'Du får det dagliga AI-nyhetsbrevet varje morgon.',
      },
      already: {
        title: 'Redan bekräftad',
        body: 'Din prenumeration är redan aktiv. Vi ses i inkorgen imorgon bitti.',
      },
      invalid: {
        title: 'Ogiltig eller utgången länk',
        body: 'Den här bekräftelselänken är inte längre giltig. Prova att prenumerera igen.',
      },
    },
    unsubscribe: {
      prompt: {
        title: 'Avregistrera',
        body: 'Klicka nedan för att sluta få det dagliga AI-nyhetsbrevet.',
        button: 'Avregistrera',
        loading: 'Avregistrerar…',
      },
      unsubscribed: {
        title: 'Du är avregistrerad',
        body: 'Du får inte nyhetsbrevet längre. Du kan prenumerera igen när som helst.',
      },
      already: {
        title: 'Redan avregistrerad',
        body: 'Den här e-postadressen prenumererar inte längre på nyhetsbrevet.',
      },
      invalid: {
        title: 'Ogiltig länk',
        body: 'Den här avregistreringslänken är inte giltig.',
      },
    },
    askAI: {
      heading: 'Fråga AI om mig',
      tooltipDefault: 'Öppnar med prompten ifylld',
      tooltipGemini: 'Kopierar prompten - klistra in den i Gemini',
      tooltipGeminiCopied: 'Prompt kopierad! Klistra in den i Gemini.',
    },
  },
}

// English is the canonical shape. Annotating the export forces every locale to
// expose the exact same keys - a missing translation becomes a compile error
// instead of an `undefined` rendered silently at runtime.
type TranslationTree = (typeof translationsData)['en']

export const translations: Record<Language, TranslationTree> = translationsData
