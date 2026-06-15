'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface Job {
  company: string
  role: string
  period: string
  industry: string
  description: string
  bullets?: string[]
  stack: string[]
}

const jobs: Job[] = [
  {
    company: 'Brite Payments AB',
    role: 'Senior Python Developer',
    period: 'May 2024 – March 2026',
    industry: 'FinTech',
    description:
      'Backend developer in a team building fast, secure account-to-account payment solutions. Worked on large-scale commercial backend systems with event-driven architecture, API integrations, and automated data pipelines. Used prompt engineering for architecture exploration and code generation.',
    stack: [
      'Python', 'FastAPI', 'React', 'GCP', 'Cloud Run', 'BigQuery',
      'Terraform', 'Docker', 'Kubernetes', 'gRPC', 'Protobuf', 'OAuth2.0', 'JWT', 'CI/CD',
    ],
  },
  {
    company: 'Sigma Technology Systems AB',
    role: 'Senior Python Developer (Consultant)',
    period: 'March 2022 – May 2024',
    industry: 'IT Consulting',
    description: 'Deployed at two clients as a senior consultant:',
    bullets: [
      'NIRA Dynamics — Road Perception team (15 people). Vehicle-based environment sensing systems, development and operations.',
      'Ericsson — Agile Scrum team automating delivery of networks, storage, and hardware (LabOps). Built Python integrations with multiple APIs (incl. Jira) and developed a new configuration management service.',
    ],
    stack: [
      'Python', 'Flask', 'JavaScript', 'REST APIs', 'PostgreSQL', 'SQLite',
      'Docker', 'Kubernetes', 'GitOps', 'Airflow', 'GitHub Actions', 'CI/CD',
    ],
  },
  {
    company: 'ContextVision AB',
    role: 'Software Developer',
    period: 'February 2009 – February 2022',
    industry: 'MedTech AI · 13 years',
    description:
      'Grew from IT Administrator to Software Developer at a medical imaging AI company (deep learning, prostate cancer detection). On own initiative, built a delivery and license management tool that later became the foundation for the company\'s current tool. Responsible for business-critical systems: Customer Portal and Package & Delivery. Built integrations with Microsoft Dynamics 365 Business Central, Hogia, and FileZilla. Key technical role in the INIFY Prostate AI project — technical decisions, cost optimization, and cross-project synergies.',
    stack: [
      'Python', 'Flask', 'SQLAlchemy', 'Celery', 'Elasticsearch',
      'React', 'MySQL', 'AWS', 'Apache', 'Prometheus', 'Grafana', 'CI/CD',
    ],
  },
  {
    company: 'Östgötatrafiken AB',
    role: 'IT Technician',
    period: 'May 2006 – May 2009',
    industry: 'Public Transport',
    description:
      'Operations and support for real-time systems and client environments. Contributed to requirements for system improvements and participated in the redesign of real-time displays for increased efficiency and usability.',
    stack: ['IT ops', 'Real-time systems', 'Linux', 'Client support'],
  },
  {
    company: 'Nokia Home Communications & earlier',
    role: 'Tester / Developer / Graphic Assistant',
    period: '1998 – 2006',
    industry: 'Telecom · Retail',
    description:
      'Multiple roles at Nokia (test automation, interactive UI prototype development, graphical assets), User Interface Design AB (EU project, Nokia Set-Top-box testing), and IKEA (IT operations, server/client/sales system management).',
    stack: ['C/C++', 'Java', 'Lingo', 'Macromedia Director', 'Photoshop', 'Visual Studio'],
  },
]

function ExperienceItem({ job, index }: { job: Job; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative pl-8 pb-10 border-l border-ink/15 last:border-l-0 last:pb-0"
    >
      {/* Timeline dot */}
      <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-bg" />

      <button
        className="w-full text-left group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`job-details-${index}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-accent-dark text-xs uppercase tracking-wider">
              {job.industry}
            </span>
            <h3 className="font-display tracking-tight text-lg font-semibold text-ink group-hover:text-accent-dark transition-colors mt-0.5">
              {job.company}
            </h3>
            <p className="text-ink-muted text-sm mt-0.5">
              {job.role} · {job.period}
            </p>
          </div>
          <span className="text-ink-muted text-lg mt-1 shrink-0 group-hover:text-accent-dark transition-colors">
            {open ? '−' : '+'}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={`job-details-${index}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-3">
              <p className="text-ink-muted text-sm leading-relaxed">{job.description}</p>
              {job.bullets && (
                <ul className="space-y-2">
                  {job.bullets.map((b, i) => (
                    <li key={i} className="text-ink-muted text-sm flex gap-2">
                      <span className="text-accent-dark shrink-0 mt-0.5">▹</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                {job.stack.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-mono bg-accent/12 text-accent-dark px-2 py-0.5 rounded border border-accent/25"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Experience() {
  const { t } = useLanguage()

  return (
    <section id="experience" className="py-24 px-6 bg-surface-2">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="font-display tracking-tight text-3xl font-bold text-ink">{t.experience.heading}</h2>
        </motion.div>

        <div>
          {jobs.map((job, i) => (
            <ExperienceItem key={job.company} job={job} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
