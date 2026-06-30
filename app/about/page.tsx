import SiteNav from '@/components/SiteNav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import AskAI from '@/components/AskAI'

export const metadata = {
  title: 'Marco Lundh - About & CV',
  description:
    'Senior fullstack and backend developer with 13+ years across FinTech, MedTech, and Telecom - working across the full stack with hands-on AI integration experience.',
}

export default function AboutPage() {
  return (
    <main>
      <SiteNav />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Contact />
      <AskAI />
    </main>
  )
}
