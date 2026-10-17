import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
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
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px) and (min-height: 700px)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (min-height: 700px)')
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
  // Track the current section for keyboard and focus navigation.
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
  // Hold the opening composition while the portrait flips and expands.
  // Rejoin the original strip mapping at About; later chapters keep their offsets.
  const x = useTransform(smooth, [0, 1 / LAST, 1], ['-100vw', '-100vw', `-${LAST * 100}vw`])
  const heroProgress = useTransform(smooth, [0, 1 / LAST], [0, 1])
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const scrollPosition = p * LAST
    const pos = scrollPosition < 1 ? (scrollPosition >= 0.86 ? 1 : 0) : scrollPosition
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

  // Sideways trackpad gestures use the same native scroll / spring pipeline.
  // Leave vertical wheels, diagonal gestures, and pinch-to-zoom to the browser.
  useEffect(() => {
    const viewport = viewportRef.current
    const onWheel = (event) => {
      if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
      event.preventDefault()
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerWidth : 1
      window.scrollBy({
        top: event.deltaX * unit * (window.innerHeight / window.innerWidth),
        behavior: 'instant',
      })
    }
    viewport?.addEventListener('wheel', onWheel, { passive: false })
    return () => viewport?.removeEventListener('wheel', onWheel)
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

      <div ref={wrapperRef} style={{ height: `${TOTAL * 100}vh` }}>
        <div ref={viewportRef} className="sticky top-0 h-screen overflow-hidden">
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
                  className="chapter-section relative h-full shrink-0"
                  style={{ width: `${SPANS[i] * 100}vw` }}
                >
                  {/* Always active: the strip is one continuous canvas — content
                      never fades in/out as the pan crosses section seams. */}
                  <Section active onNavigate={navigate} workProgress={i === 3 ? smooth : undefined} heroProgress={i === 0 ? heroProgress : undefined} heroDesktop={i === 0} integrated={i === 1} />
                </section>
              )
            })}
          </motion.main>
        </div>
      </div>

    </>
  )
}

// Both chapters occupy the same grid cell. The real About section stays pinned
// behind the opening card, then resumes document flow without a duplicate or swap.
function MobileHeroBridge({ registerHome, registerAbout, onNavigate, onChapter }) {
  const runway = useRef(null)
  const { scrollYProgress } = useScroll({ target: runway, offset: ['start start', 'end start'] })
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.0001 })
  useMotionValueEvent(scrollYProgress, 'change', (p) => onChapter(p >= 0.86 ? 1 : 0))
  return <div className="hero-about-bridge">
    <div ref={runway} className="hero-bridge-runway" aria-hidden="true" />
    <section id="home" aria-label={SECTIONS[0].name} ref={registerHome} className="chapter-section hero-bridge-front">
      <Hero onNavigate={onNavigate} heroProgress={progress} />
    </section>
    <div className="hero-bridge-about-track">
      <section id="about" aria-label={SECTIONS[1].name} ref={registerAbout} className="chapter-section flex flex-col hero-bridge-about">
        <About active integrated onNavigate={onNavigate} />
      </section>
    </div>
  </div>
}

// Reduced motion retains plain vertical document flow.
function VerticalLayout() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const sectionRefs = useRef([])
  const registerHome = useCallback((el) => { sectionRefs.current[0] = el }, [])
  const registerAbout = useCallback((el) => { sectionRefs.current[1] = el }, [])

  const navigate = useCallback((i) => {
    const next = clamp(i)
    const behavior = reduced ? 'instant' : 'smooth'
    const runway = document.querySelector('.hero-bridge-runway')
    if (runway && next < 2) {
      window.scrollTo({ top: next === 0 ? 0 : runway.getBoundingClientRect().top + window.scrollY + runway.offsetHeight, behavior })
    } else {
      sectionRefs.current[next]?.scrollIntoView({ behavior, block: 'start' })
    }
    setIndex(next)
  }, [reduced])

  // Activate content reveals as sections enter the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = sectionRefs.current.indexOf(entry.target)
            if (i !== -1 && (i > 1 || !document.querySelector('.hero-about-bridge'))) setIndex(i)
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
        {!reduced && <MobileHeroBridge registerHome={registerHome} registerAbout={registerAbout} onNavigate={navigate} onChapter={setIndex} />}
        {SECTIONS.map((s, i) => {
          if (!reduced && i < 2) return null
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

export default function App() {
  const horizontal = useHorizontalMode()
  // Reset scroll position when the layout mechanism changes so the tall
  // wrapper's leftover scroll offset doesn't strand the other layout mid-page.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [horizontal])
  return (
    <>
      {horizontal ? <HorizontalLayout key="h" /> : <VerticalLayout key="v" />}
    </>
  )
}
