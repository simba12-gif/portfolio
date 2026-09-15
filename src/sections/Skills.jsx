import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Chapter from '../components/Chapter.jsx'
import NextChapter from '../components/NextChapter.jsx'
import RevealText from '../components/RevealText.jsx'
import SkillWave from '../components/SkillWave.jsx'
import { TECH_ICONS } from '../icons.js'
import { SKILL_GROUPS } from '../data.js'

const PLUM = '#10060b'
// Badge fills cycle warm-to-cool so neighbours never repeat; each fill
// carries its own contrast colour for the mark on top of it.
const FILLS = ['#f1563b', '#f28960', '#f5ac66', '#10060b']
const MARKS = ['#fdf6ec', '#10060b', '#10060b', '#fdf6ec']

// Two drifting chains: the build stack up top, the toolbox and AI work below.
const ALL_SKILLS = SKILL_GROUPS.flatMap((group) => group.skills).map((skill, i) => ({
  skill,
  Icon: TECH_ICONS[skill],
  bg: FILLS[i % FILLS.length],
  ink: MARKS[i % MARKS.length],
}))
const TRACKS = [ALL_SKILLS.slice(0, 10), ALL_SKILLS.slice(10)]

const rise = {
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hidden: { opacity: 0, y: 40 },
}

// The hover sticker only makes sense on a device that can actually hover;
// touch screens get the name printed on the card instead.
function useCanHover() {
  const [canHover, setCanHover] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setCanHover(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return canHover
}

// Torn-paper edge for the name stickers — the same trick the reference uses:
// fractal noise displacing the sticker's outline so it never looks die-cut.
function StickerFilter() {
  return (
    <svg aria-hidden="true" className="absolute size-0">
      <defs>
        <filter id="sticker-rough" x="-25%" y="-40%" width="150%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.07 0.11" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}

function CategoryTag({ name }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-ink/15 bg-surface/70 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-ink/60">
      {name}
    </span>
  )
}

export default function Skills({ active, onNavigate }) {
  const reduced = useReducedMotion()
  const canHover = useCanHover()

  return (
    <div
      className="relative -my-10 flex flex-col justify-center overflow-hidden py-10 lg:my-0 lg:h-full lg:flex-row lg:items-center lg:py-0"
      style={{ color: PLUM }}
    >
      <StickerFilter />
      <motion.div
        className="mx-auto w-full max-w-none px-5 md:px-10 lg:pl-24"
        initial={false}
        animate={reduced ? undefined : active ? 'show' : 'hidden'}
        variants={{ show: { transition: { staggerChildren: 0.12 } }, hidden: {} }}
      >
        <motion.div className="relative mx-auto w-fit max-w-6xl" variants={reduced ? undefined : rise}>
          <Chapter num="03" title="The Toolkit" />
          <RevealText
            className="display-serif"
            segments={[
              { text: 'The Tools Behind ' },
              { text: 'the Build.', className: 'italic' },
            ]}
          />
        </motion.div>

        <motion.div className="mt-10 lg:mt-14" variants={reduced ? undefined : rise}>
          {reduced ? (
            // No drift, no reveal — just the full list, plainly.
            <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
              {ALL_SKILLS.map(({ skill, Icon, bg, ink }) => (
                <li
                  key={skill}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"
                  style={{ backgroundColor: bg, color: ink }}
                >
                  {Icon ? <Icon aria-hidden="true" style={{ color: ink }} /> : null}
                  {skill}
                </li>
              ))}
            </ul>
          ) : (
            <div className="-mt-4 space-y-1 lg:-mt-8 lg:space-y-2">
              {TRACKS.map((items, i) => (
                <SkillWave
                  key={i}
                  items={items}
                  direction={i === 0 ? 1 : -1}
                  phase={i === 0 ? 0 : 0.5}
                  speed={i === 0 ? 56 : 44}
                  hoverable={canHover}
                />
              ))}
            </div>
          )}
        </motion.div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {SKILL_GROUPS.map((g) => (
            <CategoryTag key={g.title} name={g.title} />
          ))}
        </div>

        {canHover && !reduced && (
          <p className="mt-4 text-center text-[11px] italic text-ink/50">✦ hover a card for its name</p>
        )}
      </motion.div>

      <NextChapter index={3} label="The Builds" onNavigate={onNavigate} />
    </div>
  )
}
