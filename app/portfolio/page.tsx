import SiteNav from '@/components/SiteNav'
import ProjectShowcase from './ProjectShowcase'

export const metadata = {
  title: 'Marco Lundh — Portfolio & Projects',
  description:
    'Selected work by Marco Lundh — automated AI content pipelines, full-stack Python systems, and this bilingual Next.js site.',
}

export default function Portfolio() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <SiteNav />
      <ProjectShowcase />
    </main>
  )
}
