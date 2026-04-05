import { useState, useEffect } from 'react'

/* ═══════════════════════════════════════════════════
   PRICING — Three Tiers
   TROLLS: Fleeing cheap option, shrinking Yes button,
   price/ml calculator that escalates
   ═══════════════════════════════════════════════════ */

const tiers = [
  {
    name: 'Discovery',
    volume: '10ml',
    price: 29,
    tagline: 'For the cautiously curious.',
    features: [
      '10ml travel spray',
      'Basic scent consultation',
      'Email support (eventually)',
      'The feeling of having made a decision',
    ],
    cta: 'Choose Discovery',
  },
  {
    name: 'Devotion',
    volume: '30ml',
    price: 89,
    tagline: 'For those who commit.',
    popular: true,
    features: [
      '30ml full bottle',
      'Priority scent matching',
      'Complimentary layering guide',
      'A moderate sense of superiority',
      'We remember your name',
    ],
    cta: 'Choose Devotion',
  },
  {
    name: 'Obsession',
    volume: '100ml',
    price: 420,
    tagline: 'The price is the point.',
    features: [
      '100ml collector\'s edition',
      'Personal olfactory consultation',
      'Freedom from the concept of value',
      'A handwritten note from someone in our warehouse',
      'Honestly at this point you\'re paying for the bottle',
      'The bottle is very nice though',
    ],
    cta: 'Choose Obsession',
  },
]

// Philosophical checkout dialogs
const dialogs = [
  { text: 'Are you sure?', yes: 'Yes', no: 'Maybe' },
  { text: 'What is certainty, really? In a universe of infinite possibilities, can anyone truly be "sure"?', yes: 'I think so', no: 'Fair point' },
  { text: 'If you choose this plan in a forest and nobody is around to hear it, did you really choose?', yes: 'Just add it', no: '🤔' },
  { text: 'That was a test. You passed. ...Or did you?', yes: 'ADD TO CART', no: 'I give up' },
]

export default function Pricing() {
  const [tierOrder, setTierOrder] = useState([0, 1, 2])
  const [popularIdx, setPopularIdx] = useState(1)
  const [dialogState, setDialogState] = useState<{ open: boolean; step: number; tier: string }>({
    open: false, step: 0, tier: '',
  })
  const [yesScale, setYesScale] = useState(1)
  const [noScale, setNoScale] = useState(1)
  const [showConfetti, setShowConfetti] = useState(false)
  const [fleeCount, setFleeCount] = useState(0)

  // TROLL: "Most Popular" badge jumps every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPopularIdx(prev => (prev + 1) % 3)
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  // TROLL: Shrinking Yes / Growing No in dialog
  useEffect(() => {
    if (!dialogState.open) return
    setYesScale(1)
    setNoScale(1)
    const interval = setInterval(() => {
      setYesScale(prev => Math.max(0.15, prev - 0.08))
      setNoScale(prev => Math.min(3, prev + 0.15))
    }, 600)
    return () => clearInterval(interval)
  }, [dialogState.open, dialogState.step])

  // TROLL: Fleeing cheap option — columns swap on hover
  const handleTierHover = (posIdx: number) => {
    // If hovering the column that contains the cheap tier, swap it
    const cheapPos = tierOrder.indexOf(0)
    if (posIdx === cheapPos && fleeCount < 4) {
      const newOrder = [...tierOrder]
      const swapTo = (cheapPos + 1) % 3
      ;[newOrder[cheapPos], newOrder[swapTo]] = [newOrder[swapTo], newOrder[cheapPos]]
      setTierOrder(newOrder)
      setFleeCount(prev => prev + 1)
    }
  }

  const openDialog = (tierName: string) => {
    setDialogState({ open: true, step: 0, tier: tierName })
  }

  const handleYes = () => {
    if (dialogState.step < dialogs.length - 1) {
      setDialogState(prev => ({ ...prev, step: prev.step + 1 }))
    } else {
      // Final step — success
      setDialogState({ open: false, step: 0, tier: '' })
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  return (
    <section className="section-full" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section">
        <h2 className="section-title">Choose Your Obsession</h2>
        <p className="section-subtitle">Every journey begins with a pricing tier.</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--card-gap)',
          marginTop: '50px',
          alignItems: 'start',
        }}>
          {tierOrder.map((tierIdx, posIdx) => {
            const tier = tiers[tierIdx]
            const isPopular = tierIdx === popularIdx

            return (
              <div
                key={tier.name}
                className="card"
                onMouseEnter={() => handleTierHover(posIdx)}
                style={{
                  transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  order: posIdx,
                  borderColor: isPopular ? 'var(--accent-gold)' : undefined,
                  position: 'relative',
                  padding: '40px 32px',
                }}
              >
                {/* "Most Popular" badge - jumps between tiers */}
                {isPopular && (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--accent-gold)',
                    color: 'var(--bg-primary)',
                    padding: '4px 16px',
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    transition: 'all 0.5s ease',
                  }}>
                    ✷ Most Popular
                  </div>
                )}

                {/* Tier name */}
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  color: 'var(--accent-gold)',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {tier.name}
                </h3>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {tier.volume} · {tier.tagline}
                </p>

                {/* Price */}
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  color: 'var(--text-primary)',
                  marginBottom: '24px',
                }}>
                  ${tier.price}
                </p>

                {/* Features */}
                <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
                  {tier.features.map((f, i) => (
                    <li key={i} style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      padding: '6px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}>
                      ✓ {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className="btn"
                  onClick={() => openDialog(tier.name)}
                  style={{ width: '100%' }}
                >
                  {tier.cta}
                </button>

                {/* Flee narrator */}
                {tierIdx === 0 && fleeCount >= 4 && (
                  <p className="narrator" style={{
                    marginTop: '12px',
                    textAlign: 'center',
                    animation: 'fadeIn 0.5s ease',
                  }}>
                    "Fine. I'll stay. But I'm not happy about it."
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* DIALOG OVERLAY */}
      {dialogState.open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease',
        }}
          onClick={(e) => e.target === e.currentTarget && setDialogState({ open: false, step: 0, tier: '' })}
        >
          <div className="card" style={{
            maxWidth: '480px',
            width: '90%',
            padding: '48px 40px',
            textAlign: 'center',
            border: '1px solid var(--accent-gold)',
          }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.3rem',
              color: 'var(--text-primary)',
              marginBottom: '32px',
              lineHeight: 1.5,
            }}>
              {dialogs[dialogState.step].text}
            </p>

            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {/* YES button — shrinks */}
              <button
                className="btn btn-gold"
                onClick={handleYes}
                style={{
                  transform: `scale(${yesScale})`,
                  transition: 'transform 0.3s ease',
                  minWidth: '80px',
                  padding: `${14 * yesScale}px ${32 * yesScale}px`,
                  fontSize: `${Math.max(0.5, 0.9 * yesScale)}rem`,
                }}
              >
                {dialogs[dialogState.step].yes}
              </button>

              {/* NO button — grows */}
              <button
                className="btn"
                onClick={() => setDialogState({ open: false, step: 0, tier: '' })}
                style={{
                  transform: `scale(${noScale})`,
                  transition: 'transform 0.3s ease',
                  minWidth: '80px',
                }}
              >
                {dialogs[dialogState.step].no}
              </button>
            </div>

            <p className="narrator" style={{ marginTop: '24px' }}>
              Dialog {dialogState.step + 1} of {dialogs.length}
            </p>
          </div>
        </div>
      )}

      {/* Confetti */}
      {showConfetti && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10001,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--accent-gold)',
            padding: '32px 48px',
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease',
          }}>
            <p style={{ fontSize: '1.5rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-display)' }}>
              ✓ Added!
            </p>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              Probably.
            </p>
            <p className="narrator" style={{ marginTop: '8px' }}>
              (No, actually, it's added. We're just being dramatic.)
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
