import { motion } from 'framer-motion'

export default function ProgressDots({ sections, activeIndex, onNavigate }) {
  const progress = ((activeIndex + 1) / sections.length) * 100

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div className="pointer-events-auto mx-auto mb-4 hidden w-fit items-center gap-3 rounded-full border border-ink/10 bg-surface/80 px-5 py-2.5 backdrop-blur lg:flex">
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => onNavigate(i)}
            aria-label={`Go to ${s.name} section`}
            aria-current={i === activeIndex ? 'true' : undefined}
            className="group relative flex h-4 w-4 items-center justify-center"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'h-2.5 w-2.5 bg-flame'
                  : 'h-1.5 w-1.5 bg-ink/20 group-hover:bg-ink/50'
              }`}
            />
          </button>
        ))}
      </div>
      <div className="h-0.5 w-full bg-ink/10">
        <motion.div
          className="h-full bg-flame"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}
