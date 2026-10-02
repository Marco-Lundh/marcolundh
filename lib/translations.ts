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
        'AI-native development, agentic workflows, and platform engineering - built by Marco Lundh.',
      portfolio: {
        label: 'Portfolio',
        description:
          'Projects I have designed, built, and shipped - from an AI monitoring platform to a fully automated daily AI news pipeline.',
        cta: 'View projects →',
      },
      about: {
        label: 'About me',
        description:
          'Fullstack and platform engineer at Doktor.se with 13+ years across FinTech, MedTech, and Telecom - with hands-on AI integration experience across the full development cycle.',
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
      p1: "I'm a fullstack and platform engineer with 13 years of software development experience and 20+ years in IT. I work across the full stack - from API design and Python backend to React/Next.js frontends and cloud on GCP/AWS - with documented experience from business-critical systems in fintech, medtech, and telecom.",
      p2: "Since August 2026 I work as a fullstack and platform engineer at Doktor.se, building digital healthcare across the product and the platform it runs on. On the side I keep building with AI - taking existing models and turning them into real products: autonomous agents, automation workflows, data pipelines that actually run in production. It's hands-on work. I ship solutions that work.",
      quote: 'A tight team can accomplish anything - it really is that simple.',
      stats: [
        { value: '13+', label: 'Years Python' },
        { value: '5', label: 'Industries' },
        { value: '8', label: 'Companies' },
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
      heading: "Let's connect",
      body: "I'm not looking for a new role - I'm happily building at Doktor.se. But I'm always up for a chat about AI, platform engineering, or an interesting side project.",
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
      showMore: 'Read more',
      showLess: 'Read less',
      prevImage: 'Previous image',
      nextImage: 'Next image',
      items: {
        pulsegraph: {
          label: 'project',
          title: 'PulseGraph',
          description: 'An AI-powered monitoring platform built around a simple idea: describe what you want to track in plain English, pick a data source, and let the system handle the rest. A scheduler dispatches polling agents that fetch new items from external APIs - Swedish job listings, parliamentary documents, EU energy market data - then run an LLM eval against your monitoring prompt and route matches via email, webhook, or the in-app dashboard. Runs locally with Ollama (llama3.1) as the default model, with Claude as an optional cloud fallback - keeping costs at zero by default. A built-in review queue lets you audit and correct AI decisions to improve future runs. The admin panel covers source health, per-run LLM cost tracking, prompt management, and user management.',
        },
        'ai-news': {
          label: 'project',
          title: 'AI News automation',
          description:
            'A fully automated daily pipeline: every morning it pulled from 18 RSS sources, had Claude Haiku rank, categorize and summarize the stories, and published the top picks to a live feed on this site - orchestrated by GitHub Actions and Vercel Cron. A morning email digest with in-house double opt-in over Resend and Supabase delivered the top 10 to subscribers. The project is paused for now; the screenshots show it as it ran.',
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
      subheading: "Today's top stories - ranked and summarized by Claude, refreshed every morning.",
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
        'AI-native utveckling, agentiska arbetsflöden och plattformsutveckling - byggt av Marco Lundh.',
      portfolio: {
        label: 'Portfolio',
        description:
          'Projekt jag har designat, byggt och levererat - från en AI-driven monitoringsplattform till en helt automatiserad daglig AI-nyhetspipeline.',
        cta: 'Visa projekt →',
      },
      about: {
        label: 'Om mig',
        description:
          'Fullstack- och plattformsingenjör på Doktor.se med 13+ års erfarenhet inom FinTech, MedTech och Telekom - med praktisk erfarenhet av AI-integration genom hela utvecklingscykeln.',
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
      p1: 'Jag är fullstack- och plattformsingenjör med 13 års erfarenhet av systemutveckling och 20+ år inom IT. Jag arbetar i hela stacken - från API-design och Python-backend till React/Next.js-gränssnitt och molndrift på GCP/AWS - med dokumenterad erfarenhet från affärskritiska system inom fintech, medtech och telekom.',
      p2: 'Sedan augusti 2026 jobbar jag som fullstack- och plattformsingenjör på Doktor.se, där jag bygger digital vård - både i produkten och i plattformen den körs på. Vid sidan av fortsätter jag bygga med AI - att ta befintliga modeller och göra konkreta produkter av dem: autonoma agenter, automationsflöden, datapipelines som faktiskt körs i produktion. Det är praktiskt arbete. Jag skeppar lösningar som fungerar.',
      quote: 'Ett tight team kan åstadkomma vad som helst - det är verkligen så enkelt.',
      stats: [
        { value: '13+', label: 'År Python' },
        { value: '5', label: 'Branscher' },
        { value: '8', label: 'Bolag' },
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
      heading: 'Låt oss höras',
      body: 'Jag söker inga nya roller - jag trivs med att bygga på Doktor.se. Men jag är alltid på för ett samtal om AI, plattformsutveckling eller ett spännande sidoprojekt.',
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
      showMore: 'Läs mer',
      showLess: 'Visa mindre',
      prevImage: 'Föregående bild',
      nextImage: 'Nästa bild',
      items: {
        pulsegraph: {
          label: 'projekt',
          title: 'PulseGraph',
          description: 'En AI-driven monitoringsplattform byggd kring en enkel idé: beskriv vad du vill bevaka på naturligt språk, välj datakälla och låt systemet sköta resten. En scheduler skickar ut polling-agenter som hämtar nya objekt från externa API:er - svenska jobbannonser, riksdagsdokument, europeisk energimarknadsdata - kör sedan en LLM-eval mot din övervakningsprompt och levererar träffar via e-post, webhook eller in-app-dashboarden. Körs lokalt med Ollama (llama3.1) som standardmodell, med Claude som valfri molnfallback - vilket håller kostnaden på noll som standard. En inbyggd granskningskö låter dig auditgranska och korrigera AI-beslut för att förbättra framtida körningar. Adminpanelen täcker källhälsa, LLM-kostnadsspårning per körning, prompthantering och användarhantering.',
        },
        'ai-news': {
          label: 'projekt',
          title: 'AI News automation',
          description:
            'En helt automatiserad daglig pipeline: varje morgon hämtade den från 18 RSS-källor, lät Claude Haiku ranka, kategorisera och sammanfatta nyheterna och publicerade de bästa i ett live-flöde här på sajten - orkestrerat av GitHub Actions och Vercel Cron. Ett morgonnyhetsbrev med egen double opt-in via Resend och Supabase levererade topp 10 till prenumeranterna. Projektet är pausat tills vidare; skärmdumparna visar hur det såg ut när det var igång.',
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
      subheading: 'Dagens viktigaste nyheter - rankade och sammanfattade av Claude, uppdaterade varje morgon.',
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
