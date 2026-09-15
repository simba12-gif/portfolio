import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

// Pointer-tracking 3D tilt: the surface leans toward the cursor with a springed
// rotateX/rotateY around a CSS perspective, and settles flat on leave. Purely
// presentational — layout, clicks, and focus pass straight through. Reduced
// motion (or touch, where pointermove never streams) renders a plain wrapper.
export default function Tilt({ children, max = 8, className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  // Pointer position inside the element, 0..1 on both axes (0.5 = centre).
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 160, damping: 18, mass: 0.6 }
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)

  if (reduced) return <div className={className}>{children}</div>

  const onPointerMove = (e) => {
    if (e.pointerType === 'touch' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onPointerLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
