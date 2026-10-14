import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import portrait from '../assets/kaki-portrait-real.jpg'
import './Hero.css'

const ease = (t) => t * t * (3 - 2 * t)

function PortraitCard({ progress, stage, anchor }) {
  const [box, setBox] = useState(null)
  useEffect(() => {
    let mounted = true
    const measure = () => {
      const root = stage.current
      const slot = anchor.current
      if (!mounted || !root || !slot) return
      // Local offsets are independent of the page's animated horizontal transform.
      const bounds = slot.getBoundingClientRect()
      const origin = root.getBoundingClientRect()
      setBox({ x: bounds.left - origin.left + bounds.width / 2,
        y: bounds.top - origin.top + bounds.height / 2,
        w: slot.offsetWidth, h: slot.offsetHeight, width: root.clientWidth, height: root.clientHeight })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage.current)
    observer.observe(anchor.current)
    document.fonts.ready.then(measure)
    return () => { mounted = false; observer.disconnect() }
  }, [stage, anchor])
  const expansion = useTransform(progress, [0.34, 0.72], [0, 1], { ease })
  const rotateY = useTransform(progress, [0.02, 0.32], [0, 180], { ease })
  const width = useTransform(expansion, (p) => box ? box.w + (box.width - box.w) * p : 0)
  const height = useTransform(expansion, (p) => box ? box.h + (box.height - box.h) * p : 0)
  const left = useTransform(expansion, (p) => box ? box.x + (box.width / 2 - box.x) * p : 0)
  const top = useTransform(expansion, (p) => box ? box.y + (box.height / 2 - box.y) * p : 0)
  const borderRadius = useTransform(expansion, [0, 1], ['48% 48% 45% 45% / 32% 32% 30% 30%', '0% 0% 0% 0% / 0% 0% 0% 0%'])
  return <motion.div className="hero-cinema-photo" style={{ width, height, left, top, borderRadius, visibility: box ? 'visible' : 'hidden' }}>
    <motion.div className="hero-cinema-faces" style={{ rotateY, borderRadius }}>
      <div className="hero-cinema-face"><img src={portrait} alt="Kaki Harshita" fetchPriority="high" /></div>
      <div className="hero-cinema-face hero-cinema-reverse" aria-hidden="true"><span className="hero-monogram">KH</span></div>
    </motion.div>
  </motion.div>
}

function HeroComposition({ progress, desktop = false, reduced = false }) {
  const stage = useRef(null)
  const anchor = useRef(null)
  // The card opens from its centre, exposing the real About section beneath it.
  const opening = useTransform(progress, [0.72, 1], [0, 50], { ease })
  const clipPath = useTransform(opening, (p) => `polygon(0% 0%, ${50 - p}% 0%, ${50 - p}% 100%, ${50 + p}% 100%, ${50 + p}% 0%, 100% 0%, 100% 100%, 0% 100%)`)
  const nameOpacity = useTransform(progress, [0.12, 0.5], [1, 0])
  const visibility = useTransform(progress, (p) => p >= 0.999 ? 'hidden' : 'visible')

  return (
    <motion.div ref={stage} className="editorial-hero hero-cinema-stage" style={reduced ? undefined : { x: desktop ? '100vw' : 0, clipPath, visibility }}>

      <div className="hero-masthead">
        <motion.h1 className="hero-name" aria-label="Kaki Harshita" style={reduced ? undefined : { opacity: nameOpacity }}><span>Kaki</span><span>Harshita</span></motion.h1>
        <div ref={anchor} className="hero-photo hero-photo-anchor">{reduced && <img src={portrait} alt="Kaki Harshita" fetchPriority="high" />}</div>
      </div>
      {!reduced && <PortraitCard progress={progress} stage={stage} anchor={anchor} />}
      <p className="sr-only">Aspiring Full Stack &amp; Generative AI developer. Computer Science (AI &amp; ML) undergraduate. Creative Lead at OWASP. Blending technology, creativity, and design to turn ideas into meaningful experiences.</p>

    </motion.div>
  )
}



export default function Hero({ heroProgress, heroDesktop = false }) {
  const reduced = useReducedMotion()
  const track = useRef(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.0001 })
  return <div ref={track} className={!heroProgress && !reduced ? 'hero-scroll-track' : 'hero-static-track'}>
    <HeroComposition progress={heroProgress || smooth} desktop={heroDesktop} reduced={reduced} />
  </div>
}

