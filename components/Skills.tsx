'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const coreSkills = [
  { name: 'Python', years: 13 },
  { name: 'Backend Development', years: 13 },
  { name: 'CI/CD', years: 13 },
  { name: 'SQL / Databases', years: 11 },
  { name: 'Flask', years: 11 },
  { name: 'PostgreSQL / MySQL', years: 11 },
  { name: 'JavaScript', years: 11 },
  { name: 'REST API Design', years: 10 },
  { name: 'Docker', years: 7 },
  { name: 'FastAPI', years: 2 },
]

const maxYears = 13

export default function Skills() {
  const { t } = useLanguage()

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="font-display tracking-tight text-3xl font-bold text-ink">{t.skills.heading}</h2>
        </motion.div>

        {/* Skill bars */}
        <div className="mb-14 space-y-4">
          {coreSkills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center gap-4"
            >
              <span className="text-sm text-ink w-44 shrink-0">{skill.name}</span>
              <div className="flex-1 h-1.5 bg-ink/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(skill.years / maxYears) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.05, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-accent to-accent-dark rounded-full"
                />
              </div>
              <span className="text-xs font-mono text-accent-dark w-14 text-right shrink-0">
                {skill.years} yrs
              </span>
            </motion.div>
          ))}
        </div>

        {/* Badge categories */}
        <div className="grid md:grid-cols-2 gap-8">
          {t.skills.categories.map((category, i) => (
            <motion.div
              key={category.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <h3 className="text-sm font-semibold text-ink mb-3">{category.label}</h3>
              <div className="flex flex-wrap gap-2">
                {category.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono bg-surface-2 border border-ink/10 text-ink-muted px-2.5 py-1 rounded hover:text-accent-dark hover:border-accent/40 transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
