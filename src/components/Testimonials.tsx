import { useState, useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════
   TESTIMONIALS — Musical Chairs + Star Drop
   Cards swap positions. Stars drop when hovered.
   ═══════════════════════════════════════════════════ */

const reviews = [
  {
    name: 'Margaux D.',
    rating: 5,
    text: '"The sillage is extraordinary. I walked into a meeting and my boss asked if I\'d been promoted. I hadn\'t. But Composure №1 made me believe."',
    gossip: '"Margaux works from home. Alone. She wore this to water her plants."',
  },
  {
    name: 'Julian K.',
    rating: 4,
    text: '"Complex, layered, with unexpected depth. Much like myself."',
    gossip: '"Julian has never been called \'complex\' by anyone who knows him."',
  },
  {
    name: 'Aiko T.',
    rating: 5,
    text: '"I can\'t describe what this smells like. And I think that\'s the point."',
    gossip: '"I\'m an AI-generated reviewer. My scent preferences are imaginary."',
  },
  {
    name: 'Dr. Reeves',
    rating: 3.5,
    text: '"As a fragrance chemist, I can confirm the molecules in this are indeed molecules."',
    gossip: '"\'Dr.\' Reeves has a doctorate in communications, not chemistry."',
  },
]

function Stars({ rating, hovered }: { rating: number; hovered: boolean }) {
  const [displayRating, setDisplayRating] = useState(rating)

  useEffect(() => {
    if (hovered) {
      // Stars DROP when hovered
      const interval = setInterval(() => {
        setDisplayRating(prev => Math.max(1, prev - 0.3))
      }, 300)
      return () => clearInterval(interval)
    } else {
      setDisplayRating(rating) // Restore on un-hover
    }
  }, [hovered, rating])

  const full = Math.floor(displayRating)
  const half = displayRating % 1 >= 0.3

  return (
    <div style={{ fontSize: '1rem', color: 'var(--accent-gold)', letterSpacing: '2px', marginBottom: '12px' }}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
    </div>
  )
}

export default function Testimonials() {
  const [order, setOrder] = useState([0, 1, 2, 3])
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [activeGossip, setActiveGossip] = useState<number | null>(null)
  const [nameVariants, setNameVariants] = useState(reviews.map(r => r.name))
  const swapCount = useRef(0)

  // TROLL: Musical chairs — cards swap positions every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setOrder(prev => {
        const next = [...prev]
        const i = Math.floor(Math.random() * next.length)
        let j = Math.floor(Math.random() * next.length)
        while (j === i) j = Math.floor(Math.random() * next.length)
        ;[next[i], next[j]] = [next[j], next[i]]
        return next
      })
      swapCount.current++

      // Mutate names after a few swaps
      if (swapCount.current > 2) {
        setNameVariants(prev => prev.map((n, i) => {
          if (i === 0) {
            const variants = ['Margaux D.', 'Margaux M.', 'Margaux... something', 'Definitely Margaux', 'Look, does it matter?']
            return variants[Math.min(swapCount.current - 2, variants.length - 1)]
          }
          return n
        }))
      }
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // TROLL: Click one card → gossip appears on a DIFFERENT card
  const handleCardClick = (clickedIdx: number) => {
    const otherIdx = (clickedIdx + 2) % reviews.length
    setActiveGossip(otherIdx)
    setTimeout(() => setActiveGossip(null), 5000)
  }

  return (
    <section className="section-full" style={{ background: 'var(--bg-primary)' }}>
      <div className="section">
        <h2 className="section-title">The Devotees</h2>
        <p className="section-subtitle">
          Real reviews from real customers.*
          <br />
          <span style={{ fontSize: '0.7rem', fontStyle: 'italic' }}>
            *"Real" is a strong word.
          </span>
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--card-gap)',
          marginTop: '40px',
        }}>
          {order.map((reviewIdx, posIdx) => {
            const review = reviews[reviewIdx]
            const isHovered = hoveredIdx === posIdx

            return (
              <div
                key={review.name}
                className="card"
                onClick={() => handleCardClick(reviewIdx)}
                onMouseEnter={() => setHoveredIdx(posIdx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  order: posIdx,
                  position: 'relative',
                }}
              >
                {/* Reviewer name */}
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  color: 'var(--accent-gold)',
                  marginBottom: '8px',
                }}>
                  {nameVariants[reviewIdx]}
                </p>

                <Stars rating={review.rating} hovered={isHovered} />

                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                }}>
                  {review.text}
                </p>

                {/* Gossip bubble — appears on a DIFFERENT card when THIS one is clicked */}
                {activeGossip === reviewIdx && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--accent-gold)',
                    padding: '12px 16px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-gold)',
                    zIndex: 10,
                    width: '90%',
                    animation: 'fadeIn 0.4s ease',
                  }}>
                    💬 {review.gossip}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {swapCount.current > 1 && (
          <p className="narrator" style={{ textAlign: 'center', marginTop: '40px', animation: 'fadeIn 0.5s ease' }}>
            Having trouble reading? The reviews are practicing their choreography.
          </p>
        )}
      </div>
    </section>
  )
}
