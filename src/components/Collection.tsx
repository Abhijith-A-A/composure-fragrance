import { useState, useRef, useCallback, useEffect } from 'react'

/* ═══════════════════════════════════════════════════
   COLLECTION — 4 Fragrance Products
   THE SIGNATURE TROLL: Runaway Add to Cart buttons
   Uses AI-generated product photography
   ═══════════════════════════════════════════════════ */

const products = [
  {
    id: 1,
    name: 'Composure №1: Still',
    price: 89,
    notes: 'Bergamot · Iris · Sandalwood',
    honestNotes: 'Denial · Pre-meeting dread · Quiet screaming',
    color: '#D4A55A',
    image: '/products/still.png',
    trollType: 'normal', // Trust builder
  },
  {
    id: 2,
    name: 'Composure №2: Unread',
    price: 74,
    notes: 'Green Tea · White Cedar · Vetiver',
    honestNotes: 'Inbox Zero (aspirational) · Cold coffee · "Per my last email"',
    color: '#C48B9F',
    image: '/products/unread.png',
    trollType: 'tremble', // Trembles, then jumps
  },
  {
    id: 3,
    name: 'Composure №3: Almost',
    price: 112,
    notes: 'Pink Pepper · Jasmine · Amber',
    honestNotes: 'Nearly on time · Optimism · Plot twist',
    color: '#7B9FC4',
    image: '/products/almost.png',
    trollType: 'flee', // Actively runs away
  },
  {
    id: 4,
    name: 'Composure №4: [VOID]',
    price: 0,
    notes: '[REDACTED] · [ERROR] · The Void',
    honestNotes: '??? · ¿¿¿ · ...',
    color: '#3A3A3A',
    image: '/products/void.png',
    trollType: 'teleport', // Teleports to random position
  },
]

function ProductCard({
  product,
  onTeleportBtn,
}: {
  product: typeof products[0]
  onTeleportBtn?: (el: HTMLButtonElement) => void
}) {
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 })
  const [btnText, setBtnText] = useState('Add to Cart')
  const [isAdded, setIsAdded] = useState(product.trollType === 'teleport')
  const [trembling, setTrembling] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [showHonest, setShowHonest] = useState(false)
  const [currentPrice, setCurrentPrice] = useState(product.price)
  const [imgLoaded, setImgLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  // Price roulette for products 2-4
  useEffect(() => {
    if (product.id === 1) return
    const interval = setInterval(() => {
      const prices = product.id === 4
        ? [0.99, 4200, 31, 999, 0, 74]
        : [product.price, product.price + 15, product.price - 8, product.price + 42, product.price - 3]
      setCurrentPrice(prices[Math.floor(Math.random() * prices.length)])
    }, 4000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [product])

  // TROLL: Tremble type — button jumps on click
  const handleTrembleClick = useCallback(() => {
    const a = attempts + 1
    setAttempts(a)
    if (a < 5) {
      const dirs = [
        { x: 60, y: 0 }, { x: -80, y: 0 },
        { x: 0, y: -40 }, { x: 0, y: 60 },
      ]
      const dir = dirs[a % dirs.length]
      setBtnPos({ x: btnPos.x + dir.x, y: btnPos.y + dir.y })
      const texts = ['Add to Ca—', 'Stop.', 'I said stop.', '...']
      setBtnText(texts[Math.min(a - 1, texts.length - 1)])
    } else {
      setBtnText('Fine. You win.')
      setIsAdded(true)
      setBtnPos({ x: 0, y: 0 })
    }
  }, [attempts, btnPos])

  // TROLL: Flee type — button maintains distance from cursor
  const handleFleeMove = useCallback((e: React.MouseEvent) => {
    if (isAdded || product.trollType !== 'flee') return
    const card = cardRef.current
    const btn = btnRef.current
    if (!card || !btn) return

    const cardRect = card.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    const btnCenterX = btnRect.left + btnRect.width / 2
    const btnCenterY = btnRect.top + btnRect.height / 2
    const dx = e.clientX - btnCenterX
    const dy = e.clientY - btnCenterY
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 120) {
      const angle = Math.atan2(dy, dx)
      const pushX = -Math.cos(angle) * (120 - dist) * 0.8
      const pushY = -Math.sin(angle) * (120 - dist) * 0.8
      // Clamp within card bounds
      const maxX = cardRect.width / 2 - 60
      const maxY = 80
      setBtnPos({
        x: Math.max(-maxX, Math.min(maxX, btnPos.x + pushX * 0.15)),
        y: Math.max(-maxY, Math.min(maxY, btnPos.y + pushY * 0.15)),
      })

      setAttempts(prev => {
        const a = prev + 1
        if (a > 80 && a < 85) {
          setBtnText('I wasn\'t ready for commitment.')
          setTrembling(true)
        }
        if (a > 120) {
          setIsAdded(true)
          setBtnText('...okay fine.')
          setBtnPos({ x: 0, y: 0 })
          setTrembling(false)
        }
        return a
      })
    }
  }, [isAdded, product.trollType, btnPos])

  // TROLL: Teleport type
  const handleTeleportClick = useCallback(() => {
    if (!btnRef.current) return
    onTeleportBtn?.(btnRef.current)
  }, [onTeleportBtn])

  const handleClick = () => {
    if (isAdded) return
    switch (product.trollType) {
      case 'normal':
        setIsAdded(true)
        setBtnText('Added ✓')
        break
      case 'tremble':
        handleTrembleClick()
        break
      case 'flee':
        // Rarely catches it via click
        if (attempts > 80) {
          setIsAdded(true)
          setBtnText('...okay fine.')
        }
        break
      case 'teleport':
        handleTeleportClick()
        break
    }
  }

  const formatPrice = (p: number) => {
    if (p === 0) return 'FREE*'
    if (p > 1000) return `$${p.toLocaleString()}`
    return `$${p}`
  }

  return (
    <div
      ref={cardRef}
      className="card"
      onMouseMove={handleFleeMove}
      onMouseEnter={() => {
        if (product.trollType === 'tremble') setTrembling(true)
      }}
      onMouseLeave={() => {
        setTrembling(false)
        setShowHonest(false)
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        overflow: 'visible',
        minHeight: '480px',
      }}
    >
      {/* Product image */}
      <div style={{
        width: '100%',
        height: '260px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px 8px 0 0',
      }}>
        {/* Ambient glow behind bottle */}
        <div style={{
          position: 'absolute',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${product.color}25 0%, transparent 70%)`,
          filter: 'blur(30px)',
          zIndex: 0,
        }} />
        {/* Product photo */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          style={{
            maxHeight: '240px',
            maxWidth: '85%',
            objectFit: 'contain',
            position: 'relative',
            zIndex: 1,
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease, transform 0.4s ease',
            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))',
          }}
        />
        {/* Shimmer overlay on hover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, transparent 40%, ${product.color}08 50%, transparent 60%)`,
          zIndex: 2,
          pointerEvents: 'none',
        }} />
      </div>

      {/* Product name */}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: '1.3rem',
        color: 'var(--accent-gold)',
        marginBottom: '8px',
      }}>
        {product.name}
      </h3>

      {/* Price */}
      <p style={{
        fontSize: '1.1rem',
        color: 'var(--text-primary)',
        marginBottom: '12px',
        transition: 'none',
      }}>
        {formatPrice(currentPrice)}
      </p>

      {/* Notes — hover toggles honest version */}
      <p
        onMouseEnter={() => setShowHonest(true)}
        onMouseLeave={() => setShowHonest(false)}
        style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          marginBottom: '24px',
          minHeight: '36px',
          cursor: 'default',
          transition: 'color 0.3s ease',
        }}
      >
        {showHonest ? product.honestNotes : product.notes}
      </p>

      {/* THE BUTTON — with all troll behaviors */}
      {product.trollType === 'teleport' && isAdded ? (
        <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
          ✓ Added to cart 3 min ago
          <br />
          <span className="narrator" style={{ fontSize: '0.7rem' }}>
            "You didn't add this. We didn't add this. It was always here."
          </span>
        </div>
      ) : (
        <button
          ref={btnRef}
          className={`btn btn-small ${trembling ? 'animate-tremble' : ''}`}
          onClick={handleClick}
          style={{
            transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
            transition: product.trollType === 'flee' ? 'transform 0.08s linear' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            background: isAdded ? 'var(--success)' : undefined,
            borderColor: isAdded ? 'var(--success)' : undefined,
            pointerEvents: isAdded ? 'none' : undefined,
          }}
        >
          {btnText}
        </button>
      )}
    </div>
  )
}

export default function Collection() {
  const [teleportedBtn, setTeleportedBtn] = useState<{
    visible: boolean
    x: number
    y: number
  }>({ visible: false, x: 0, y: 0 })

  const handleTeleport = useCallback(() => {
    // Teleport button to a random visible position on the page
    const x = Math.random() * (window.innerWidth - 200) + 50
    const y = Math.random() * (window.innerHeight - 100) + 50
    setTeleportedBtn({ visible: true, x, y })
  }, [])

  return (
    <section className="section-full" style={{ background: 'var(--bg-secondary)' }}>
      <div className="section">
        <h2 className="section-title">The Collection</h2>
        <p className="section-subtitle">
          Scents for every state of being.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--card-gap)',
          marginTop: '40px',
        }}>
          {products.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onTeleportBtn={p.trollType === 'teleport' ? handleTeleport : undefined}
            />
          ))}
        </div>

        {/* Narrator */}
        <p className="narrator" style={{ textAlign: 'center', marginTop: '60px' }}>
          ℹ️ We show you 4 products because research says even numbers feel "complete."
          <br />
          It could be 47 products. We chose 4. You're welcome.
        </p>
      </div>

      {/* Teleported button — fixed on screen */}
      {teleportedBtn.visible && (
        <button
          className="btn btn-small animate-pulse"
          onClick={() => setTeleportedBtn({ ...teleportedBtn, visible: false })}
          style={{
            position: 'fixed',
            left: teleportedBtn.x,
            top: teleportedBtn.y,
            zIndex: 9999,
            background: 'var(--accent-gold)',
            color: 'var(--bg-primary)',
          }}
        >
          Find me. (Click to add)
        </button>
      )}
    </section>
  )
}
