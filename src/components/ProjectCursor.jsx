import { useEffect, useRef, useState } from 'react'

// Editorial cursor accent for the Projects strip: a small ring that trails the
// native cursor (which stays fully visible) with eased interpolation — a lerp in
// a rAF loop, never a re-render per mousemove — and quietly swells over a
// project or firms up over a link. Scoped to the Work container passed via
// `containerRef`: it only shows while the pointer is inside, and it reads hover
// intent from `data-cursor` attributes so the rows stay decoupled from it.
// Fine pointers only — coarse/touch and reduced-motion users see nothing extra.
export default function ProjectCursor({ containerRef }) {
  const dotRef = useRef(null)
  const target = useRef({ x: -100, y: -100 })
  const pos = useRef({ x: -100, y: -100 })
  const raf = useRef(0)
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [variant, setVariant] = useState('default') // 'default' | 'project' | 'link' | 'view'

  // Gate on a fine pointer + motion preference, re-checked if the media changes.
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const sync = () => setEnabled(fine.matches && motionOk.matches)
    sync()
    fine.addEventListener('change', sync)
    motionOk.addEventListener('change', sync)
    return () => {
      fine.removeEventListener('change', sync)
      motionOk.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!enabled || !el) return

    const onMove = (e) => {
      if (e.pointerType === 'touch') return
      target.current = { x: e.clientX, y: e.clientY }
      const t = e.target instanceof Element ? e.target : null
      // 'view' (the clickable project image) outranks 'link' outranks 'project'.
      const next = t?.closest('[data-cursor="view"]')
        ? 'view'
        : t?.closest('[data-cursor="link"]')
          ? 'link'
          : t?.closest('[data-cursor="project"]')
            ? 'project'
            : 'default'
      setVariant((v) => (v === next ? v : next))
    }
    window.addEventListener('pointermove', onMove)

    // Visibility is derived from position every frame, not from enter/leave
    // events: the page pans the strip under a stationary pointer (and the pan
    // lags the scroll on a spring), so boundary events can't be trusted. A rect
    // check inside the rAF loop always agrees with what's under the mouse.
    let wasInside = false
    const tick = () => {
      const { x, y } = target.current
      const r = el.getBoundingClientRect()
      const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
      if (inside !== wasInside) {
        // Seed on re-entry so the ring doesn't streak in from its last spot.
        if (inside) pos.current = { x, y }
        wasInside = inside
        setVisible(inside)
      }
      const ease = 0.18
      pos.current.x += (target.current.x - pos.current.x) * ease
      pos.current.y += (target.current.y - pos.current.y) * ease
      const node = dotRef.current
      if (node) {
        node.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [enabled, containerRef])

  if (!enabled) return null

  const size = variant === 'view' ? 64 : variant === 'project' ? 72 : variant === 'link' ? 12 : 14
  const filled = variant === 'link' || variant === 'view'

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 flex items-center justify-center rounded-full border border-flame transition-[width,height,background-color,opacity] duration-300 ease-out"
      style={{
        width: size,
        height: size,
        opacity: visible ? (variant === 'project' ? 0.5 : 1) : 0,
        backgroundColor: filled ? 'var(--color-flame)' : 'transparent',
      }}
    >
      {/* Label only in the VIEW state — the circle is a visual affordance; the
          click lands on the image's own <a> underneath (pointer-events: none
          on this whole element). */}
      <span
        className="select-none text-[10px] font-semibold uppercase tracking-[0.18em] text-cream transition-opacity duration-200"
        style={{ opacity: variant === 'view' && visible ? 1 : 0 }}
      >
        View
      </span>
    </div>
  )
}
