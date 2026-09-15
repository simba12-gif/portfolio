import { useLayoutEffect, useRef, useState } from 'react'
import { useAnimationFrame } from 'framer-motion'

// A drifting "chain" of cards riding a sine path — the agenius rocket-section
// treatment. Each card is laid out along the curve and rotated to the local
// tangent, so the whole row reads as one wave snaking across the screen.
//
// WAVES must stay an integer: the loop wraps in x, so y and rotation have to
// come back to the same value at p = 1 for the wrap to be invisible.
const WAVES = 2

function metricsFor(width, count) {
  const cardW = Math.max(100, Math.min(158, width / 8.2))
  const cardH = Math.round(cardW * 0.66)
  const gap = cardW * 0.1
  // Long enough that the wrap always happens off-screen, and never so short
  // that the cards pile up on each other.
  const loop = Math.max(count * (cardW + gap), width + cardW * 2)
  const amp = Math.max(30, Math.min(58, width * 0.055))
  return { cardW, cardH, loop, amp, spacing: loop / count, height: cardH + amp * 2 + 20 }
}

export default function SkillWave({ items, direction = 1, phase = 0, speed = 58, hoverable }) {
  const frameRef = useRef(null)
  const cardRefs = useRef([])
  const offset = useRef(0)
  const [width, setWidth] = useState(0)

  const m = metricsFor(width || 1200, items.length)

  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    setWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  // Place every card at its current point on the curve.
  const layout = () => {
    const { cardW, cardH, loop, amp, spacing, height } = metricsFor(width, items.length)
    const midY = height / 2 - cardH / 2
    for (let i = 0; i < items.length; i++) {
      const el = cardRefs.current[i]
      if (!el) continue
      const p = (((offset.current + i * spacing) % loop) + loop) % loop / loop
      const angle = 2 * Math.PI * (WAVES * p + phase)
      const x = p * loop - cardW
      const y = midY + amp * Math.sin(angle)
      // Tangent of the path → the tilt that makes the chain follow the wave.
      const slope = (amp * 2 * Math.PI * WAVES * Math.cos(angle)) / loop
      const rot = (Math.atan(slope) * 180) / Math.PI
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`
    }
  }

  useLayoutEffect(layout, [width, items.length, phase])

  useAnimationFrame((_, delta) => {
    if (!width || delta > 200) return
    const { loop } = metricsFor(width, items.length)
    offset.current = (((offset.current + (direction * speed * delta) / 1000) % loop) + loop) % loop
    layout()
  })

  return (
    <div
      ref={frameRef}
      className="relative w-full overflow-hidden"
      style={{ height: m.height }}
    >
      {items.map((item, i) => (
        <Card
          key={item.skill}
          ref={(el) => (cardRefs.current[i] = el)}
          item={item}
          width={m.cardW}
          height={m.cardH}
          hoverable={hoverable}
        />
      ))}
    </div>
  )
}

function Card({ ref, item, width, height, hoverable }) {
  const { skill, Icon, bg, ink } = item
  return (
    <div
      ref={ref}
      className="group absolute left-0 top-0 flex flex-col items-center justify-center gap-1 overflow-hidden will-change-transform"
      style={{ width, height, borderRadius: width * 0.26, backgroundColor: bg, color: ink }}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className="transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110"
          style={{ fontSize: width * (hoverable ? 0.3 : 0.26) }}
        />
      ) : (
        <span aria-hidden="true" className="size-2 rounded-full bg-current" />
      )}

      {hoverable ? (
        // Sticker parked just above the card's clipped edge; hover drops it in,
        // big enough to cover the mark the way the reference does.
        <span
          className="pointer-events-none absolute left-1/2 top-[-60%] -translate-x-1/2 -translate-y-1/2 -rotate-[13deg] transition-[top] duration-[350ms] ease-out group-hover:top-1/2"
          style={{ width: width * 0.86 }}
        >
          <span className="relative flex items-center justify-center" style={{ height: height * 0.62 }}>
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-[#f5ac66]"
              style={{ filter: 'url(#sticker-rough)' }}
            />
            <span
              className="relative px-2 text-center font-extrabold leading-[1.1] tracking-tight text-[#10060b]"
              style={{ fontSize: Math.max(10, width * 0.088) }}
            >
              {skill}
            </span>
          </span>
        </span>
      ) : (
        // Touch devices never hover, so the name sits under the mark instead.
        <span className="px-1.5 text-center text-[9px] font-bold leading-tight">
          {skill}
        </span>
      )}
    </div>
  )
}
