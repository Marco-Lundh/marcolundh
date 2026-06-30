import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { LanguageProvider } from '@/contexts/LanguageContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  metadataBase: new URL('https://marco-tech.se'),
  title: 'marco-tech.se',
  description:
    'A home for backend engineering and AI - built by Marco Lundh.',
  openGraph: {
    title: 'marco-tech.se',
    description: 'A home for backend engineering and AI - built by Marco Lundh.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${display.variable} ${mono.variable} font-sans bg-bg text-ink antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
