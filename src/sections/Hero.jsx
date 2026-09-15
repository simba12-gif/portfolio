import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { SiLeetcode } from 'react-icons/si'
import Chapter from '../components/Chapter.jsx'
import NextChapter from '../components/NextChapter.jsx'
import Magnetic from '../components/Magnetic.jsx'
import RevealText from '../components/RevealText.jsx'
import { CONTACTS } from '../data.js'

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

export default function Hero({ active, onNavigate }) {
  const reduced = useReducedMotion()

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="flex grow items-center">
        <motion.div
          className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-10 lg:pl-24"
          initial={false}
          animate={active ? 'show' : 'hidden'}
          variants={{
            show: { transition: { staggerChildren: 0.1 } },
            hidden: {},
          }}
        >
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
        </motion.div>
      </div>

      {/* Giant outline name — Firma's oversized background typography, run as a
          slow endless marquee across the lower Hero. Translucent grey-filled
          text so it blends into the canvas as texture; small flame dots
          punctuate the repetitions. Two identical halves + a −50% translate
          loop make the wrap seamless. Reduced motion parks it still. */}
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
                    // Solid grey fill, kept translucent so it sinks into the canvas
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
