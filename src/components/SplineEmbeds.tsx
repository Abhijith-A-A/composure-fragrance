import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  MeshTransmissionMaterial,
  MeshDistortMaterial,
  Float,
  Environment,
  Sphere,
  Torus,
  Box,
} from '@react-three/drei'
import * as THREE from 'three'

/* ═══════════════════════════════════════════════════
   CUSTOM 3D INTERLUDES — React Three Fiber
   
   Each section gets a unique, bespoke 3D scene:
   - LiquidGlass: Morphing refractive glass sphere
   - GoldenDust: Floating gold particle field
   - CrystalPrism: Rotating glass crystal cluster
   - AmbientOrbs: Gentle floating translucent orbs
   ═══════════════════════════════════════════════════ */

// ─── SCENE 1: Liquid Glass Sphere ───────────────────
// A morphing, refractive glass blob with internal glow
function LiquidGlassSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.15
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={2.2}>
        <sphereGeometry args={[1, 128, 128]} />
        <MeshDistortMaterial
          color="#C4A882"
          roughness={0.05}
          metalness={0.9}
          distort={0.35}
          speed={1.8}
          envMapIntensity={1.5}
        />
      </mesh>
      {/* Inner glow core */}
      <mesh scale={1.6}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#C4A882"
          emissive="#C4A882"
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  )
}

function LiquidGlassScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#C4A882" />
      <directionalLight position={[-5, -3, 3]} intensity={0.4} color="#8B7CC4" />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#C4A882" />
      <Environment preset="city" environmentIntensity={0.6} />
      <LiquidGlassSphere />
    </Canvas>
  )
}

// ─── SCENE 2: Golden Particle Dust ───────────────────
// A field of floating gold particles with gentle motion
function GoldParticles({ count = 300 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null!)

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
      sz[i] = Math.random() * 3 + 0.5
    }
    return [pos, sz]
  }, [count])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const time = clock.getElapsedTime()
    const posArray = meshRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      posArray[i3 + 1] += Math.sin(time * 0.3 + i * 0.1) * 0.002
      posArray[i3] += Math.cos(time * 0.2 + i * 0.05) * 0.001
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
    meshRef.current.rotation.y = time * 0.02
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#C4A882"
        size={0.04}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function GoldenDustScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 2, 3]} intensity={0.6} color="#C4A882" />
      <pointLight position={[-3, -1, 2]} intensity={0.3} color="#D4A55A" />
      <GoldParticles count={400} />
      {/* Central accent sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.3, 64, 64]}>
          <meshStandardMaterial
            color="#C4A882"
            emissive="#C4A882"
            emissiveIntensity={0.5}
            metalness={0.95}
            roughness={0.05}
          />
        </Sphere>
      </Float>
    </Canvas>
  )
}

// ─── SCENE 3: Crystal Prism Cluster ───────────────────
// Rotating glass crystals with refractive effects
function CrystalCluster() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.08) * 0.15
    }
  })

  const crystalPositions = useMemo(() => [
    { pos: [0, 0, 0] as [number, number, number], scale: 1.2, rot: 0 },
    { pos: [1.5, 0.8, -0.5] as [number, number, number], scale: 0.7, rot: 0.5 },
    { pos: [-1.3, -0.6, 0.3] as [number, number, number], scale: 0.8, rot: -0.3 },
    { pos: [0.5, -1.2, 0.8] as [number, number, number], scale: 0.5, rot: 0.8 },
    { pos: [-0.8, 1.0, -0.4] as [number, number, number], scale: 0.6, rot: -0.6 },
  ], [])

  return (
    <group ref={groupRef}>
      {crystalPositions.map((crystal, i) => (
        <Float
          key={i}
          speed={1 + i * 0.3}
          rotationIntensity={0.2}
          floatIntensity={0.3 + i * 0.1}
        >
          <mesh
            position={crystal.pos}
            scale={crystal.scale}
            rotation={[crystal.rot, crystal.rot * 0.5, 0]}
          >
            <octahedronGeometry args={[1, 0]} />
            <MeshTransmissionMaterial
              backside
              backsideThickness={0.4}
              thickness={0.3}
              chromaticAberration={0.15}
              anisotropy={0.3}
              distortion={0.1}
              distortionScale={0.2}
              temporalDistortion={0.1}
              ior={1.25}
              color="#C4A882"
              roughness={0.02}
              transmission={0.98}
              envMapIntensity={0.8}
            />
          </mesh>
        </Float>
      ))}
      {/* Central glow */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#C4A882" distance={5} />
    </group>
  )
}

function CrystalPrismScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 4]} intensity={0.7} color="#F5F0EB" />
      <directionalLight position={[-4, -2, 3]} intensity={0.3} color="#C4A882" />
      <Environment preset="city" environmentIntensity={0.5} />
      <CrystalCluster />
    </Canvas>
  )
}

// ─── SCENE 4: Ambient Floating Orbs ───────────────────
// Gentle translucent orbs drifting through space
function FloatingOrbs() {
  const orbsRef = useRef<THREE.Group>(null!)

  const orbs = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
      ] as [number, number, number],
      scale: 0.15 + Math.random() * 0.35,
      speed: 0.5 + Math.random() * 1.5,
      color: i % 3 === 0 ? '#C4A882' : i % 3 === 1 ? '#8B7CC4' : '#7BC4A8',
    })),
    []
  )

  useFrame(({ clock }) => {
    if (orbsRef.current) {
      orbsRef.current.rotation.y = clock.getElapsedTime() * 0.03
    }
  })

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, i) => (
        <Float key={i} speed={orb.speed} rotationIntensity={0.1} floatIntensity={1.2}>
          <Sphere args={[orb.scale, 32, 32]} position={orb.pos}>
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={0.3}
              transparent
              opacity={0.4}
              metalness={0.7}
              roughness={0.1}
            />
          </Sphere>
        </Float>
      ))}
      {/* Accent ring */}
      <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.5}>
        <Torus args={[1.5, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color="#C4A882"
            emissive="#C4A882"
            emissiveIntensity={0.4}
            metalness={0.95}
            roughness={0.05}
          />
        </Torus>
      </Float>
    </group>
  )
}

function AmbientOrbsScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 2, 4]} intensity={0.5} color="#C4A882" />
      <pointLight position={[-2, -1, 3]} intensity={0.3} color="#8B7CC4" />
      <FloatingOrbs />
    </Canvas>
  )
}

// ─── SCENE 5: Glass Torus Knot ───────────────────
// A refractive glass torus knot — pure liquid glass!
function GlassTorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.12
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.08) * 0.2
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={meshRef} scale={1.3}>
        <torusKnotGeometry args={[1, 0.35, 200, 32]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.5}
          thickness={0.4}
          chromaticAberration={0.2}
          anisotropy={0.5}
          distortion={0.15}
          distortionScale={0.3}
          temporalDistortion={0.15}
          ior={1.3}
          color="#C4A882"
          roughness={0.01}
          transmission={0.97}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  )
}

function GlassTorusScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#F5F0EB" />
      <directionalLight position={[-3, -2, 4]} intensity={0.4} color="#C4A882" />
      <Environment preset="city" environmentIntensity={0.5} />
      <GlassTorusKnot />
    </Canvas>
  )
}

// ─── SCENE MAP ───────────────────────────────────────
// Maps scene names to components for easy reference
const SCENES: Record<string, React.FC> = {
  liquidGlass: LiquidGlassScene,
  goldenDust: GoldenDustScene,
  crystalPrism: CrystalPrismScene,
  ambientOrbs: AmbientOrbsScene,
  glassTorus: GlassTorusScene,
}

export const SCENE_NAMES = Object.keys(SCENES)

/* ═══════════════════════════════════════════════════
   INTERLUDE — Full-width 3D section break
   ═══════════════════════════════════════════════════ */
export function SplineInterlude({
  scene,
  height = '500px',
  overlayText,
  overlaySubtext,
}: {
  scene: string
  fallbackVariant?: string
  height?: string
  overlayText?: string
  overlaySubtext?: string
}) {
  const SceneComponent = SCENES[scene]

  return (
    <section style={{
      position: 'relative',
      height,
      width: '100%',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
    }}>
      {/* 3D Scene */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
      }}>
        {SceneComponent ? <SceneComponent /> : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, rgba(196,168,130,0.08) 0%, transparent 60%)',
          }} />
        )}
      </div>

      {/* Depth fade edges */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        background: `
          linear-gradient(180deg, var(--bg-primary) 0%, transparent 15%, transparent 85%, var(--bg-primary) 100%),
          linear-gradient(90deg, var(--bg-primary) 0%, transparent 10%, transparent 90%, var(--bg-primary) 100%)
        `,
      }} />

      {/* Optional overlay text */}
      {overlayText && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 5%',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            color: 'var(--accent-gold)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textShadow: '0 0 40px rgba(10,10,10,0.8)',
          }}>
            {overlayText}
          </h2>
          {overlaySubtext && (
            <p style={{
              marginTop: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              textShadow: '0 0 20px rgba(10,10,10,0.9)',
            }}>
              {overlaySubtext}
            </p>
          )}
        </div>
      )}
    </section>
  )
}

// Export a Box-based 3D accent for embedding inside section cards
export function InlineGlassBox({ size = 0.8 }: { size?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 3, 4]} intensity={0.6} color="#C4A882" />
      <Environment preset="city" environmentIntensity={0.4} />
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.5}>
        <Box args={[size, size, size]}>
          <MeshTransmissionMaterial
            backside
            thickness={0.3}
            chromaticAberration={0.1}
            ior={1.2}
            color="#C4A882"
            roughness={0.02}
            transmission={0.95}
          />
        </Box>
      </Float>
    </Canvas>
  )
}
