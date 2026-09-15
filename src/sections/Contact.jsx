import { motion } from 'framer-motion'
import { FiArrowUp, FiArrowUpRight } from 'react-icons/fi'
import Chapter from '../components/Chapter.jsx'
import Magnetic from '../components/Magnetic.jsx'
import RevealText from '../components/RevealText.jsx'
import { CONTACTS } from '../data.js'

const item = {
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  hidden: { opacity: 0, y: 30 },
}

export default function Contact({ active, onNavigate }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <motion.div
        className="relative mx-auto flex w-full max-w-5xl grow flex-col justify-center px-5 md:px-10 lg:pl-24"
        initial={false}
        animate={active ? 'show' : 'hidden'}
        variants={{ show: { transition: { staggerChildren: 0.12 } }, hidden: {} }}
      >
        <motion.div className="relative w-fit" variants={item}>
          <Chapter num="05" title="The Next Chapter" />
          <RevealText
            className="display-lg"
            segments={[
              { text: 'Let’s write the ' },
              { text: 'next chapter.', className: 'italic' },
            ]}
          />
        </motion.div>

        <motion.p className="mt-5 max-w-2xl text-base text-muted md:text-lg" variants={item}>
          Open to full-stack and Generative AI opportunities, collaborations, or just a good
          conversation about tech and design.
        </motion.p>

        {/* Primary CTA: the address itself, set large — no pill, no fill. */}
        <motion.a
          variants={item}
          href="mailto:kakiharshita@gmail.com"
          className="group mt-9 inline-flex w-fit items-baseline gap-3"
        >
          <span className="font-serif-x relative text-2xl font-semibold tracking-tight md:text-4xl">
            kakiharshita@gmail.com
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-ink/25 transition-all duration-300 ease-out group-hover:scale-x-100 group-hover:bg-flame"
            />
          </span>
          <FiArrowUpRight
            aria-hidden="true"
            className="text-xl text-muted transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-flame md:text-2xl"
          />
        </motion.a>

        <motion.p
          variants={item}
          className="mt-12 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted"
        >
          Elsewhere on the internet
        </motion.p>
        <motion.ul className="mt-2 max-w-2xl border-t border-ink/20" variants={item}>
          {CONTACTS.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target={c.external ? '_blank' : undefined}
                rel={c.external ? 'noreferrer noopener' : undefined}
                className="group flex items-baseline justify-between gap-6 border-b border-ink/10 py-3.5 transition-colors duration-300 hover:border-flame/60"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-ink">
                  {c.label}
                </span>
                <span className="flex items-center gap-2 text-sm text-ink">
                  {c.value}
                  <FiArrowUpRight
                    aria-hidden="true"
                    className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </a>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.footer
        className="relative flex items-center justify-between border-t border-ink/10 bg-cream/50 px-5 py-5 text-xs text-muted backdrop-blur-sm md:px-10 lg:pb-8 lg:pl-24"
        variants={item}
        initial={false}
        animate={active ? 'show' : 'hidden'}
      >
        <span>© 2026 Kaki Harshita. Built with React &amp; a lot of curiosity.</span>
        <Magnetic>
          <button
            onClick={() => onNavigate(0)}
            className="flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 font-semibold text-ink transition-colors hover:border-flame"
          >
            Back to start <FiArrowUp aria-hidden="true" />
          </button>
        </Magnetic>
      </motion.footer>
    </div>
  )
}
