import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { LanguageProvider } from '@/contexts/LanguageContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  metadataBase: new URL('https://marco-tech.se'),
  title: 'marco-tech.se',
  description:
    'A home for backend engineering and AI — built by Marco Lundh.',
  openGraph: {
    title: 'marco-tech.se',
    description: 'A home for backend engineering and AI — built by Marco Lundh.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${mono.variable} bg-[#0a0f1e] text-slate-100 antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
