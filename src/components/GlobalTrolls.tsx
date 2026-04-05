import { useEffect, useRef, useState } from 'react'

/* ═══════════════════════════════════════════════════
   GLOBAL TROLLS — Always running across the page
   - Fake second cursor
   - Tab title evolution
   - Scroll speed shame
   - Page tilt
   ═══════════════════════════════════════════════════ */

export default function GlobalTrolls() {
  const [fakeCursor, setFakeCursor] = useState({ x: 0, y: 0, visible: false })
  const [scrollShame, setScrollShame] = useState('')
  const lastScrollY = useRef(0)
  const lastScrollTime = useRef(Date.now())
  const scrollShameTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // TAB TITLE EVOLUTION
  useEffect(() => {
    const titles = [
      'COMPOSURE™',
      'COMPOSURE™ — Inhale',
      'COMPOSURE™ — Are you still sniffing?',
      'COMPOSURE™ — Your screen doesn\'t have a smell.',
      'COMPOSURE™ — ...or does it?',
      'COMPOSURE™ — Don\'t you have work?',
      'COMPOSURE™ — We see you 👀',
      'COMPOSURE™ — Okay we respect the commitment',
    ]
    let i = 0
    const interval = setInterval(() => {
      i = Math.min(i + 1, titles.length - 1)
      document.title = titles[i]
    }, 30000)
    return () => { clearInterval(interval); document.title = 'COMPOSURE™' }
  }, [])

  // FAKE SECOND CURSOR — appears after 20 seconds
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setFakeCursor(prev => ({ ...prev, visible: true }))

      const handleMouse = (e: MouseEvent) => {
        // 200ms delay via requestAnimationFrame
        setTimeout(() => {
          setFakeCursor({ x: e.clientX, y: e.clientY, visible: true })
        }, 200)
      }
      window.addEventListener('mousemove', handleMouse)

      // Remove after 15 seconds
      const endTimer = setTimeout(() => {
        setFakeCursor(prev => ({ ...prev, visible: false }))
        window.removeEventListener('mousemove', handleMouse)
      }, 15000)

      return () => {
        window.removeEventListener('mousemove', handleMouse)
        clearTimeout(endTimer)
      }
    }, 20000)

    return () => clearTimeout(startTimer)
  }, [])

  // SCROLL SPEED SHAME
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now()
      const dy = Math.abs(window.scrollY - lastScrollY.current)
      const dt = now - lastScrollTime.current

      if (dt > 0 && dy / dt > 8) {
        // Very fast scrolling
        clearTimeout(scrollShameTimer.current)
        setScrollShame(
          `You just scrolled ${Math.round(dy)}px in ${(dt / 1000).toFixed(1)}s. That's a new record. We put effort into those sections. But that's fine.`
        )
        scrollShameTimer.current = setTimeout(() => setScrollShame(''), 5000)
      }

      lastScrollY.current = window.scrollY
      lastScrollTime.current = now
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // PAGE TILT — subtle 0.3deg rotation
  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.style.transform = 'rotate(0.3deg)'
      document.body.style.transformOrigin = 'center center'
      document.body.style.transition = 'transform 60s linear'

      // Reset after 60 seconds
      const reset = setTimeout(() => {
        document.body.style.transform = ''
      }, 60000)

      return () => clearTimeout(reset)
    }, 45000) // Start after 45 seconds

    return () => clearTimeout(timer)
  }, [])

  // BEFOREUNLOAD
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = 'Wait — are you sure? The molecules will miss you.'
      return e.returnValue
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])

  return (
    <>
      {/* FAKE CURSOR */}
      {fakeCursor.visible && (
        <div style={{
          position: 'fixed',
          left: fakeCursor.x - 4,
          top: fakeCursor.y - 4,
          width: '20px',
          height: '20px',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'left 0.03s linear, top 0.03s linear',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 2L8 18L10 10L18 8L2 2Z" fill="var(--accent-gold)" fillOpacity="0.5" />
          </svg>
        </div>
      )}

      {/* SCROLL SHAME MESSAGE */}
      {scrollShame && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg-card)',
          border: '1px solid var(--accent-gold-border)',
          padding: '12px 20px',
          zIndex: 99998,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--accent-gold)',
          maxWidth: '500px',
          textAlign: 'center',
          animation: 'fadeIn 0.4s ease',
        }}>
          {scrollShame}
        </div>
      )}
    </>
  )
}
