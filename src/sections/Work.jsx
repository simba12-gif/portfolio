import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { FiArrowUpLeft, FiArrowDownLeft, FiArrowUpRight, FiGithub } from 'react-icons/fi'
import { PROJECTS } from '../data.js'
import './Work.css'

const COUNT = PROJECTS.length
const projectAt = index => PROJECTS[((index % COUNT) + COUNT) % COUNT]

function ProjectName({ index, position, active, open }) {
  const project = projectAt(index)
  const y = useTransform(position, value => `${(index - value) * 9}svh`)
  const x = useTransform(position, value => `${-Math.pow(Math.min(5, Math.abs(index - value)), 2) * 1.15}svh`)
  const opacity = useTransform(position, value => Math.max(0, 1 - Math.pow(Math.abs(index - value) / 4.5, 1.6)))
  const visible = useTransform(position, value => Math.abs(index - value) > 4.4 ? 'hidden' : 'visible')
  const primary = index >= 0 && index < COUNT
  return <motion.button className="arc-project-name" style={{ x, y, opacity, visibility: visible }}
    tabIndex={primary ? 0 : -1} aria-hidden={!primary || undefined}
    aria-current={index === active ? 'true' : undefined} onClick={() => open(project)}>
    <span>{project.name}</span><small>{project.kicker}</small>
  </motion.button>
}

function ProjectDetails({ project, close }) {
  const dialog = useRef(null)
  useEffect(() => {
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current.showModal()
    return () => {
      document.body.style.overflow = overflow
      previous?.focus({ preventScroll: true })
    }
  }, [])
  return createPortal(<dialog ref={dialog} className="arc-detail" aria-labelledby="arc-detail-title" onCancel={close}>
    <div className="arc-detail-inner">
      <button className="arc-back" onClick={close} autoFocus>Back to projects</button>
      <h2 id="arc-detail-title">{project.name}</h2>
      <p className="arc-detail-category">{project.kicker}</p>
      <img className="arc-detail-image" src={project.image} alt={`${project.name} project screenshot`} />
      <div className="arc-detail-info">
        <p>{project.blurb}</p>
        <div><p className="arc-detail-tech">{project.tech.join(' \u00b7 ')}</p>
          <div className="arc-detail-links">
            <a href={project.live} target="_blank" rel="noopener noreferrer">Live demo <FiArrowUpRight /></a>
            <a href={project.github} target="_blank" rel="noopener noreferrer"><FiGithub /> Repository</a>
          </div>
        </div>
      </div>
    </div>
  </dialog>, document.body)
}

export default function Work() {
  const root = useRef(null)
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [detail, setDetail] = useState(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end end'] })
  const target = useTransform(scrollYProgress, [0, 1], [0, COUNT - 1])
  const spring = useSpring(target, { stiffness: 110, damping: 25, restDelta: .0005 })
  const position = reduced ? target : spring
  const imageY = useTransform(position, value => `${-value * 100}%`)
  useMotionValueEvent(position, 'change', value => setActive(Math.max(0, Math.min(COUNT - 1, Math.round(value)))))
  const go = direction => {
    const next = Math.max(0, Math.min(COUNT - 1, active + direction))
    const bounds = root.current.getBoundingClientRect()
    const travel = root.current.offsetHeight - window.innerHeight
    window.scrollTo({ top: bounds.top + window.scrollY + travel * next / (COUNT - 1), behavior: reduced ? 'instant' : 'smooth' })
  }
  return <>
    <div ref={root} className="arc-projects" style={{ '--project-count': COUNT }}>
      <div className="arc-stage">
        <div className="arc-image-panel">
          <motion.div className="arc-image-track" style={{ y: imageY }}>
            {PROJECTS.map((project, index) => <img key={project.name} src={project.image}
              alt={`${project.name} project screenshot`} className="arc-project-image" style={{ top: `${index * 100}%` }}
              aria-hidden={index !== active} />)}
          </motion.div>
          <h2>Projects.</h2>
        </div>
        <div className="arc-list-panel">
          <div className="arc-guide arc-guide-outer" aria-hidden="true" />
          <div className="arc-guide arc-guide-inner" aria-hidden="true" />
          <button className="arc-view" onClick={() => setDetail(PROJECTS[active])}>View project <FiArrowUpRight /></button>
          <div className="arc-direction-controls">
            <button onClick={() => go(-1)} disabled={active === 0} aria-label="Previous project"><FiArrowUpLeft /></button>
            <button onClick={() => go(1)} disabled={active === COUNT - 1} aria-label="Next project"><FiArrowDownLeft /></button>
          </div>
          <span className="arc-active-dot" aria-hidden="true" />
          <div className="arc-name-list" aria-label="Projects">
            {Array.from({ length: COUNT + 8 }, (_, n) => n - 4).map(index =>
              <ProjectName key={index} index={index} position={position} active={active} open={setDetail} />)}
          </div>
          <a className="arc-more" href="https://github.com/simba12-gif" target="_blank" rel="noopener noreferrer">More on GitHub <FiArrowUpRight /></a>
          <span className="arc-counter" aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(COUNT).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
    {detail && <ProjectDetails project={detail} close={() => setDetail(null)} />}
  </>
}
