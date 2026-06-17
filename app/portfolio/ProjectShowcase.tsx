'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import SubscribeForm from '../ai-news/SubscribeForm'

// A zoomable image: the file plus an accessible, already-translated description.
interface ProjectImage {
  src: string
  alt: string
}

// Language-neutral project data. Translatable copy (label/title/description)
// lives in lib/translations.ts under projects.items, keyed by `slug`.
interface ProjectMeta {
  slug: 'ai-news' | 'job-radar' | 'cv-fit-score' | 'docuchat'
  stack: string[]
  images: string[]
  repo?: string
  embedLiveDemo?: boolean
}

// Build the screenshot paths for a project folder under public/projects/<slug>/.
const shots = (slug: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => `/projects/${slug}/${i + 1}.png`)

// Drop new screenshots into public/projects/<slug>/ and bump the shots() count —
// no other code change required.
const GITHUB = 'https://github.com/Marco-Lundh'
const projectMeta: ProjectMeta[] = [
  {
    slug: 'ai-news',
    stack: ['Python', 'Claude Haiku', 'GitHub Actions', 'Vercel Cron', 'Resend', 'Supabase', 'Next.js'],
    images: [],
    embedLiveDemo: true,
    repo: `${GITHUB}/marcolundh`,
  },
  {
    slug: 'job-radar',
    stack: ['Python', 'FastAPI', 'Pydantic AI', 'Groq', 'SSE streaming', 'HTMX / Alpine.js'],
    images: shots('job-radar', 9),
    repo: `${GITHUB}/job-radar`,
  },
  {
    slug: 'cv-fit-score',
    stack: ['Python', 'FastAPI', 'Groq', 'pdfplumber', 'Docker', 'Kubernetes'],
    images: shots('cv-fit-score', 4),
    repo: `${GITHUB}/cv-fit-score`,
  },
  {
    slug: 'docuchat',
    stack: ['Python', 'RAG', 'FAISS', 'Sentence Transformers', 'Groq', 'PyMuPDF'],
    images: shots('docuchat', 1),
    repo: `${GITHUB}/docuchat`,
  },
]

const stackTagClass =
  'text-xs font-mono bg-accent/12 text-accent-dark px-2 py-0.5 rounded border border-accent/25'

function StackTags({ stack }: { stack: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {stack.map((s) => (
        <span key={s} className={stackTagClass}>
          {s}
        </span>
      ))}
    </div>
  )
}

/* Browser frame + thumbnail grid. The grid hides itself for a single image. */
function ProjectGallery({
  images,
  title,
  onZoom,
}: {
  images: string[]
  title: string
  onZoom: (img: ProjectImage) => void
}) {
  const { t } = useLanguage()
  const tr = t.projects
  const [active, setActive] = useState(0)
  if (images.length === 0) return null

  // Accessible, translated description, e.g. "Job Radar screenshot 1".
  const describe = (i: number) => `${title} ${tr.screenshot} ${i + 1}`
  const current: ProjectImage = { src: images[active], alt: describe(active) }

  return (
    <div>
      <div className="rounded-xl overflow-hidden border border-ink/15 bg-surface shadow-lg">
        <div
          className="flex items-center gap-2 px-4 h-9 bg-surface-2 border-b border-ink/10"
          aria-hidden="true"
        >
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <button
          onClick={() => onZoom(current)}
          aria-label={`${tr.enlarge} ${current.alt}`}
          className="block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.src} alt={current.alt} loading="lazy" className="w-full block" />
        </button>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-4">
          {images.map((src, i) => {
            const alt = describe(i)
            return (
              <button
                key={src}
                onClick={() => setActive(i)}
                aria-label={`${tr.showImage} ${alt}`}
                aria-pressed={i === active}
                className={`rounded-md overflow-hidden border transition-all ${
                  i === active
                    ? 'border-accent ring-2 ring-accent/30'
                    : 'border-ink/15 opacity-50 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  loading="lazy"
                  className="w-full block aspect-video object-cover"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function LiveDemoPanel() {
  const { t } = useLanguage()
  const tr = t.projects
  return (
    <div className="bg-surface border border-accent/20 rounded-xl p-6 shadow-lg">
      <p className="font-mono text-[10px] uppercase tracking-widest text-accent-dark mb-4">
        {tr.liveDemo}
      </p>
      <SubscribeForm compact />
      <Link
        href="/ai-news"
        className="inline-block mt-5 text-sm text-accent-dark hover:translate-x-1 transition-transform duration-200"
      >
        {tr.openFeed}
      </Link>
    </div>
  )
}

function ProjectRow({
  project,
  index,
  onZoom,
}: {
  project: ProjectMeta
  index: number
  onZoom: (img: ProjectImage) => void
}) {
  const { t } = useLanguage()
  const tr = t.projects
  const copy = tr.items[project.slug]
  const imageFirst = index % 2 === 0

  const media = project.images.length > 0 ? (
    <ProjectGallery images={project.images} title={copy.title} onZoom={onZoom} />
  ) : project.embedLiveDemo ? (
    <LiveDemoPanel />
  ) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center"
    >
      <div className={imageFirst ? 'lg:order-1' : 'lg:order-2'}>{media}</div>

      <div className={`space-y-4 ${imageFirst ? 'lg:order-2' : 'lg:order-1'}`}>
        <span className="font-mono text-accent-dark text-xs uppercase tracking-wider">
          {copy.label}
        </span>
        <h3 className="font-display tracking-tight text-2xl font-semibold text-ink">{copy.title}</h3>
        <p className="text-ink-muted text-sm leading-relaxed">{copy.description}</p>
        {project.embedLiveDemo && (
          <p className="text-sm font-medium text-accent-dark">{tr.tryDemo}</p>
        )}
        <StackTags stack={project.stack} />

        {project.repo && (
          <div className="pt-1">
            <Link
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent-dark hover:translate-x-1 inline-block transition-transform duration-200"
            >
              {tr.viewCode}
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function Lightbox({
  image,
  onClose,
}: {
  image: ProjectImage | null
  onClose: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!image) return
    containerRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [image, onClose])

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          ref={containerRef}
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out outline-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* Lightbox sits on a dark backdrop, so the light border stays for contrast. */}
          <motion.img
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.92 }}
            src={image.src}
            alt={image.alt}
            className="max-h-[90vh] max-w-[90vw] rounded-xl border border-white/10 shadow-2xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ProjectShowcase() {
  const { t } = useLanguage()
  const tr = t.projects
  const [zoom, setZoom] = useState<ProjectImage | null>(null)

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="font-mono text-accent-dark text-sm tracking-widest uppercase mb-3">
            {tr.label}
          </p>
          <h1 className="font-display tracking-tight text-3xl md:text-4xl font-bold text-ink mb-3">{tr.heading}</h1>
          <p className="text-ink-muted max-w-2xl leading-relaxed">{tr.intro}</p>
        </motion.div>

        <div className="space-y-24">
          {projectMeta.map((project, i) => (
            <ProjectRow key={project.slug} project={project} index={i} onZoom={setZoom} />
          ))}
        </div>
      </div>

      <Lightbox image={zoom} onClose={() => setZoom(null)} />
    </section>
  )
}
