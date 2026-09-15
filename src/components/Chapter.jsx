import { motion } from 'framer-motion'

// Storyline eyebrow shown above each section headline: "✦ Chapter 01 — The Spark".
// Pass `variants` to join the section's stagger; omit it to render inside an
// already-animated wrapper (or statically for reduced motion).
export default function Chapter({ num, title, variants }) {
  return (
    <motion.p variants={variants} className="font-serif-x mb-4 text-sm italic text-ink/60">
      <span aria-hidden="true" className="not-italic text-flame">
        ✦
      </span>{' '}
      Chapter {num} — {title}
    </motion.p>
  )
}
