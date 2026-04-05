import { useState, useRef, useCallback } from 'react'

/* ═══════════════════════════════════════════════════
   NEWSLETTER — The Meltdown Form
   TROLLS: Orbiting submit button, form field swap,
   input echo as background, typing analysis
   ═══════════════════════════════════════════════════ */

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [fieldsSwapped, setFieldsSwapped] = useState(false)
  const [submitState, setSubmitState] = useState<
    'idle' | 'hover' | 'hover-back' | 'scared' | 'orbiting' | 'loading' | 'done'
  >('idle')
  // orbiting state tracked via submitState
  const [progress, setProgress] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState('')
  const lastKeyTime = useRef(Date.now())
  const keyIntervals = useRef<number[]>([])
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const hasLeftOnce = useRef(false)

  // TROLL: Form fields swap on tab
  const handleTab = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && !fieldsSwapped) {
      setFieldsSwapped(true)
      setTimeout(() => setFieldsSwapped(false), 3000) // Swap back after 3s
    }
  }, [fieldsSwapped])

  // TROLL: Typing speed analysis
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const now = Date.now()
    const interval = now - lastKeyTime.current
    lastKeyTime.current = now
    keyIntervals.current.push(interval)

    setEmail(e.target.value)

    // Analyze after 5 keystrokes
    if (keyIntervals.current.length > 5) {
      const avg = keyIntervals.current.slice(-5).reduce((a, b) => a + b, 0) / 5
      if (avg < 100) {
        setTypingSpeed('Your typing velocity suggests unresolved urgency. Have you considered... decaf?')
      } else if (avg < 300) {
        setTypingSpeed('Steady rhythm. You type like someone who reads the terms and conditions.')
      } else {
        setTypingSpeed('You type like someone composing a letter to a Victorian pen pal. We respect the deliberation.')
      }
    }
  }, [])

  // TROLL: Submit button state machine
  const handleBtnHover = () => {
    if (submitState === 'done' || submitState === 'orbiting' || submitState === 'loading') return
    if (hasLeftOnce.current) {
      setSubmitState('hover-back')
    } else {
      setSubmitState('hover')
    }
    hoverTimer.current = setTimeout(() => {
      setSubmitState('scared')
    }, 3000)
  }

  const handleBtnLeave = () => {
    if (submitState === 'orbiting' || submitState === 'loading' || submitState === 'done') return
    hasLeftOnce.current = true
    clearTimeout(hoverTimer.current)
    setSubmitState('idle')
  }

  // TROLL: First click → orbiting buttons
  const handleBtnClick = () => {
    if (submitState === 'done') return
    if (submitState !== 'orbiting') {
      setSubmitState('orbiting')
    }
  }

  // TROLL: Click the orbiting button
  const handleOrbitClick = () => {
    setSubmitState('loading')

    // Fake progress that stalls
    let p = 0
    const interval = setInterval(() => {
      if (p < 72) p += Math.random() * 8
      else if (p < 87) p += Math.random() * 2
      else if (p < 94) p += Math.random() * 0.5
      else if (p < 99) p += Math.random() * 0.3
      else {
        p = 100
        clearInterval(interval)
        setTimeout(() => setSubmitState('done'), 500)
      }
      setProgress(Math.min(100, p))
    }, 200)
  }

  const getSubmitText = () => {
    switch (submitState) {
      case 'idle': return 'Subscribe'
      case 'hover': return 'Subscribe?'
      case 'hover-back': return 'Oh. You came back.'
      case 'scared': return 'I\'m not ready for this kind of commitment'
      case 'orbiting': return 'Catch me'
      case 'loading': return `${Math.floor(progress)}%`
      case 'done': return '✓ Sent.'
      default: return 'Subscribe'
    }
  }

  const getLoadingLabel = () => {
    if (progress < 72) return 'Gathering courage...'
    if (progress < 87) return 'Almost... almost...'
    if (progress < 94) return 'Is this what bravery feels like?'
    if (progress < 100) return 'One more second...'
    return 'That was very stressful for both of us.'
  }

  return (
    <section className="section-full" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <h2 className="section-title">Join the Waiting List</h2>
        <p className="section-subtitle">
          Composure №5 is in development. Be the first to experience what we haven't made yet.
        </p>

        {/* TROLL: Email typed in background as giant text */}
        {email.length > 3 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(2rem, 8vw, 5rem)',
            fontFamily: 'var(--font-display)',
            color: 'rgba(196, 168, 130, 0.04)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 0,
            letterSpacing: '0.05em',
          }}>
            {email}
          </div>
        )}

        <div style={{
          marginTop: '48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Name + Email — TROLL: swap positions on tab */}
          <div style={{
            display: 'flex',
            flexDirection: fieldsSwapped ? 'column-reverse' : 'column',
            gap: '16px',
            transition: 'all 0.3s ease',
          }}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={handleTab}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: 'var(--bg-primary)',
                border: 'var(--border)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
            />
            <input
              type="email"
              placeholder="your.calm.self@email.com"
              value={email}
              onChange={handleEmailChange}
              onKeyDown={handleTab}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: 'var(--bg-primary)',
                border: 'var(--border)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Typing analysis */}
          {typingSpeed && (
            <p className="narrator" style={{ animation: 'fadeIn 0.5s ease', textAlign: 'left' }}>
              {typingSpeed}
            </p>
          )}

          {/* Submit area */}
          <div style={{
            position: 'relative',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '8px',
          }}>
            {submitState === 'orbiting' ? (
              /* TROLL: Two buttons orbit each other */
              <div style={{ position: 'relative', width: '200px', height: '80px' }}>
                <button
                  className="btn btn-gold btn-small"
                  onClick={handleOrbitClick}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    animation: 'orbit 2s linear infinite',
                    fontSize: '0.7rem',
                    minWidth: '100px',
                  }}
                >
                  Subscribe
                </button>
                <button
                  className="btn btn-small"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    animation: 'orbit 2s linear infinite reverse',
                    fontSize: '0.7rem',
                    minWidth: '100px',
                    pointerEvents: 'none',
                    opacity: 0.5,
                  }}
                >
                  Don't Subscribe
                </button>
                <p className="narrator" style={{
                  position: 'absolute',
                  bottom: '-24px',
                  width: '300px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                }}>
                  Nice reflexes required. Click "Subscribe" mid-orbit.
                </p>
              </div>
            ) : submitState === 'loading' ? (
              /* Loading bar */
              <div style={{ width: '100%' }}>
                <div style={{
                  width: '100%',
                  height: '48px',
                  background: 'var(--bg-primary)',
                  border: 'var(--border)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'var(--accent-gold)',
                    transition: 'width 0.3s ease',
                  }} />
                  <span style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: progress > 50 ? 'var(--bg-primary)' : 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    zIndex: 1,
                  }}>
                    {Math.floor(progress)}%
                  </span>
                </div>
                <p className="narrator" style={{ marginTop: '8px' }}>{getLoadingLabel()}</p>
              </div>
            ) : submitState === 'done' ? (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  color: 'var(--accent-gold)',
                }}>
                  ✓ Sent.
                </p>
                <p className="narrator" style={{ marginTop: '8px' }}>
                  That was very stressful for both of us.
                </p>
                <p className="narrator" style={{ marginTop: '16px' }}>
                  You are subscriber #4.
                  <br />
                  We lied about the 10,000. But we're growing.
                </p>
              </div>
            ) : (
              <button
                className={`btn ${submitState === 'hover' || submitState === 'hover-back' ? 'animate-tremble' : ''}`}
                onMouseEnter={handleBtnHover}
                onMouseLeave={handleBtnLeave}
                onClick={handleBtnClick}
                style={{
                  width: submitState === 'scared' ? '100%' : '280px',
                  transition: 'all 0.4s ease',
                }}
              >
                {getSubmitText()}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
