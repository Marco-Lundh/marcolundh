import { LanguageProvider } from '@/contexts/LanguageContext'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'

export const metadata = {
  title: 'Marco Lundh — Full-Stack Python Developer',
  description:
    'Full-stack Python developer with 13+ years of experience in FinTech, MedTech, and Telecom. Focused on AI integration and automation.',
}

export default function Portfolio() {
  return (
    <LanguageProvider>
      <main>
        <Nav />
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Contact />
      </main>
    </LanguageProvider>
  )
}
