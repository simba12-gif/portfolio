import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { FiArrowUpRight, FiGithub } from 'react-icons/fi'
import { PROJECTS } from '../data.js'
import './Work.css'
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

// Preserve the upward, scroll-linked reveal, now measured at each vertical card.
const easeReveal = (t) => t * t * (3 - 2 * t)

function RisingCard({ project, reduced }) {
  const slot = useRef(null)
  const { scrollYProgress } = useScroll({ target: slot, offset: ['start end', 'start 20%'] })
  const y = useTransform(scrollYProgress, [0.12, 0.85], ['100vh', '0vh'], { ease: easeReveal })
  const opacity = useTransform(scrollYProgress, [0.12, 0.85], [0, 1], { ease: easeReveal })
  return <div ref={slot} className="process-column">
    <motion.div style={reduced ? undefined : { y, opacity }}>
      <ProjectCard project={project} onFocus={() => slot.current?.scrollIntoView({ block: 'center', behavior: 'instant' })} />
    </motion.div>
  </div>
}

export default function Work() {
  const reduced = useReducedMotion()
  return <div className="process-vertical">
    <Heading />
    <div className="process-row">
      {PROJECTS.map(project => <RisingCard key={project.name} project={project} reduced={reduced} />)}
    </div>
    <MoreProjects />
  </div>
}
