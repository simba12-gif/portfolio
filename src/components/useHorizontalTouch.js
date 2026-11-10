import { useEffect } from 'react'

// Horizontal gestures feed the existing vertical scroll timeline. Vertical
// gestures and pinch zoom remain native; no second scroll position is created.
export default function useHorizontalTouch(ref, scrollPerPixel) {
  useEffect(() => {
    const el = ref.current
    let start = null
    let horizontal = null
    const begin = (event) => {
      start = event.touches.length === 1 ? event.touches[0] : null
      horizontal = null
    }
    const move = (event) => {
      if (!start || event.touches.length !== 1) return
      const point = event.touches[0]
      const dx = start.clientX - point.clientX
      const dy = start.clientY - point.clientY
      if (horizontal === null && Math.max(Math.abs(dx), Math.abs(dy)) > 8) horizontal = Math.abs(dx) > Math.abs(dy)
      if (!horizontal) return
      event.preventDefault()
      window.scrollBy({ top: dx * scrollPerPixel(), behavior: 'instant' })
      start = point
    }
    const end = () => { start = null }
    el?.addEventListener('touchstart', begin, { passive: true })
    el?.addEventListener('touchmove', move, { passive: false })
    el?.addEventListener('touchend', end)
    el?.addEventListener('touchcancel', end)
    return () => {
      el?.removeEventListener('touchstart', begin)
      el?.removeEventListener('touchmove', move)
      el?.removeEventListener('touchend', end)
      el?.removeEventListener('touchcancel', end)
    }
  }, [ref, scrollPerPixel])
}
