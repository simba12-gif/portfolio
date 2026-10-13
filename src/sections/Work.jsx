import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { FiArrowUpRight, FiGithub } from 'react-icons/fi'
import Chapter from '../components/Chapter.jsx'
import NextChapter from '../components/NextChapter.jsx'
import { PROJECTS } from '../data.js'
import './Work.css'

const COUNT = PROJECTS.length
// App's existing strip coordinates: Work starts at 3 and ends at 8.
const START = 3
const LAST = 4 + COUNT

function ProjectCard({ project, index, onFocus }) {
  return (
    <article className="process-project" onFocusCapture={onFocus}>
      <a className="process-project-link" href={project.live} target="_blank"
        rel="noopener noreferrer" aria-label={`${project.name} — open live website in a new tab`}>
        <img src={project.image} alt="" width="1440" height="900" decoding="async" />
        <span className="process-shade" aria-hidden="true" />
        <span className="process-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
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

function Heading({ onSelect }) {
  return <header className="process-heading">
    <div>
      <Chapter num="04" title="Selected Work" />
      <h2 className="display-lg"><span className="font-serif-x italic">My </span>Projects <span className="process-count">({String(COUNT).padStart(2, '0')})</span></h2>
    </div>
    {onSelect && <nav aria-label="Project index" className="process-index">
      {PROJECTS.map((project, index) => <button key={project.name} onClick={() => onSelect(index)}>
        <span>{String(index + 1).padStart(2, '0')}</span> {project.name} <FiArrowUpRight aria-hidden="true" />
      </button>)}
    </nav>}
  </header>
}

function MoreProjects() {
  return <a className="process-more" href="https://github.com/simba12-gif" target="_blank" rel="noopener noreferrer">
    <FiGithub aria-hidden="true" /> More experiments on GitHub <FiArrowUpRight aria-hidden="true" />
  </a>
}

function RisingCard({ project, index, progress, onFocus }) {
  // Each card catches the same baseline and stays there. App's shared spring
  // keeps the card movement and the pinned stage synchronized in both directions.
  const y = useTransform(progress, [START / LAST, (START + Math.max(index, 1)) / LAST],
    [`${index * 58}vh`, '0vh'])
  return <motion.div className="process-column" style={{ y }}>
    <ProjectCard project={project} index={index} onFocus={onFocus} />
  </motion.div>
}

function DesktopWork({ progress, onNavigate }) {
  // Cancel only the Work portion of the global pan, preserving every chapter's
  // original position, navigation offset, and scroll distance.
  const x = useTransform(progress, [START / LAST, (START + COUNT) / LAST], ['0vw', `${COUNT * 100}vw`])
  const select = (index, behavior = 'smooth') => window.scrollTo({ top: (START + index) * window.innerHeight, behavior })
  const revealOnFocus = (index) => {
    if (progress.get() * LAST < START + index - 0.05) select(index, 'instant')
  }
  return <motion.div className="process-desktop" style={{ x }}>
    <Heading onSelect={select} />
    <div className="process-row">
      {PROJECTS.map((project, index) => <RisingCard key={project.name} project={project} index={index}
        progress={progress} onFocus={() => revealOnFocus(index)} />)}
    </div>
    <MoreProjects />
    <NextChapter index={4} label="The Next Chapter" onNavigate={onNavigate} />
  </motion.div>
}

function MobileWork() {
  const root = useRef(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['calc(0% - 0px)', `calc(-${(COUNT - 1) * 100}% - ${(COUNT - 1) * 20}px)`])
  const select = (index, behavior = 'smooth') => {
    const el = root.current
    if (window.matchMedia('(max-height: 700px)').matches) return
    const start = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: start + (el.offsetHeight - window.innerHeight) * index / (COUNT - 1), behavior })
  }
  return <div ref={root} className="process-mobile" style={{ '--project-count': COUNT }}>
    <div className="process-mobile-stage">
      <Heading />
      <div className="process-window">
        <motion.div className="process-mobile-track" style={{ x }}>
          {PROJECTS.map((project, index) => <ProjectCard key={project.name} project={project} index={index}
            onFocus={() => select(index, 'instant')} />)}
        </motion.div>
      </div>
      <nav className="process-mobile-index" aria-label="Project index">
        {PROJECTS.map((project, index) => <button key={project.name} onClick={() => select(index)} aria-label={`Show ${project.name}`}>
          {String(index + 1).padStart(2, '0')}
        </button>)}
      </nav>
      <MoreProjects />
    </div>
  </div>
}

export default function Work({ workProgress, onNavigate }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className="process-static">
    <Heading />
    <div className="process-static-list">{PROJECTS.map((project, index) => <ProjectCard key={project.name} project={project} index={index} />)}</div>
    <MoreProjects />
  </div>
  return workProgress ? <DesktopWork progress={workProgress} onNavigate={onNavigate} /> : <MobileWork />
}
