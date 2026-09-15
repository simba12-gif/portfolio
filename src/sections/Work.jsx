import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { FiArrowUpRight, FiGithub } from 'react-icons/fi'
import Chapter from '../components/Chapter.jsx'
import NextChapter from '../components/NextChapter.jsx'
import ProjectCursor from '../components/ProjectCursor.jsx'
import RevealText from '../components/RevealText.jsx'
import Tilt from '../components/Tilt.jsx'
import { PROJECTS } from '../data.js'

const GITHUB_PROFILE = 'https://github.com/simba12-gif'
const COUNT = String(PROJECTS.length).padStart(2, '0')
// Strip geometry, mirroring App's SPANS ([1,1,1,1+N,1]): project panel i sits at
// strip coordinate 4 + i screens, and the full pan covers LAST screens.
const LAST = 4 + PROJECTS.length

// The oversized background numeral, drifting a few vw slower than the pan while
// its panel crosses the viewport — a far depth plane behind the text.
function GhostNumeral({ progress, i }) {
  const x = useTransform(progress, [(3 + i) / LAST, (5 + i) / LAST], ['7vw', '-7vw'])
  return (
    <motion.span
      aria-hidden="true"
      style={{ x, y: '-50%' }}
      className="font-serif-x pointer-events-none absolute left-[1vw] top-1/2 select-none text-[22rem] font-bold leading-none text-ink/[0.045] transition-colors duration-700 group-hover:text-ink/[0.07] xl:text-[26rem]"
    >
      {String(i + 1).padStart(2, '0')}
    </motion.span>
  )
}

const card = {
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hidden: { opacity: 0, y: 40 },
}

// An understated editorial link: a bullet, a label, and a hairline that draws in
// from the left on hover while the arrow nudges out. No button, no fill.
function ProjectLink({ href, children, accent = 'flame' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor="link"
      className="group/link inline-flex items-center gap-2.5 text-sm text-ink outline-offset-4"
    >
      <span
        aria-hidden="true"
        className={`size-[5px] rounded-full ${accent === 'firewatch' ? 'bg-firewatch' : 'bg-flame'}`}
      />
      <span className="relative pb-0.5">
        {children}
        <span
          aria-hidden="true"
          className={`absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/link:scale-x-100 ${accent === 'firewatch' ? 'bg-firewatch' : 'bg-flame'}`}
        />
      </span>
      <FiArrowUpRight
        aria-hidden="true"
        className="transition-transform duration-300 ease-out group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
      />
    </a>
  )
}

// The category / name / description / links hierarchy, shared by the desktop
// panels and the stacked mobile list. `desktop` only tweaks the type scale and
// enables the hover-reveal behaviours.
function ProjectBody({ project, index, desktop }) {
  return (
    <>
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
        {project.kicker}
      </span>
      <h3
        className={`font-serif-x mt-4 font-semibold leading-[0.98] tracking-[-0.02em] ${
          desktop
            ? 'text-6xl transition-transform duration-500 ease-out group-hover:translate-x-2 xl:text-7xl'
            : 'text-4xl'
        }`}
      >
        {project.name}
      </h3>
      <p
        className={`mt-5 text-[15px] leading-relaxed text-muted ${desktop ? 'max-w-xl' : 'max-w-none'}`}
      >
        {project.blurb}
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
        {project.live && <ProjectLink href={project.live}>Live Demo</ProjectLink>}
        {project.github && (
          <ProjectLink href={project.github} accent="firewatch">
            Source
          </ProjectLink>
        )}
      </div>
      {/* Stack stays out of the way — surfaced only on hover, never as badges. */}
      <p
        className={`mt-6 font-mono text-[11px] tracking-wide text-muted/70 ${
          desktop
            ? 'opacity-0 transition-opacity duration-500 group-hover:opacity-100'
            : 'opacity-70'
        }`}
      >
        <span className="text-muted/50">{String(index + 1).padStart(2, '0')}</span>
        <span className="mx-2 text-muted/30">/</span>
        {project.tech.join(' · ')}
      </p>
    </>
  )
}

export default function Work({ active, onNavigate }) {
  const reduced = useReducedMotion()
  const cursorRoot = useRef(null)
  // Page scroll maps one-to-one onto the strip pan; drives the numeral parallax.
  const { scrollYProgress } = useScroll()

  return (
    <div className="relative h-full">
      {/* Desktop: the page's single horizontal pan glides through a title screen
          and then one full-height editorial panel per project — each panel is a
          Firma-style row (category · large serif name · description · minimal
          links) set off by a thin vertical rule. No inner scroll; the strip flows
          straight on into Contact. Reduced motion falls back to the stacked list. */}
      <div
        ref={cursorRoot}
        className={`relative hidden h-full ${reduced ? '' : 'lg:flex'}`}
      >
        <ProjectCursor containerRef={cursorRoot} />

        {/* Title screen — "My / Projects (04)". */}
        <motion.div
          className="flex h-full w-screen shrink-0 flex-col justify-center px-[5vw] xl:px-[6vw]"
          initial={false}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
        >
          <Chapter num="04" title="Selected Work" />
          <p className="font-serif-x text-2xl italic text-muted">My</p>
          <div className="mt-1 flex items-end justify-between gap-6">
            <RevealText className="display-xl" segments={[{ text: 'Projects' }]} />
            <span className="font-serif-x mb-3 text-3xl text-muted xl:text-4xl">({COUNT})</span>
          </div>

          {/* Editorial index — a quiet table of contents for the panels ahead. */}
          <ul className="mt-10 max-w-2xl divide-y divide-ink/10 border-y border-ink/20">
            {PROJECTS.map((p, i) => (
              <li key={p.name}>
                {/* Jump straight to this build's panel on the strip */}
                <button
                  onClick={() =>
                    window.scrollTo({ top: (4 + i) * window.innerHeight, behavior: 'smooth' })
                  }
                  data-cursor="link"
                  className="group/idx flex w-full items-baseline gap-5 py-3.5 text-left"
                >
                  <span className="font-mono text-xs text-muted/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-serif-x text-xl font-semibold transition-transform duration-300 ease-out group-hover/idx:translate-x-1.5">
                    {p.name}
                  </span>
                  <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.18em] text-muted/70">
                    {p.kicker}
                  </span>
                  <FiArrowUpRight
                    aria-hidden="true"
                    className="self-center text-muted opacity-0 transition-all duration-300 group-hover/idx:translate-x-1 group-hover/idx:opacity-100"
                  />
                </button>
              </li>
            ))}
          </ul>

          <a
            href={GITHUB_PROFILE}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="link"
            className="group mt-12 inline-flex w-fit items-center gap-3 text-sm text-muted transition-colors duration-300 hover:text-ink"
          >
            <FiGithub aria-hidden="true" className="text-base" />
            More experiments on GitHub
            <FiArrowUpRight
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </motion.div>

        {PROJECTS.map((p, i) => (
          <motion.article
            key={p.name}
            data-cursor="project"
            className="group relative flex h-full w-screen shrink-0 items-center px-[5vw] xl:px-[6vw]"
            initial={false}
            animate={active ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Vertical separator between builds — the Firma rule, turned upright. */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-1/2 h-[64%] w-px -translate-y-1/2 origin-center scale-y-90 bg-ink/15 transition-all duration-500 ease-out group-hover:scale-y-100 group-hover:bg-flame/60"
            />
            <GhostNumeral progress={scrollYProgress} i={i} />
            {/* Half background: the build's real landing page, feathered into the
                cream so it reads as a plane behind the text, not a screenshot box.
                It sharpens and saturates as the row is hovered. */}
            {p.image && (
              /* The image IS the card link: click anywhere on it to open the
                 build (live site first, GitHub as fallback). The VIEW circle
                 trailing the pointer here is decorative — pointer-events: none,
                 so every click lands on this anchor. */
              <a
                href={p.live ?? p.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`View ${p.name} — ${p.live ? 'live site' : 'GitHub repository'}`}
                data-cursor="view"
                className="group/card absolute inset-y-0 right-0 w-1/2 outline-offset-[-3px] focus-visible:outline-2 focus-visible:outline-flame"
              >
                <Tilt max={5} className="h-full w-full">
                  <div className="h-full w-full overflow-hidden [mask-image:linear-gradient(to_left,black_40%,transparent_85%)]">
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-left-top opacity-75 saturate-[0.8] transition-all duration-500 ease-out group-hover/card:scale-[1.02] group-hover/card:opacity-95 group-hover/card:saturate-100"
                    />
                  </div>
                </Tilt>
              </a>
            )}
            {/* pointer-events-none on the grid, re-enabled on its content: the
                grid's transparent box spans the whole panel and would otherwise
                sit on top of the image link and swallow its hovers/clicks. */}
            <div className="pointer-events-none relative grid w-full grid-cols-[minmax(0,26%)_minmax(0,1fr)] items-start gap-x-10 xl:gap-x-16">
              <span className="pointer-events-auto mt-1 font-mono text-sm text-muted/60">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pointer-events-auto max-w-xl">
                <ProjectBody project={p} index={i} desktop />
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Below lg (or reduced motion): the literal Firma layout — a vertical list
          of editorial rows separated by thin rules, in normal document flow. */}
      <motion.div
        className={`mx-auto w-full max-w-2xl px-5 py-6 md:px-8 ${reduced ? '' : 'lg:hidden'}`}
        initial={false}
        animate={active ? 'show' : 'hidden'}
        variants={{ show: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
      >
        <Chapter num="04" title="Selected Work" variants={card} />
        <motion.p variants={card} className="font-serif-x text-xl italic text-muted">
          My
        </motion.p>
        <motion.div variants={card} className="mt-1 flex items-end justify-between gap-4">
          <RevealText className="display-lg" segments={[{ text: 'Projects' }]} />
          <span className="font-serif-x mb-2 text-2xl text-muted">({COUNT})</span>
        </motion.div>

        <div className="mt-12 flex flex-col">
          {PROJECTS.map((p, i) => (
            <motion.article key={p.name} variants={card} className="py-10 first:pt-2">
              {p.image && (
                /* Tappable card image — same destination logic as desktop. */
                <a
                  href={p.live ?? p.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`View ${p.name} — ${p.live ? 'live site' : 'GitHub repository'}`}
                  className="mb-5 block overflow-hidden rounded-md border border-ink/10 focus-visible:outline-2 focus-visible:outline-flame"
                >
                  <img
                    src={p.image}
                    alt={`${p.name} — landing page`}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[16/9] w-full object-cover object-top"
                  />
                </a>
              )}
              <ProjectBody project={p} index={i} desktop={false} />
              {i < PROJECTS.length - 1 && (
                <span aria-hidden="true" className="mt-10 block h-px w-full bg-ink/15" />
              )}
            </motion.article>
          ))}
        </div>

        <motion.a
          variants={card}
          href={GITHUB_PROFILE}
          target="_blank"
          rel="noreferrer noopener"
          className="group mt-8 inline-flex items-center gap-3 text-sm text-muted transition-colors duration-300 hover:text-ink"
        >
          <FiGithub aria-hidden="true" className="text-base" />
          More experiments on GitHub
          <FiArrowUpRight
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </motion.a>
      </motion.div>

      <NextChapter index={4} label="The Next Chapter" onNavigate={onNavigate} />
    </div>
  )
}
