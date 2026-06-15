import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'

export const metadata = {
  title: 'Marco Lundh — About & CV',
  description:
    'Senior fullstack and backend developer with 13+ years across FinTech, MedTech, and Telecom — working across the full stack with hands-on AI integration experience.',
}

export default function AboutPage() {
  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Contact />
    </main>
  )
}
