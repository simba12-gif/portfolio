import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import portrait from '../assets/kaki-portrait-real.jpg'
import ParticleName from '../components/ParticleName.jsx'
import { HeroParallax } from '../components/ui/hero-parallax'
import eventPhoto from '../assets/hero-event.jpg'
import campusPhoto from '../assets/hero-campus.jpg'
import stagePhoto from '../assets/hero-stage.jpg'
import { NUMBERS } from '../data.js'
import './Hero.css'

// Personal photographs repeat across the existing three opposing rows.
const PHOTOS = [
  { title: 'A group photograph at VITfluence', thumbnail: eventPhoto, objectPosition: '50% 65%' },
  { title: 'An evening on campus', thumbnail: campusPhoto, objectPosition: '50% 55%' },
  { title: 'Speaking on stage', thumbnail: stagePhoto, objectPosition: '50% 35%' },
]
const HERO_PHOTOS = Array.from({ length: 15 }, (_, i) => PHOTOS[i % PHOTOS.length])

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
  const opacity = useTransform(progress, [0.08, 0.3], [1, 0])
  const scale = useTransform(progress, [0.08, 0.3], [1, 0.82])
  return <motion.div className="hero-cinema-photo" style={{ x: '-50%', y: '-50%', opacity, scale, width, height, left, top, borderRadius, visibility: box ? 'visible' : 'hidden' }}>
    <motion.div className="hero-cinema-faces" style={{ rotateY, borderRadius }}>
      <div className="hero-cinema-face"><img src={portrait} alt="Kaki Harshita" fetchPriority="high" /></div>
      <div className="hero-cinema-face hero-cinema-reverse" aria-hidden="true"><span className="hero-monogram">KH</span></div>
    </motion.div>
  </motion.div>
}

function HeroComposition({ progress, reduced = false }) {
  const stage = useRef(null)
  const anchor = useRef(null)
  const name = useRef(null)
  const nameOpacity = useTransform(progress, [0.08, 0.3], [1, 0])
  const coverY = useTransform(progress, [0.08, 0.3], [0, -70])
  const coverScale = useTransform(progress, [0.08, 0.3], [1, 0.9])
  const rowsOpacity = useTransform(progress, [0.3, 0.48], [0, 0.5])
  const rowsVisibility = useTransform(progress, p => p <= 0.3 ? 'hidden' : 'visible')
  const rowProgress = useTransform(progress, [0.3, 0.9], [0, 1])
  const introOpacity = useTransform(progress, [0.43, 0.58], [0, 1])
  const introY = useTransform(progress, [0.43, 0.58], [30, 0])

  return (
    <motion.div ref={stage} className={`editorial-hero hero-cinema-stage hero-parallax-intro ${reduced ? 'hero-intro-static' : ''}`}>

      <motion.div className="hero-masthead" style={reduced ? undefined : { y: coverY, scale: coverScale }}>
        <motion.h1 ref={name} className="hero-name" aria-label="Kaki Harshita" style={reduced ? undefined : { opacity: nameOpacity }}><span>Kaki</span><span>Harshita</span>{!reduced && <ParticleName nameRef={name} progress={progress} />}</motion.h1>
        <div ref={anchor} className="hero-photo hero-photo-anchor">{reduced && <img src={portrait} alt="Kaki Harshita" fetchPriority="high" />}</div>
      </motion.div>
      {!reduced && <PortraitCard progress={progress} stage={stage} anchor={anchor} />}
      <motion.div className="hero-parallax-layer" style={reduced ? undefined : { opacity: rowsOpacity, visibility: rowsVisibility }}>
        <HeroParallax products={HERO_PHOTOS} progress={rowProgress} embedded staticMode={reduced} />
      </motion.div>
      <motion.div className="hero-introduction" style={reduced ? undefined : { opacity: introOpacity, y: introY, visibility: rowsVisibility }}>
        <h2>I BUILD THINGS THAT THINK.<br /><em>AND EXPERIENCES THAT FEEL.</em></h2>
        <p>I'm Kaki Harshita, a Computer Science student interested in AI/ML, full-stack development, and building useful products that bring technology and thoughtful design together.</p>
      </motion.div>
      <motion.div className="hero-stat-notes" style={reduced ? undefined : { opacity: introOpacity, visibility: rowsVisibility }}>
        {NUMBERS.map(stat => <div className="hero-stat-note" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
      </motion.div>
      <p className="sr-only">Aspiring Full Stack &amp; Generative AI developer. Computer Science (AI &amp; ML) undergraduate. Creative Lead at OWASP. Blending technology, creativity, and design to turn ideas into meaningful experiences.</p>

    </motion.div>
  )
}



export default function Hero({ heroProgress }) {
  const reduced = useReducedMotion()
  const track = useRef(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.0001 })
  return <div ref={track} className={!heroProgress && !reduced ? 'hero-scroll-track' : 'hero-static-track'}>
    <HeroComposition progress={heroProgress || smooth} reduced={reduced} />
  </div>
}

