import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { FiArrowUpRight, FiGithub } from 'react-icons/fi'
import { PROJECTS } from '../data.js'
import './Work.css'

const COUNT = PROJECTS.length
// App's existing strip coordinates: Work starts at 3 and ends at 8.
const START = 3
const LAST = 4 + COUNT

function ProjectCard({ project, onFocus }) {
  return (
    <article className="process-project" onFocusCapture={onFocus}>
      <a className="process-project-link" href={project.live} target="_blank"
        rel="noopener noreferrer" aria-label={`${project.name} — open live website in a new tab`}>
        <img src={project.image} alt="" width="1440" height="900" decoding="async" />
        <span className="process-shade" aria-hidden="true" />

        <div className="process-copy">
          <p className="process-kicker">{project.kicker}</p>
          <h3>{project.name}</h3>
          <p className="process-description">{project.blurb}</p>
          <p className="process-tech">{project.tech.join(' · ')}</p>
          <span className="process-live">Live Demo <FiArrowUpRight aria-hidden="true" /></span>
        </div>
      </a>
      {/* Keep the repository link separate from the full-card live link. */}
      <a className="process-source" href={project.github} target="_blank" rel="noopener noreferrer"
        aria-label={`${project.name} source on GitHub (opens in a new tab)`}>
        <FiGithub aria-hidden="true" /> Source
      </a>
    </article>
  )
}

function Heading() {
  return <header className="process-heading">
    <div>

      <h2 className="display-lg"><span className="font-serif-x italic">My </span>Projects</h2>
    </div>
  </header>
}

function MoreProjects() {
  return <a className="process-more" href="https://github.com/simba12-gif" target="_blank" rel="noopener noreferrer">
    <FiGithub aria-hidden="true" /> More experiments on GitHub <FiArrowUpRight aria-hidden="true" />
  </a>
}

// A small lead-in keeps the section's entry frame empty. Every card gets its
// own scroll interval; the settled layout never depends on its reveal offset.
const revealEnd = (index) => index + 0.85
const easeReveal = (t) => t * t * (3 - 2 * t)

function RisingCard({ project, index, progress, onFocus }) {
  const interval = [index + 0.12, revealEnd(index)]
  const y = useTransform(progress, interval, ['100vh', '0vh'], { ease: easeReveal })
  const opacity = useTransform(progress, interval, [0, 1], { ease: easeReveal })
  return <motion.div className="process-column" style={{ y, opacity }}>
    <ProjectCard project={project} onFocus={onFocus} />
  </motion.div>
}

function DesktopWork({ progress }) {
  // Cancel only the Work portion of the global pan, preserving every chapter's
  // original position, navigation offset, and scroll distance.
  const x = useTransform(progress, [START / LAST, (START + COUNT) / LAST], ['0vw', `${COUNT * 100}vw`])
  const revealProgress = useTransform(progress, (value) => value * LAST - START)
  const select = (index, behavior = 'smooth') => window.scrollTo({ top: (START + revealEnd(index)) * window.innerHeight, behavior })
  const revealOnFocus = (index) => {
    if (revealProgress.get() < revealEnd(index) - 0.01) select(index, 'instant')
  }
  return <motion.div className="process-desktop" style={{ x }}>
    <Heading />
    <div className="process-row" style={{ '--project-count': COUNT }}>
      {PROJECTS.map((project, index) => <RisingCard key={project.name} project={project} index={index}
        progress={revealProgress} onFocus={() => revealOnFocus(index)} />)}
    </div>
    <MoreProjects />

  </motion.div>
}

function MobileWork() {
  const root = useRef(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end end'] })
  const revealProgress = useTransform(scrollYProgress, (value) => value * COUNT)
  // Move to the next column before its upward reveal begins. Keep the existing
  // single-card mobile composition without exposing the next card early.
  const stops = [0]
  const positions = ['calc(0% - 0px)']
  for (let index = 1; index < COUNT; index += 1) {
    stops.push(index - 0.1, index + 0.1)
    positions.push(`calc(-${(index - 1) * 100}% - ${(index - 1) * 20}px)`, `calc(-${index * 100}% - ${index * 20}px)`)
  }
  const x = useTransform(revealProgress, stops, positions)
  const select = (index, behavior = 'smooth') => {
    const el = root.current
    if (window.matchMedia('(max-height: 700px)').matches) return
    const start = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: start + (el.offsetHeight - window.innerHeight) * revealEnd(index) / COUNT, behavior })
  }
  return <div ref={root} className="process-mobile" style={{ '--project-count': COUNT }}>
    <div className="process-mobile-stage">
      <Heading />
      <div className="process-window">
        <motion.div className="process-mobile-track" style={{ x }}>
          {PROJECTS.map((project, index) => <RisingCard key={project.name} project={project} index={index}
            progress={revealProgress} onFocus={() => select(index, 'instant')} />)}
        </motion.div>
      </div>
      <MoreProjects />
    </div>
  </div>
}

export default function Work({ workProgress }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className="process-static">
    <Heading />
    <div className="process-static-list">{PROJECTS.map((project) => <ProjectCard key={project.name} project={project} />)}</div>
    <MoreProjects />
  </div>
  return workProgress ? <DesktopWork progress={workProgress} /> : <MobileWork />
}
