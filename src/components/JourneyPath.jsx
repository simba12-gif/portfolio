// Quiet dotted "storyline" thread that winds across the whole horizontal
// canvas, connecting the five chapters. Purely visual; sits behind the sections.
export default function JourneyPath() {
  return (
    <svg
      viewBox="0 0 5000 900"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <path
        d="M -60 240 C 260 140, 430 430, 720 480 S 1060 300, 1320 270 S 1680 540, 1940 570 S 2280 340, 2540 310 S 2880 610, 3140 630 S 3480 330, 3740 310 S 4080 560, 4340 540 S 4740 320, 5060 340"
        fill="none"
        stroke="rgba(16, 6, 11, 0.13)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="1 14"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
