import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowUp, FiArrowUpRight } from 'react-icons/fi'
import RevealText from '../components/RevealText.jsx'
import { CONTACTS } from '../data.js'
import './Contact.css'

const item = {
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  hidden: { opacity: 0, y: 30 },
}

function ContactRow({ contact }) {
  const [phase, setPhase] = useState('idle')
  const pointerInside = useRef(false)
  const keyboardFocus = useRef(false)
  const leave = () => {
    if (!pointerInside.current && !keyboardFocus.current) setPhase('leaving')
  }
  const content = <>
    <span className="contact-row-label text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
      {contact.label}
    </span>
    <span className="contact-row-value flex items-center gap-2 text-sm text-ink">
      {contact.value}<FiArrowUpRight aria-hidden="true" className="contact-row-arrow text-muted" />
    </span>
  </>
  return <li>
    <a href={contact.href} target={contact.external ? '_blank' : undefined}
      rel={contact.external ? 'noreferrer noopener' : undefined}
      className="contact-row flex items-baseline justify-between gap-6 border-b border-ink/10 py-3.5"
      data-fill={phase}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse') return
        pointerInside.current = true
        setPhase('active')
      }}
      onPointerLeave={() => { pointerInside.current = false; leave() }}
      onFocus={(event) => {
        keyboardFocus.current = event.currentTarget.matches(':focus-visible')
        if (keyboardFocus.current) setPhase('active')
      }}
      onBlur={() => { keyboardFocus.current = false; leave() }}
    >
      {content}
      {/* The clipped copy inverts only the text already covered by the sweep.
          Counter-translation keeps both copies perfectly registered. */}
      <span className="contact-row-fill" aria-hidden="true"
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget && event.propertyName === 'transform' && phase === 'leaving') setPhase('idle')
        }}>
        <span className="contact-row-fill-copy">{content}</span>
      </span>
    </a>
  </li>
}

export default function Contact({ active, onNavigate }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <motion.div
        className="contact-content section-grid relative mx-auto flex w-full max-w-5xl grow flex-col justify-center px-5 md:px-10 lg:pl-24"
        initial={false}
        animate={active ? 'show' : 'hidden'}
        variants={{ show: { transition: { staggerChildren: 0.12 } }, hidden: {} }}
      >
        <motion.div className="relative w-fit" variants={item}>

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

        <motion.ul className="contact-links mt-9 max-w-2xl" variants={item}>
          {CONTACTS.map((contact) => <ContactRow key={contact.label} contact={contact} />)}
        </motion.ul>
      </motion.div>

      <motion.footer
        className="contact-footer relative flex items-center justify-between border-t border-ink/10 bg-cream/50 px-5 py-5 text-xs text-muted backdrop-blur-sm md:px-10 lg:pb-8 lg:px-[6vw]"
        variants={item}
        initial={false}
        animate={active ? 'show' : 'hidden'}
      >
        <span>© 2026 Kaki Harshita. Built with React &amp; a lot of curiosity.</span>
          <button
            onClick={() => onNavigate(0)}
            className="flex items-center gap-1.5 px-1 py-2 font-semibold text-ink transition-colors hover:border-flame"
          >
            Back to start <FiArrowUp aria-hidden="true" />
          </button>
      </motion.footer>
    </div>
  )
}
