import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { SiLeetcode } from 'react-icons/si'
import Chapter from '../components/Chapter.jsx'
import NextChapter from '../components/NextChapter.jsx'
import Magnetic from '../components/Magnetic.jsx'
import RevealText from '../components/RevealText.jsx'
import Tilt from '../components/Tilt.jsx'
import { CONTACTS } from '../data.js'
import portraitIllustrated from '../assets/kaki-portrait-illustrated.png'
import portraitReal from '../assets/kaki-portrait-real.jpg'

const ICONS = {
  mail: FiMail,
  linkedin: FiLinkedin,
  github: FiGithub,
  leetcode: SiLeetcode,
}

const item = {
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  hidden: { opacity: 0, y: 30 },
}

// Understated editorial CTA — a label, an animated hairline, an arrow. No pills.
function HeroLink({ onClick, children }) {
  return (
    <Magnetic strength={0.2}>
      <button
        onClick={onClick}
        className="group flex items-center gap-2 text-sm font-medium text-ink"
      >
        <span className="relative pb-0.5">
          {children}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-flame transition-transform duration-300 ease-out group-hover:scale-x-100"
          />
        </span>
        <FiArrowUpRight
          aria-hidden="true"
          className="transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-flame"
        />
      </button>
    </Magnetic>
  )
}

// Interactive spotlight reveal portrait: Illustrated version on top by default;
// moving the cursor creates a feathered circular cutout revealing the real photo underneath.
function HeroPortrait() {
  const reduced = useReducedMotion()
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const [isFinePointer, setIsFinePointer] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const sync = () => setIsFinePointer(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const handleMouseMove = (e) => {
    if (!isFinePointer || reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPos({ x, y })
    if (!isHovered) setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const SPOTLIGHT_RADIUS = 80
  const FEATHER = 20

  const active = isHovered && isFinePointer && !reduced

  const maskStyle = active
    ? `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${pos.x}% ${pos.y}%, transparent 0%, transparent ${
        SPOTLIGHT_RADIUS - FEATHER
      }px, black ${SPOTLIGHT_RADIUS}px)`
    : 'none'

  return (
    <Tilt max={6} className="w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[380px]">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative aspect-square w-full select-none overflow-hidden rounded-2xl border border-ink/15 bg-surface/80 p-3 backdrop-blur-sm transition-all duration-500 ease-out hover:border-flame/40"
      >
        <div className="relative h-full w-full overflow-hidden rounded-xl">
          {/* Base layer: Real Photo */}
          <img
            src={portraitReal}
            alt="Kaki Harshita — Real Photo"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Top layer: Illustrated Portrait with Spotlight Mask */}
          <img
            src={portraitIllustrated}
            alt="Kaki Harshita — Illustrated Portrait"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            style={{
              WebkitMaskImage: maskStyle,
              maskImage: maskStyle,
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }}
          />

          {/* Hint badge (fades out on hover) */}
          {isFinePointer && !reduced && (
            <span
              className={`pointer-events-none absolute bottom-2 right-2 rounded-full border border-ink/15 bg-surface/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-ink/70 backdrop-blur transition-opacity duration-300 ${
                isHovered ? 'opacity-0' : 'opacity-80'
              }`}
            >
              ✦ Hover to reveal
            </span>
          )}
        </div>
      </div>
    </Tilt>
  )
}

export default function Hero({ active, onNavigate }) {
  const reduced = useReducedMotion()

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="flex grow items-center">
        <motion.div
          className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-5 md:px-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:pl-24"
          initial={false}
          animate={active ? 'show' : 'hidden'}
          variants={{
            show: { transition: { staggerChildren: 0.1 } },
            hidden: {},
          }}
        >
          {/* Left Column: Text & CTAs */}
          <div>
            <Chapter num="01" title="The Spark" variants={item} />

            <motion.p
              className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted"
              variants={item}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flame" />
              </span>
              Open to opportunities
            </motion.p>

            <motion.div className="relative mt-6 w-fit" variants={item}>
              {/* Words rise after the Intro card clears (~1.9s) */}
              <RevealText
                as="h1"
                className="display-xl"
                delay={1.9}
                segments={[{ text: 'Let’s build ' }, { text: 'things.', className: 'italic' }]}
              />
            </motion.div>

            <motion.p
              className="mt-8 max-w-2xl text-base leading-relaxed text-ink md:text-lg"
              variants={item}
            >
              Kaki Harshita — Computer Science (AI &amp; ML) undergraduate. Aspiring Full Stack
              &amp; Generative AI developer, and Creative Lead at OWASP.
            </motion.p>
            <motion.p className="mt-3 max-w-xl text-sm leading-relaxed text-muted md:text-base" variants={item}>
              I love building things, understanding how they work, and turning ideas into
              meaningful experiences — blending technology, creativity, and design.
            </motion.p>

            <motion.div className="mt-9 flex flex-wrap items-center gap-8" variants={item}>
              <HeroLink onClick={() => onNavigate(3)}>View my work</HeroLink>
              <HeroLink onClick={() => onNavigate(4)}>Get in touch</HeroLink>

              <span aria-hidden="true" className="hidden h-4 w-px bg-ink/20 sm:block" />

              <div className="flex items-center gap-4">
                {CONTACTS.map((c) => {
                  const Icon = ICONS[c.icon]
                  return (
                    <a
                      key={c.label}
                      href={c.href}
                      target={c.external ? '_blank' : undefined}
                      rel={c.external ? 'noreferrer noopener' : undefined}
                      aria-label={c.label}
                      className="text-lg text-muted transition-colors hover:text-flame"
                    >
                      <Icon />
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Portrait Illustration */}
          <motion.div variants={item} className="flex justify-center lg:justify-end">
            <HeroPortrait />
          </motion.div>
        </motion.div>
      </div>

      {/* Giant outline name marquee */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative z-0 mt-auto select-none overflow-hidden"
      >
        <motion.div
          className="flex w-max"
          animate={reduced ? undefined : { x: ['0%', '-50%'] }}
          transition={reduced ? undefined : { duration: 55, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0">
              {[0, 1].map((copy) => (
                <p
                  key={copy}
                  className="font-serif-x flex items-center whitespace-nowrap pb-[1vh] font-bold leading-[0.85] tracking-tight"
                  style={{
                    fontSize: 'clamp(3.25rem, 13.5vw, 16rem)',
                    color: 'rgba(122, 118, 116, 0.25)',
                  }}
                >
                  <span
                    className="mx-[3vw] inline-block rounded-full bg-flame/50"
                    style={{
                      width: 'clamp(0.5rem, 1.1vw, 1.1rem)',
                      height: 'clamp(0.5rem, 1.1vw, 1.1rem)',
                    }}
                  />
                  Kaki Harshita
                </p>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <NextChapter index={1} label="The Story" onNavigate={onNavigate} />
    </div>
  )
}
