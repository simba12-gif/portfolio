import { motion, useReducedMotion } from 'framer-motion'

// Editorial heading reveal: each word rises out of an overflow-hidden slot when
// the heading scrolls into view, once per visit. The IntersectionObserver sits
// on the heading itself — the words start fully clipped by their slots, so
// observing them directly would never fire (IO clips by ancestor overflow).
// The 'show' variant then propagates down to every word span. `segments` lets a
// heading mix styled runs (a gradient or italic word) without losing the
// per-word cascade. Reduced motion renders the plain heading.
const wordVariants = {
  hidden: { y: '115%' },
  show: ({ index, delay }) => ({
    y: '0%',
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: delay + index * 0.055 },
  }),
}

export default function RevealText({ as = 'h2', className = '', segments, delay = 0 }) {
  const reduced = useReducedMotion()
  const Tag = as

  if (reduced) {
    return (
      <Tag className={className}>
        {segments.map((s, i) => (
          <span key={i} className={s.className}>
            {s.text}
          </span>
        ))}
      </Tag>
    )
  }

  const MotionTag = motion[as]
  let word = 0
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {segments.map((s, si) =>
        // Keep whitespace outside the clipped slots so lines wrap naturally.
        s.text.split(/(\s+)/).map((part, pi) =>
          part.trim() === '' ? (
            part
          ) : (
            // The slot: clips the rising word; the vertical padding keeps serif
            // ascenders/descenders from being shaved during the motion.
            <span
              key={`${si}-${pi}`}
              className="-my-[0.14em] inline-block overflow-hidden py-[0.14em] align-bottom"
            >
              <motion.span
                className={`inline-block ${s.className ?? ''}`}
                variants={wordVariants}
                custom={{ index: word++, delay }}
              >
                {part}
              </motion.span>
            </span>
          ),
        ),
      )}
    </MotionTag>
  )
}
