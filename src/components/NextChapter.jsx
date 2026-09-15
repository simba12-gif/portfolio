import { FiArrowRight } from 'react-icons/fi'
import Magnetic from './Magnetic.jsx'

// Quiet wayfinding pill in a section's bottom-right corner: "Next — The Story →".
// Desktop-only; the bordered cream surface keeps it readable over any backdrop.
export default function NextChapter({ index, label, onNavigate }) {
  return (
    <Magnetic className="absolute bottom-8 right-8 z-10 hidden lg:block">
      <button
        onClick={() => onNavigate(index)}
        className="flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-4 py-2 text-xs font-semibold text-ink transition-colors duration-300 hover:border-flame"
      >
        Next — {label}
        <FiArrowRight aria-hidden="true" />
      </button>
    </Magnetic>
  )
}
