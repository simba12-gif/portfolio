import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Hero from './sections/Hero.jsx'
import Skills from './sections/Skills.jsx'
import Work from './sections/Work.jsx'
import Contact from './sections/Contact.jsx'
import { SECTIONS } from './data.js'

const COMPONENTS = [Hero, Skills, Work, Contact]
const clamp = (i) => Math.max(0, Math.min(SECTIONS.length - 1, i))

// All viewports use native vertical document flow.
export default function App() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const sectionRefs = useRef([])

  const navigate = useCallback((i) => {
    const next = clamp(i)
    const behavior = reduced ? 'instant' : 'smooth'
    sectionRefs.current[next]?.scrollIntoView({ behavior, block: 'start' })
    setIndex(next)
  }, [reduced])

  // Activate content reveals as sections enter the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = sectionRefs.current.indexOf(entry.target)
            if (i !== -1) setIndex(i)
          }
        }
      },
      // A middle band rather than a share of the section: a section taller than
      // the viewport can never cross a 0.5 threshold, and would never activate.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    sectionRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>

      <main className="vertical-layout">
        {SECTIONS.map((s, i) => {
          const Section = COMPONENTS[i]
          return (
            <section
              key={s.id}
              id={s.id}
              ref={(el) => (sectionRefs.current[i] = el)}
              aria-label={s.name}
              className="chapter-section flex min-h-screen flex-col py-10 *:grow"
            >
              <Section active={i === index} onNavigate={navigate} />
            </section>
          )
        })}
      </main>

    </>
  )
}

