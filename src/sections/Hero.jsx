import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import portrait from '../assets/kaki-portrait-real.jpg'
import './Hero.css'

function PortraitCard() {
  const [flipped, setFlipped] = useState(false)
  const descriptionId = useId()

  return (
    <button
      type="button"
      className="hero-photo"
      aria-label="Flip portrait to learn about Kaki Harshita"
      aria-pressed={flipped}
      aria-describedby={flipped ? descriptionId : undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover)').matches) setFlipped(true)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setFlipped(false)
      }}
      onClick={() => setFlipped((value) => !value)}
      onBlur={() => setFlipped(false)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setFlipped(false)
      }}
    >
      <span className="hero-photo-inner">
        <span className="hero-photo-face hero-photo-front" aria-hidden={flipped}>
          <img src={portrait} alt="Kaki Harshita" loading="eager" fetchPriority="high" />
        </span>
        <span className="hero-photo-face hero-photo-back" aria-hidden={!flipped}>
          <span id={descriptionId} className="hero-card-copy">
            <span className="hero-card-title">Aspiring Full Stack &amp; Generative AI developer.</span>
            <span className="hero-card-description">Computer Science (AI &amp; ML) undergraduate. Creative Lead at OWASP. Blending technology, creativity, and design to turn ideas into meaningful experiences.</span>
          </span>
        </span>
      </span>
    </button>
  )
}

export default function Hero({ onNavigate }) {
  const reduced = useReducedMotion()

  return (
    <div className="editorial-hero">
      <div className="hero-edition">
        <span>01 / The Spark</span>
        <span className="hero-availability"><i aria-hidden="true" />Open to opportunities</span>
      </div>

      <motion.div
        className="hero-masthead"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.65, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="hero-name" aria-label="Kaki Harshita"><span>Kaki</span><span>Harshita</span></h1>
        <PortraitCard />
      </motion.div>

      <div className="hero-bottom">
        <div className="hero-actions">
          <button type="button" onClick={() => onNavigate(3)}>View my work <FiArrowUpRight aria-hidden="true" /></button>
          <button type="button" onClick={() => onNavigate(4)}>Get in touch <FiArrowUpRight aria-hidden="true" /></button>
        </div>
        <button type="button" className="hero-scroll" onClick={() => onNavigate(1)} aria-label="Explore The Story, next section">
          <span>Scroll to explore</span><span className="hero-scroll-circle"><FiArrowRight aria-hidden="true" /></span>
        </button>
      </div>
    </div>
  )
}

