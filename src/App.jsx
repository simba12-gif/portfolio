import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import Intro from './components/Intro.jsx'
import JourneyPath from './components/JourneyPath.jsx'
import Navbar from './components/Navbar.jsx'
import ProgressDots from './components/ProgressDots.jsx'
import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import Skills from './sections/Skills.jsx'
import Work from './sections/Work.jsx'
import Contact from './sections/Contact.jsx'
import { PROJECTS, SECTIONS } from './data.js'

const COMPONENTS = [Hero, About, Skills, Work, Contact]
const COUNT = SECTIONS.length

// Viewport-widths each section occupies on the one continuous horizontal strip.
// Work (index 3) holds a title card plus one screen per project, so the single
// page-level pan glides across every build and straight on into Contact — there
// is no nested scroll and no hand-off.
const SPANS = [1, 1, 1, 1 + PROJECTS.length, 1]
// Left edge of each section, measured in viewport-widths from the strip start.
const OFFSETS = SPANS.map((_, i) => SPANS.slice(0, i).reduce((a, b) => a + b, 0))
const TOTAL = SPANS.reduce((a, b) => a + b, 0)
const LAST = TOTAL - 1

const clamp = (i) => Math.max(0, Math.min(COUNT - 1, i))
// Which section fills the viewport at a given strip coordinate (screen units).
const sectionAt = (coord) => {
  for (let i = 0; i < COUNT; i += 1) {
    if (coord < OFFSETS[i] + SPANS[i]) return i
  }
  return COUNT - 1
}

// The horizontal canvas is desktop-only and disabled for prefers-reduced-motion users.
function useHorizontalMode() {
  const reduced = useReducedMotion()
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => setWide(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return wide && !reduced
}

// One continuous strip: a tall scroll wrapper drives a single translateX on the
// flat flex container. No snapping, no per-section enter/exit animation — the
// page's native vertical scroll pans the canvas sideways at a constant rate.
function HorizontalLayout() {
  const wrapperRef = useRef(null)
  const viewportRef = useRef(null)
  // Nearest section, for wayfinding only (navbar counter, dots).
  const [index, setIndex] = useState(0)
  const indexRef = useRef(0)
  useEffect(() => {
    indexRef.current = index
  }, [index])

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })
  // Light smoothing (GSAP scrub ≈ 0.5 feel); useTransform clamps any overshoot.
  const smooth = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.0001 })
  const x = useTransform(smooth, [0, 1], ['0vw', `-${LAST * 100}vw`])
  // The storyline thread pans slower than the sections for parallax depth.
  const PATH_PARALLAX = 0.75
  const pathX = useTransform(smooth, [0, 1], ['0vw', `-${LAST * 100 * PATH_PARALLAX}vw`])

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const pos = p * LAST
    // Wayfinding (navbar, dots): the section under the viewport's centre.
    const nearest = sectionAt(Math.min(pos + 0.5, LAST))
    if (nearest !== indexRef.current) setIndex(nearest)
  })

  // Explicit navigation (navbar, dots, buttons) scrolls the page; the scrub
  // mapping pans the canvas there — never a discrete jump of the strip itself.
  const navigate = useCallback((i) => {
    // Land section i's left edge at the viewport: its strip offset in screens
    // maps one-to-one onto wrapper scroll (the wrapper is TOTAL screens tall).
    window.scrollTo({ top: OFFSETS[clamp(i)] * window.innerHeight, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof Element && e.target.closest('input, textarea, select')) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        navigate(indexRef.current + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        navigate(indexRef.current - 1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        navigate(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        navigate(COUNT - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  // Tab focus into an off-screen section should pan it into view. The browser
  // also nudges scrollLeft on the overflow-hidden viewport when focusing
  // off-screen elements — undo that so transform stays the only source of
  // horizontal position.
  const onSectionFocus = (i) => {
    if (viewportRef.current) viewportRef.current.scrollLeft = 0
    if (i !== indexRef.current) navigate(i)
  }

  return (
    <>
      <Navbar sections={SECTIONS} activeIndex={index} onNavigate={navigate} />

      <div ref={wrapperRef} style={{ height: `${TOTAL * 100}vh` }}>
        <div ref={viewportRef} className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 left-0"
            style={{ x: pathX, width: `${100 + LAST * 100 * PATH_PARALLAX}vw` }}
          >
            <JourneyPath />
          </motion.div>
          <motion.main
            className="relative flex h-full"
            style={{ x, width: `${TOTAL * 100}vw` }}
          >
            {SECTIONS.map((s, i) => {
              const Section = COMPONENTS[i]
              return (
                <section
                  key={s.id}
                  id={s.id}
                  aria-label={s.name}
                  onFocusCapture={() => onSectionFocus(i)}
                  className="relative h-full shrink-0"
                  style={{ width: `${SPANS[i] * 100}vw` }}
                >
                  {/* Always active: the strip is one continuous canvas — content
                      never fades in/out as the pan crosses section seams. */}
                  <Section active onNavigate={navigate} />
                </section>
              )
            })}
          </motion.main>
        </div>
      </div>

      <ProgressDots sections={SECTIONS} activeIndex={index} onNavigate={navigate} />
    </>
  )
}

// Below 1024px (or reduced motion): plain vertical document flow.
function VerticalLayout() {
  const [index, setIndex] = useState(0)
  const sectionRefs = useRef([])

  const navigate = useCallback((i) => {
    const next = clamp(i)
    sectionRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIndex(next)
  }, [])

  // Keep the navbar counter / progress bar in sync while scrolling.
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
      <Navbar sections={SECTIONS} activeIndex={index} onNavigate={navigate} />

      <main className="pt-16">
        {SECTIONS.map((s, i) => {
          const Section = COMPONENTS[i]
          return (
            <section
              key={s.id}
              id={s.id}
              ref={(el) => (sectionRefs.current[i] = el)}
              aria-label={s.name}
              className="flex min-h-screen flex-col py-10 *:grow"
            >
              <Section active={i === index} onNavigate={navigate} />
            </section>
          )
        })}
      </main>

      <ProgressDots sections={SECTIONS} activeIndex={index} onNavigate={navigate} />
    </>
  )
}

export default function App() {
  const horizontal = useHorizontalMode()
  // Reset scroll position when the layout mechanism changes so the tall
  // wrapper's leftover scroll offset doesn't strand the other layout mid-page.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [horizontal])
  return (
    <>
      <Intro />
      {horizontal ? <HorizontalLayout key="h" /> : <VerticalLayout key="v" />}
    </>
  )
}
