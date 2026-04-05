import { useState } from 'react'

/* ═══════════════════════════════════════════════════
   FOOTER — The Infinite Scroll + Developer Message
   TROLL: User thinks they've reached the bottom but
   MORE content keeps appearing
   ═══════════════════════════════════════════════════ */

export default function Footer() {
  const [extraScrolls, setExtraScrolls] = useState(0)

  const handleScroll = () => {
    if (extraScrolls < 3) {
      setExtraScrolls(prev => prev + 1)
    }
  }

  return (
    <footer style={{
      background: 'var(--bg-primary)',
      borderTop: '1px solid var(--accent-gold-border)',
    }}>
      {/* Main footer content */}
      <div className="section" style={{ padding: '60px 5%', textAlign: 'center' }}>
        {/* Links */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          justifyContent: 'center',
          marginBottom: '40px',
        }}>
          {[
            'About',
            'Careers (hiring a nose)',
            'Privacy',
            'Returns',
            'Why Are Perfume Ads So Weird',
          ].map(link => (
            <a
              key={link}
              href="#"
              onClick={e => e.preventDefault()}
              style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                letterSpacing: '0.04em',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-gold)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Social links with sass */}
        <div style={{
          display: 'flex',
          gap: '32px',
          justifyContent: 'center',
          marginBottom: '40px',
        }}>
          {[
            { name: 'Instagram', sass: 'Our feed is just the same bottle in different lighting' },
            { name: 'TikTok', sass: 'We tried. The algorithm didn\'t understand us.' },
            { name: 'Pinterest', sass: 'We\'re already on 47 mood boards. We checked.' },
            { name: 'LinkedIn', sass: 'We\'re a perfume brand. Why are we on LinkedIn.' },
          ].map(social => (
            <SocialLink key={social.name} {...social} />
          ))}
        </div>

        {/* Copyright */}
        <p style={{
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
        }}>
          © 2026 COMPOSURE™ · All rights reserved · Please leave us alone · We need rest
        </p>
      </div>

      {/* TROLL: Extra content that appears when user thinks they're done */}
      {extraScrolls === 0 && (
        <div
          style={{ height: '60px', cursor: 'pointer' }}
          onClick={handleScroll}
        />
      )}

      {extraScrolls >= 1 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 5%',
          borderTop: '1px solid rgba(196,168,130,0.1)',
          animation: 'fadeIn 0.8s ease',
        }}>
          <p className="narrator">You thought this was the bottom? Cute.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '8px' }}>
            Page 2 of 47
          </p>
          {extraScrolls < 2 && (
            <button className="btn btn-small" onClick={handleScroll} style={{ marginTop: '16px' }}>
              Keep going?
            </button>
          )}
        </div>
      )}

      {extraScrolls >= 2 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 5%',
          animation: 'fadeIn 0.8s ease',
        }}>
          <p className="narrator">Okay THIS is actually the bottom.</p>
          {extraScrolls < 3 && (
            <button className="btn btn-small" onClick={handleScroll} style={{ marginTop: '16px' }}>
              ...or is it?
            </button>
          )}
        </div>
      )}

      {/* THE DEVELOPER MESSAGE — the emotional payoff */}
      {extraScrolls >= 3 && (
        <div style={{
          padding: '80px 5%',
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          animation: 'fadeInUp 1.2s ease',
          borderTop: '1px solid var(--accent-gold-border)',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: 1.8,
          }}>
            <p style={{ color: 'var(--accent-gold)', marginBottom: '24px' }}>
              ─────────────────────────
            </p>

            <p>This website was having a perfectly normal day</p>
            <p>until you showed up.</p>
            <br />
            <p>You scrolled through a cinematic bottle reveal.</p>
            <p>You chased a button across the screen.</p>
            <p>You debated philosophy with a checkout flow.</p>
            <p>You watched stars crumble under your cursor.</p>
            <br />
            <p>And yet — you stayed.</p>
            <br />
            <p style={{ color: 'var(--accent-gold)' }}>
              COMPOSURE™ was never about fragrance.
            </p>
            <p style={{ color: 'var(--accent-gold)' }}>
              It was about paying attention.
            </p>
            <br />
            <p>Every trembling button. Every fleeing price tier.</p>
            <p>Every existential question disguised as a quiz —</p>
            <p>they were all asking:</p>
            <br />
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              "Are you actually here? Or just scrolling?"
            </p>
            <br />
            <p style={{ color: 'var(--text-primary)' }}>You were here.</p>
            <p style={{ color: 'var(--accent-gold)' }}>Thank you.</p>
            <br />
            <p>Now go build something that makes people</p>
            <p>forget they're looking at a screen.</p>
            <br />
            <p style={{ color: 'var(--accent-gold)', fontStyle: 'italic' }}>
              — The Developer
            </p>

            <p style={{ color: 'var(--accent-gold)', marginTop: '24px' }}>
              ─────────────────────────
            </p>

            <p style={{ marginTop: '24px', fontSize: '0.7rem' }}>
              Made with ☕ and imposter syndrome.
              <br />
              No noses were harmed in the making of this website.
            </p>
          </div>
        </div>
      )}
    </footer>
  )
}

/* Social link with sass on hover */
function SocialLink({ name, sass }: { name: string; sass: string }) {
  const [showSass, setShowSass] = useState(false)

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setShowSass(true)}
      onMouseLeave={() => setShowSass(false)}
    >
      <a
        href="#"
        onClick={e => e.preventDefault()}
        style={{
          color: showSass ? 'var(--accent-gold)' : 'var(--text-muted)',
          textDecoration: 'none',
          fontSize: '0.8rem',
          transition: 'color 0.3s ease',
        }}
      >
        {name}
      </a>
      {showSass && (
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--bg-card)',
          border: '1px solid var(--accent-gold-border)',
          padding: '8px 12px',
          fontSize: '0.65rem',
          color: 'var(--accent-gold)',
          fontFamily: 'var(--font-mono)',
          whiteSpace: 'nowrap',
          zIndex: 10,
          animation: 'fadeIn 0.3s ease',
        }}>
          {sass}
        </div>
      )}
    </div>
  )
}
