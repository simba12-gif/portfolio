import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

// Magnetic hover: the wrapped element leans toward the pointer by a fraction of
// the pointer's offset from its centre, and springs home on leave. Purely
// presentational — the hit area never moves, only the visual. Touch and
// reduced-motion render a plain wrapper.
export default function Magnetic({ children, strength = 0.25, className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const spring = { stiffness: 200, damping: 16, mass: 0.4 }
  const x = useSpring(mx, spring)
  const y = useSpring(my, spring)

  if (reduced) return <div className={className}>{children}</div>

  const onPointerMove = (e) => {
    if (e.pointerType === 'touch' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onPointerLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
