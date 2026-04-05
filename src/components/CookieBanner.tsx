import { useState, useEffect } from 'react'

/* ═══════════════════════════════════════════════════
   COOKIE BANNER — Returns after dismissal
   TROLL: Keeps coming back 2 more times
   ═══════════════════════════════════════════════════ */

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [dismissCount, setDismissCount] = useState(0)
  const [choice, setChoice] = useState<string | null>(null)

  // Show on mount after 1.5s
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  // TROLL: Return after dismissal
  useEffect(() => {
    if (!visible && dismissCount > 0 && dismissCount < 3) {
      const delay = dismissCount === 1 ? 30000 : 45000
      const t = setTimeout(() => setVisible(true), delay)
      return () => clearTimeout(t)
    }
  }, [visible, dismissCount])

  const handleChoice = (c: string) => {
    setChoice(c)
    setTimeout(() => {
      setVisible(false)
      setDismissCount(prev => prev + 1)
      setChoice(null)
    }, 800)
  }

  if (!visible) return null

  const getMessage = () => {
    if (dismissCount === 0) return 'This website uses cookies. Not tracking cookies. The emotional kind.'
    if (dismissCount === 1) return 'We forgot. Do you still accept inner peace?'
    return 'Last time, we promise. ...Probably.'
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      background: 'var(--bg-card)',
      border: '1px solid var(--accent-gold-border)',
      padding: '20px 28px',
      maxWidth: '520px',
      width: '90%',
      animation: 'fadeIn 0.5s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <p style={{
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
      }}>
        🍪 {getMessage()}
      </p>

      {choice && (
        <p className="narrator" style={{ animation: 'fadeIn 0.3s ease' }}>
          {choice === 'peace' ? 'Wise choice.' : 'Bold choice.'}
        </p>
      )}

      {!choice && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-small btn-gold"
            onClick={() => handleChoice('peace')}
          >
            Accept Inner Peace
          </button>
          <button
            className="btn btn-small"
            onClick={() => handleChoice('dread')}
          >
            Choose Existential Dread
          </button>
        </div>
      )}
    </div>
  )
}
