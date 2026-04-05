import { useState, useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════
   NAVBAR — Luxury Minimalist + Clingy Growth Troll
   TROLL: After scrolling past hero, slowly grows taller
   ═══════════════════════════════════════════════════ */

export default function Navbar() {
  const [pastHero, setPastHero] = useState(false)
  const [height, setHeight] = useState(64)
  const maxGrowth = useRef(false)
  // mobile menu removed — kept minimal for luxury feel

  useEffect(() => {
    const handleScroll = () => {
      const isBelow = window.scrollY > window.innerHeight * 2.5
      setPastHero(isBelow)

      // TROLL: Grow after passing hero
      if (isBelow && !maxGrowth.current) {
        setHeight(prev => {
          if (prev >= 130) {
            maxGrowth.current = true
            return 130
          }
          return prev + 0.03
        })
      }

      // Shrink back once user scrolls past collection
      if (window.scrollY > window.innerHeight * 6) {
        maxGrowth.current = true
        setHeight(64)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: `${height}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 5%',
      background: pastHero
        ? 'rgba(10, 10, 10, 0.95)'
        : 'transparent',
      backdropFilter: pastHero ? 'blur(10px)' : 'none',
      borderBottom: pastHero ? '1px solid var(--accent-gold-border)' : 'none',
      transition: 'background 0.5s ease, backdrop-filter 0.5s ease, height 0.5s ease',
    }}>
      {/* Logo */}
      <a
        href="#"
        onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          letterSpacing: '0.2em',
          color: 'var(--accent-gold)',
          textDecoration: 'none',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        COMPOSURE
      </a>

      {/* Desktop Links */}
      <div style={{
        display: 'flex',
        gap: '32px',
        alignItems: 'center',
      }}
        className="nav-links"
      >
        {['Collection', 'About', 'Pricing', 'FAQ'].map(link => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            {link}
          </a>
        ))}
      </div>

      {/* CTA */}
      <button
        className="btn btn-small"
        style={{
          padding: '8px 24px',
          fontSize: '0.7rem',
        }}
      >
        Shop Now
      </button>

      {/* Clingy narrator */}
      {height > 100 && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--text-muted)',
          opacity: Math.min(1, (height - 100) / 30),
          transition: 'opacity 0.3s ease',
        }}>
          This navbar is getting taller. We're not sure why. There is no way to stop it.
        </div>
      )}
    </nav>
  )
}
