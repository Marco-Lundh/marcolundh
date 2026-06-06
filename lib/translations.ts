export type Language = 'en' | 'sv'

export interface Stat {
  value: string
  label: string
}

export interface SkillCategory {
  label: string
  tags: string[]
}

export const translations = {
  en: {
    nav: {
      links: [
        { href: '#about', label: 'About' },
        { href: '#experience', label: 'Experience' },
        { href: '#skills', label: 'Skills' },
        { href: '#contact', label: 'Contact' },
      ],
    },
    hero: {
      greeting: 'Hello, world.',
      description:
        'I build reliable backends and AI-powered automation — integrating systems, APIs, and LLMs that actually work in production. Python specialist with',
      yearsExp: '13+ years',
      descriptionEnd: 'of experience.',
      linkedin: 'View LinkedIn ↗',
    },
    about: {
      section: '01. about me',
      heading: 'Who am I?',
      p1: "I'm a senior Python developer transitioning into AI engineering — combining 13 years of backend expertise with a growing focus on AI integration and automation. I'm particularly drawn to LLM integrations, AI agents, agentic workflows, and making AI work reliably in production — not just impressive in demos.",
      p2: "I genuinely enjoy making systems talk to each other — whether that's APIs, pipelines, or LLMs. I thrive in smaller, accountable teams where quality and end-user impact matter, and I bring a holistic perspective from design through deployment and support.",
      quote: 'A tight team can accomplish anything — it really is that simple.',
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
      body: "I'm currently open to new opportunities — ideally where full-stack Python skills and a serious interest in AI overlap. Let's talk.",
      linkedin: 'Connect on LinkedIn',
    },
    aiNews: {
      navHome: '← Home',
      label: 'daily ai news',
      heading: 'What matters in AI,',
      headingLine2: 'every morning.',
      subheading: '10 hand-picked stories — ranked by Claude, delivered at 07:00 CET.',
      browseText: 'Browse and filter by category below.',
      placeholder: 'your@email.com',
      subscribeButton: 'Subscribe',
      subscribingButton: 'Subscribing…',
      successTitle: "You're subscribed!",
      successBody: "You'll receive your first newsletter tomorrow morning at 07:00 CET.",
      errorText: 'Something went wrong — please try again.',
      disclaimer: 'Free · Unsubscribe anytime · No spam',
    },
  },
  sv: {
    nav: {
      links: [
        { href: '#about', label: 'Om mig' },
        { href: '#experience', label: 'Erfarenhet' },
        { href: '#skills', label: 'Kompetens' },
        { href: '#contact', label: 'Kontakt' },
      ],
    },
    hero: {
      greeting: 'Hello, world.',
      description:
        'Jag bygger pålitliga backends och AI-driven automation — integrerar system, APIer och LLMs som faktiskt fungerar i produktion. Python-specialist med',
      yearsExp: '13+ års',
      descriptionEnd: 'erfarenhet.',
      linkedin: 'Visa LinkedIn ↗',
    },
    about: {
      section: '01. om mig',
      heading: 'Vem är jag?',
      p1: 'Jag är en senior Python-utvecklare med inriktning mot AI-engineering — 13 års backend-erfarenhet kombinerat med ett växande fokus på AI-integration och automation. Jag dras särskilt till LLM-integrationer, AI-agenter, agentic workflows och att få AI att fungera pålitligt i produktion — inte bara imponera i demos.',
      p2: 'Jag trivs verkligen när system pratar med varandra — oavsett om det handlar om APIer, pipelines eller LLMs. Jag fungerar bäst i mindre, ansvarsfulla team där kvalitet och slutanvändarperspektiv spelar roll, och jag bidrar med ett helhetsperspektiv från design till driftsättning och support.',
      quote: 'Ett tight team kan åstadkomma vad som helst — det är verkligen så enkelt.',
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
      body: 'Jag är öppen för nya möjligheter — helst där full-stack Python-kompetens och ett seriöst intresse för AI möts. Hör av dig.',
      linkedin: 'Kontakta på LinkedIn',
    },
    aiNews: {
      navHome: '← Hem',
      label: 'dagliga ai-nyheter',
      heading: 'Det viktiga inom AI,',
      headingLine2: 'varje morgon.',
      subheading: '10 handplockade nyheter — rankade av Claude, levererade 07:00 CET.',
      browseText: 'Bläddra och filtrera efter kategori nedan.',
      placeholder: 'din@epost.se',
      subscribeButton: 'Prenumerera',
      subscribingButton: 'Prenumererar…',
      successTitle: 'Du prenumererar!',
      successBody: 'Du får ditt första nyhetsbrev imorgon morgon kl 07:00 CET.',
      errorText: 'Något gick fel — försök igen.',
      disclaimer: 'Gratis · Avprenumerera när som helst · Ingen spam',
    },
  },
}
