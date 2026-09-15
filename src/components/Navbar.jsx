import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMail, FiMenu, FiX } from 'react-icons/fi'
import Magnetic from './Magnetic.jsx'

export default function Navbar({ sections, activeIndex, onNavigate }) {
  const [open, setOpen] = useState(false)

  const go = (i) => {
    setOpen(false)
    onNavigate(i)
  }

  return (
    <>
      {/* Mobile / tablet: top bar with hamburger menu */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-cream/70 backdrop-blur-md lg:hidden">
        <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:px-10">
          <button
            onClick={() => go(0)}
            className="font-serif-x text-xl font-bold tracking-tight text-ink"
            aria-label="Go to home section"
          >
            Harshita<span className="text-flame">.</span>
          </button>

          <div className="flex items-center gap-5">
            <span
              className="font-display hidden text-sm font-semibold text-muted sm:block"
              aria-hidden="true"
            >
              ({sections[activeIndex].num})
            </span>
            <button
              onClick={() => go(sections.length - 1)}
              className="hidden rounded-full bg-flame px-5 py-2 text-sm font-semibold text-cream transition-colors duration-300 hover:bg-firewatch sm:block"
            >
              Let&apos;s Connect
            </button>
            <button
              className="text-2xl text-ink"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="border-b border-ink/10 bg-cream/90 backdrop-blur-md"
            >
              <ul className="flex flex-col gap-1 px-5 py-4">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <button
                      onClick={() => go(i)}
                      className={`font-display w-full py-2 text-left text-lg font-semibold ${
                        i === activeIndex ? 'italic text-ink underline decoration-flame underline-offset-4' : 'text-ink'
                      }`}
                    >
                      <span className="mr-3 text-sm text-muted/70">{s.num}</span>
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Desktop: vertical side rail */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-20 flex-col items-center justify-between border-r border-ink/10 bg-cream/60 py-6 backdrop-blur-md lg:flex">
        <button
          onClick={() => go(0)}
          className="font-serif-x text-2xl font-bold tracking-tight text-ink"
          aria-label="Go to home section"
        >
          H<span className="text-flame">.</span>
        </button>

        <ul className="flex flex-col items-center gap-7">
          {sections.map((s, i) => (
            <li key={s.id} className="relative">
              <button
                onClick={() => go(i)}
                aria-current={i === activeIndex ? 'true' : undefined}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  i === activeIndex ? 'font-semibold text-ink' : 'text-muted/80 hover:text-ink'
                }`}
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                {s.name}
              </button>
              <span
                aria-hidden="true"
                className={`absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-flame transition-opacity duration-300 ${
                  i === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-4">
          <span
            className="font-display text-xs font-semibold text-muted"
            aria-hidden="true"
          >
            ({sections[activeIndex].num})
          </span>
          <Magnetic strength={0.3}>
            <button
              onClick={() => go(sections.length - 1)}
              aria-label="Let's connect"
              title="Let's Connect"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-flame text-lg text-cream transition-colors duration-300 hover:bg-firewatch"
            >
              <FiMail aria-hidden="true" />
            </button>
          </Magnetic>
        </div>
      </aside>
    </>
  )
}
