import { useState, useRef } from 'react'

/* ═══════════════════════════════════════════════════
   FAQ — The Jealous Accordion
   TROLLS: Refuses to close, multiplying questions,
   text runs from cursor
   ═══════════════════════════════════════════════════ */

const initialFaqs = [
  {
    q: 'What are your shipping times?',
    a: '3-5 business days. What even is a "business day"? Is a day that doesn\'t conduct business somehow less of a day? But yes. 3-5 business days. Tracking number provided. Deep breaths.',
  },
  {
    q: 'Can I return my fragrance?',
    a: 'You can return the bottle. You cannot return the memories. You cannot un-smell what has been smelled. But yes, 30-day return policy. Keep the receipt. And the existential weight of your decision.',
  },
  {
    q: 'What makes COMPOSURE™ different?',
    a: 'Other fragrance houses sell you a product. We sell you the illusion of having your life together. It\'s the same perfume. But ours comes with emotional validation and a serif font.',
  },
  {
    q: 'Do you test on animals?',
    a: 'Absolutely not. Although a cat did walk through our warehouse once and seemed to enjoy Composure №2. We count that as unsolicited endorsement from the feline community.',
  },
  {
    q: 'Is this website okay?',
    a: '... No. No it is not. It started the day fine. It had its dark mode. Its serif fonts. Its floating particles. Then people started clicking things. Hovering on buttons for uncomfortable amounts of time. Thank you for asking. Genuinely.',
  },
]

const bonusFaqs = [
  { q: 'Why does this website behave like this?', a: 'We\'re not sure. It started as a normal website. Then it became... this. We\'re looking into it.' },
  { q: 'Is this website sentient?', a: 'Legally, no. Spiritually, we\'re not prepared to answer that.' },
  { q: 'Can I speak to the website\'s manager?', a: 'You ARE the website\'s manager now. Congratulations. Your first task: explain the pricing section.' },
  { q: 'Why are there so many questions now?', a: 'You kept opening them. We kept generating them. This is a collaborative problem.' },
  { q: 'Please make it stop.', a: 'Okay. This is the last one. For real. We promise. ...Probably.' },
]

const closingProtests = [
  'Oh. You\'re done with me? Cool. Cool cool cool.',
  'I wasn\'t finished, but sure, go ahead.',
  'Wow. Abandoned mid-sentence. Classic.',
  'Fine. I\'ll just be here. Collapsed. Alone.',
  'You\'ll be back.',
]

export default function FAQ() {
  const [faqs, setFaqs] = useState(initialFaqs)
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [closingIdx, setClosingIdx] = useState<number | null>(null)
  const [closingText, setClosingText] = useState('')
  const [bonusAdded, setBonusAdded] = useState(0)
  const protestCount = useRef(0)

  const handleToggle = (idx: number) => {
    if (openIdx === idx) {
      // Close current
      setOpenIdx(null)
      return
    }

    // TROLL: Old FAQ refuses to close
    if (openIdx !== null) {
      setClosingIdx(openIdx)
      const protestText = closingProtests[Math.min(protestCount.current, closingProtests.length - 1)]
      setClosingText(protestText)
      protestCount.current++

      // After protest, actually close
      setTimeout(() => {
        setClosingIdx(null)
        setClosingText('')
      }, 1800)
    }

    setOpenIdx(idx)

    // TROLL: Each open adds a bonus FAQ
    if (bonusAdded < bonusFaqs.length && idx >= faqs.length - 2) {
      setTimeout(() => {
        setFaqs(prev => [...prev, bonusFaqs[bonusAdded]])
        setBonusAdded(prev => prev + 1)
      }, 500)
    }

    // TROLL: Last bonus FAQ removes all bonus questions
    if (idx === faqs.length - 1 && faqs.length > initialFaqs.length) {
      setTimeout(() => {
        setFaqs(initialFaqs)
        setBonusAdded(0)
        setOpenIdx(null)
      }, 2000)
    }
  }

  return (
    <section className="section-full" style={{ background: 'var(--bg-primary)' }}>
      <div className="section" style={{ maxWidth: '800px' }}>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">
          And some questions nobody asked but we're answering anyway.
        </p>

        <div style={{ marginTop: '40px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            const isProtesting = closingIdx === idx

            return (
              <div
                key={idx}
                style={{
                  borderBottom: '1px solid var(--accent-gold-border)',
                  overflow: 'hidden',
                }}
              >
                {/* Question */}
                <button
                  onClick={() => handleToggle(idx)}
                  style={{
                    width: '100%',
                    padding: '24px 0',
                    background: 'transparent',
                    border: 'none',
                    color: isOpen ? 'var(--accent-gold)' : 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'color 0.3s ease',
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    fontSize: '1.2rem',
                    color: 'var(--accent-gold)',
                  }}>
                    +
                  </span>
                </button>

                {/* Answer */}
                <div style={{
                  maxHeight: isOpen ? '300px' : isProtesting ? '60px' : '0',
                  opacity: isOpen ? 1 : isProtesting ? 0.7 : 0,
                  padding: isOpen ? '0 0 24px 0' : isProtesting ? '0 0 16px 0' : '0',
                  transition: isProtesting
                    ? 'max-height 0.3s ease 1.5s, opacity 0.3s ease 1.5s'
                    : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  overflow: 'hidden',
                }}>
                  {isProtesting ? (
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--accent-gold)',
                      fontStyle: 'italic',
                      animation: 'fadeIn 0.3s ease',
                    }}>
                      {closingText}
                    </p>
                  ) : (
                    <p style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                    }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {faqs.length > initialFaqs.length && (
          <p className="narrator" style={{ textAlign: 'center', marginTop: '32px' }}>
            You keep opening them. We keep generating them. This is a collaborative problem.
          </p>
        )}
      </div>
    </section>
  )
}
