'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import SubscribeForm from '../ai-news/SubscribeForm'

// State passed to the lightbox: the full image list for a project plus which index is open.
interface ZoomState {
  images: string[]
  active: number
  title: string
}

// Language-neutral project data. Translatable copy (label/title/description)
// lives in lib/translations.ts under projects.items, keyed by `slug`.
interface ProjectMeta {
  slug: 'pulsegraph' | 'ai-news' | 'job-radar' | 'cv-fit-score' | 'docuchat'
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
    slug: 'pulsegraph',
    stack: ['LangGraph', 'Ollama', 'Claude', 'Python', 'FastAPI', 'React', 'Vite', 'PostgreSQL', 'Redis', 'Docker'],
    images: shots('pulsegraph', 15),
  },
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
  onZoom: (state: ZoomState) => void
}) {
  const { t } = useLanguage()
  const tr = t.projects
  const [active, setActive] = useState(0)
  if (images.length === 0) return null

  // Accessible, translated description, e.g. "Job Radar screenshot 1".
  const describe = (i: number) => `${title} ${tr.screenshot} ${i + 1}`

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
        <div className="relative">
          <button
            onClick={() => onZoom({ images, active, title })}
            aria-label={`${tr.enlarge} ${describe(active)}`}
            className="block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[active]} alt={describe(active)} loading="lazy" className="w-full block" />
          </button>
          {active > 0 && (
            <button
              onClick={() => setActive(active - 1)}
              aria-label={tr.prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center text-lg leading-none transition-colors"
            >
              ‹
            </button>
          )}
          {active < images.length - 1 && (
            <button
              onClick={() => setActive(active + 1)}
              aria-label={tr.nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center text-lg leading-none transition-colors"
            >
              ›
            </button>
          )}
        </div>
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
  onZoom: (state: ZoomState) => void
}) {
  const { t } = useLanguage()
  const tr = t.projects
  const copy = tr.items[project.slug]
  const imageFirst = index % 2 === 0
  const [descExpanded, setDescExpanded] = useState(false)
  const isLongDesc = copy.description.length > 200

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
        <div>
          <p className={`text-ink-muted text-sm leading-relaxed ${!descExpanded && isLongDesc ? 'line-clamp-3' : ''}`}>
            {copy.description}
          </p>
          {isLongDesc && (
            <button
              onClick={() => setDescExpanded(!descExpanded)}
              aria-expanded={descExpanded}
              className="text-accent-dark text-xs font-medium hover:underline mt-1.5 block"
            >
              {descExpanded ? tr.showLess : tr.showMore}
            </button>
          )}
        </div>
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

function Lightbox({ zoom, onClose }: { zoom: ZoomState | null; onClose: () => void }) {
  const { t } = useLanguage()
  const tr = t.projects
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (zoom != null) setActive(zoom.active)
  }, [zoom])

  useEffect(() => {
    if (!zoom) return
    containerRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setActive(a => Math.max(0, a - 1))
      if (e.key === 'ArrowRight') setActive(a => Math.min(zoom.images.length - 1, a + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom, onClose])

  const src = zoom ? zoom.images[active] : ''
  const alt = zoom ? `${zoom.title} ${tr.screenshot} ${active + 1}` : ''

  return (
    <AnimatePresence>
      {zoom && (
        <motion.div
          ref={containerRef}
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out outline-none"
        >
          {active > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setActive(a => a - 1) }}
              aria-label={tr.prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center text-2xl leading-none transition-colors"
            >
              ‹
            </button>
          )}
          {/* Lightbox sits on a dark backdrop, so the light border stays for contrast. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.92 }}
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] rounded-xl border border-white/10 shadow-2xl"
          />
          {active < zoom.images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setActive(a => a + 1) }}
              aria-label={tr.nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center text-2xl leading-none transition-colors"
            >
              ›
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ProjectShowcase() {
  const { t } = useLanguage()
  const tr = t.projects
  const [zoom, setZoom] = useState<ZoomState | null>(null)

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

      <Lightbox zoom={zoom} onClose={() => setZoom(null)} />
    </section>
  )
}
