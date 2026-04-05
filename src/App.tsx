import { useState, useEffect } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Collection from './components/Collection'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import GlobalTrolls from './components/GlobalTrolls'
import { SplineInterlude } from './components/SplineEmbeds'

/* ═══════════════════════════════════════════════════
   COMPOSURE™ — The Art of Almost Holding It Together
   
   Architecture:
   - Hero: Canvas-based 192-frame smooth scroll sequence
   - Each interlude: Custom Three.js 3D scene (liquid glass,
     gold particles, refractive crystals, floating orbs)
   - All trolling mechanics active throughout
   ═══════════════════════════════════════════════════ */

export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      opacity: loaded ? 1 : 0,
      transition: 'opacity 1.2s ease',
      minHeight: '100vh',
    }}>
      {/* Fixed elements */}
      <Navbar />
      <GlobalTrolls />
      <CookieBanner />

      {/* ═══ SECTION 1: Hero — Smooth Canvas Frame Sequence ═══ */}
      <Hero />

      {/* ═══ 3D: Liquid Glass Sphere ═══ */}
      <SplineInterlude
        scene="liquidGlass"
        height="60vh"
        overlayText="Every molecule, deliberate."
        overlaySubtext="(The molecules were not consulted.)"
      />

      {/* ═══ SECTION 2: Collection — Product Grid ═══ */}
      <div id="collection">
        <Collection />
      </div>

      {/* ═══ 3D: Golden Particle Dust ═══ */}
      <SplineInterlude
        scene="goldenDust"
        height="45vh"
      />

      {/* ═══ SECTION 3: Testimonials — Musical Chairs ═══ */}
      <div id="about">
        <Testimonials />
      </div>

      {/* ═══ 3D: Crystal Prism Cluster ═══ */}
      <SplineInterlude
        scene="crystalPrism"
        height="50vh"
        overlayText="Silence has a scent."
        overlaySubtext="It smells like this website judging you."
      />

      {/* ═══ SECTION 4: Pricing — Fleeing Cheap Option ═══ */}
      <div id="pricing">
        <Pricing />
      </div>

      {/* ═══ SECTION 5: FAQ — Jealous Accordion ═══ */}
      <div id="faq">
        <FAQ />
      </div>

      {/* ═══ 3D: Glass Torus Knot ═══ */}
      <SplineInterlude
        scene="glassTorus"
        height="40vh"
        overlayText="Almost done."
        overlaySubtext="(That's what we want you to think.)"
      />

      {/* ═══ SECTION 6: Newsletter — Orbiting Submit ═══ */}
      <Newsletter />

      {/* ═══ SECTION 7: Footer — Infinite Scroll ═══ */}
      <Footer />
    </div>
  )
}
