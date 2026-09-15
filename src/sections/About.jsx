import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import Chapter from '../components/Chapter.jsx'
import NextChapter from '../components/NextChapter.jsx'
import RevealText from '../components/RevealText.jsx'
import Tilt from '../components/Tilt.jsx'
import { NUMBERS } from '../data.js'

const EXPLORING = ['LLMs', 'LangChain', 'LangGraph', 'DSA', 'Core CS']

const item = {
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  hidden: { opacity: 0, y: 30 },
}

// Rolls a stat from zero when it scrolls into view, preserving any
// leading-zero padding ('04' counts 00 → 04). Reduced motion shows it plain.
function CountUp({ value }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [text, setText] = useState(() => (reduced ? value : '0'.padStart(value.length, '0')))
  useEffect(() => {
    if (reduced || !inView) return
    const controls = animate(0, parseInt(value, 10), {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setText(String(Math.round(v)).padStart(value.length, '0')),
    })
    return () => controls.stop()
  }, [inView, reduced, value])
  return <span ref={ref}>{text}</span>
}

export default function About({ active, onNavigate }) {
  return (
    <div className="relative flex h-full flex-col justify-center overflow-hidden">
      <motion.div
        className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 md:px-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:pl-24"
        initial={false}
        animate={active ? 'show' : 'hidden'}
        variants={{ show: { transition: { staggerChildren: 0.12 } }, hidden: {} }}
      >
        <div>
          <Chapter num="02" title="The Story" variants={item} />
          <RevealText
            className="display-lg"
            segments={[
              { text: 'The mind behind ' },
              { text: 'the builds.', className: 'italic' },
            ]}
          />

          <motion.p
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted"
            variants={item}
          >
            I&apos;m a Computer Science – AI &amp; ML undergraduate passionate about building
            things, understanding how they work, and turning ideas into meaningful
            experiences. My interests span Generative AI, software development, and design.
          </motion.p>

          <motion.p
            className="mt-4 max-w-2xl text-base leading-relaxed text-muted"
            variants={item}
          >
            Beyond tech, I&apos;m the Creative Lead at OWASP — a cybersecurity club at my
            college — where I shape the club&apos;s design direction and visual identity. I
            love bringing together technology, creativity, and design to build things that
            are functional <em className="text-ink">and</em> engaging.
          </motion.p>

          <motion.p className="font-serif-x mt-7 text-sm italic text-muted" variants={item}>
            Currently exploring — {EXPLORING.join(' · ')}
          </motion.p>
        </div>

        {/* "Some numbers I'm proud of" — the Firma stats block, with real figures. */}
        <motion.div variants={item}>
          <p className="flex items-baseline justify-between border-b border-ink/20 pb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            Some numbers I&apos;m proud of
            <span className="font-serif-x text-sm normal-case italic tracking-normal">
              ({String(NUMBERS.length).padStart(2, '0')})
            </span>
          </p>
          <div className="grid grid-cols-2">
            {NUMBERS.map((n, i) => (
              <Tilt
                key={n.label}
                max={5}
                className={`border-ink/10 px-1 py-6 ${i % 2 === 0 ? 'border-r pr-6' : 'pl-6'} ${
                  i < NUMBERS.length - 2 ? 'border-b' : ''
                }`}
              >
                <span className="font-serif-x block text-5xl font-semibold leading-none tracking-tight xl:text-6xl">
                  <CountUp value={n.value} />
                </span>
                <span className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/80">
                  {n.label}
                </span>
                <span className="mt-1 block text-xs text-muted">{n.note}</span>
              </Tilt>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <NextChapter index={2} label="The Toolkit" onNavigate={onNavigate} />
    </div>
  )
}
