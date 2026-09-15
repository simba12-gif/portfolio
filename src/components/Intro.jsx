import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Quick one-time title card on load: name + "a portfolio in five chapters",
// gone in under two seconds. Skipped for reduced motion.
export default function Intro() {
  const reduced = useReducedMotion()
  const [done, setDone] = useState(false)

  if (reduced || done) return null

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-cream"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.4, duration: 0.5, ease: 'easeInOut' }}
      onAnimationComplete={() => setDone(true)}
    >
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif-x text-4xl font-bold tracking-tight md:text-6xl"
      >
        Kaki Harshita<span className="text-muted">.</span>
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="font-serif-x mt-3 text-base italic text-muted md:text-lg"
      >
        A portfolio in five chapters ✦
      </motion.p>
    </motion.div>
  )
}
