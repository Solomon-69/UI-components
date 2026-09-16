import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, useGLTF, useTexture } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// Public assets are addressed from the deploy base so the site also works under a sub-path (GitHub Pages).
const BASE = import.meta.env.BASE_URL
const MODEL = `${BASE}models/iphone.glb`
const DRACO = `${BASE}draco/`
const TEXTURE = `${BASE}screens/hero-texture.webp`
const HDR = `${BASE}hdr/studio.hdr`

// Motion spec: Y-axis swivel only, 0 -> +35 -> 0 -> -35 -> 0 on a sine, one cycle every 9s,
// with a constant -5deg lean on X. Nothing else moves.
const MAX_YAW = THREE.MathUtils.degToRad(35)
const TILT = THREE.MathUtils.degToRad(-5)
const PERIOD = 9
const STATIC_YAW = THREE.MathUtils.degToRad(18) // pose of the reduced-motion / no-WebGL render
const SCALE = 0.74
const Y_OFFSET = -0.04

export type CapturePose = 'front' | 'angle' | null

useGLTF.preload(MODEL, DRACO)
useTexture.preload(TEXTURE)

function materialFor(name: string, screen: THREE.Texture, cache: Map<string, THREE.Material>) {
  const key = name.startsWith('Display_Borders') ? 'bezel' : name.startsWith('Display') ? 'screen' : name
  const hit = cache.get(key)
  if (hit) return hit
  let m: THREE.Material
  switch (true) {
    case key === 'screen':
      m = new THREE.MeshBasicMaterial({ map: screen, toneMapped: false })
      break
    case key === 'island':
      m = new THREE.MeshPhysicalMaterial({ color: '#050403', roughness: 0.7, metalness: 0, clearcoat: 0, envMapIntensity: 0.1 })
      break
    case key === 'bezel':
      m = new THREE.MeshPhysicalMaterial({ color: '#080605', roughness: 0.32, metalness: 0.2, clearcoat: 0.6, clearcoatRoughness: 0.25, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 })
      break
    case key.startsWith('Side_Dark'):
      m = new THREE.MeshStandardMaterial({ color: '#3d302b', roughness: 0.7, metalness: 0.25 })
      break
    case key.startsWith('Matte_Metallic') && key.includes('logo'):
      m = new THREE.MeshPhysicalMaterial({ color: '#c9bdb4', roughness: 0.18, metalness: 1, clearcoat: 0.3 })
      break
    case key.startsWith('Matte_Metallic'):
      // brushed titanium: metallic, slightly satin, with a clearcoat so the studio HDR reads on the rim
      m = new THREE.MeshPhysicalMaterial({ color: '#d6cbc3', roughness: 0.3, metalness: 1, clearcoat: 0.45, clearcoatRoughness: 0.18, envMapIntensity: 1.25 })
      break
    case key === 'Torch':
      m = new THREE.MeshStandardMaterial({ color: '#f3e4c4', roughness: 0.3, metalness: 0.1, emissive: '#3a2f1a', emissiveIntensity: 0.4 })
      break
    case key.startsWith('LIDAR') || key.startsWith('Cam'):
      m = new THREE.MeshPhysicalMaterial({ color: '#0e0d0d', roughness: 0.12, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.05 })
      break
    default:
      m = new THREE.MeshStandardMaterial({ color: '#2e2522', roughness: 0.6, metalness: 0.35 })
  }
  cache.set(key, m)
  return m
}

function PhoneModel({ onReady, capture, active }: { onReady: () => void; capture: CapturePose; active: boolean }) {
  const { scene } = useGLTF(MODEL, DRACO)
  const screen = useTexture(TEXTURE, (t) => {
    t.flipY = false
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 16
  })
  const group = useRef<THREE.Group>(null)
  const time = useRef(0)

  const { model, materials, geometries } = useMemo(() => {
    const cache = new Map<string, THREE.Material>()
    const clone = scene.clone(true)
    const glassMeshes: THREE.Mesh[] = []
    const ownedGeometries: THREE.BufferGeometry[] = []
    clone.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return
      const name = (o.material as THREE.Material).name ?? ''
      // The Display mesh has a cut-out for the island, so the island mesh must stay. Re-centre its
      // geometry and scale it a touch so it reads as a bold, true-to-life pill rather than a sliver.
      if (name.startsWith('Dynamic')) {
        const geo = o.geometry.clone()
        geo.computeBoundingBox()
        const c = new THREE.Vector3()
        geo.boundingBox!.getCenter(c)
        geo.translate(-c.x, -c.y, -c.z)
        o.geometry = geo
        o.position.copy(c)
        o.position.z += 0.004 // sits above the cover glass so nothing lights it
        o.scale.set(1.04, 1.28, 1)
        o.renderOrder = 3
        o.material = materialFor('island', screen, cache)
        ownedGeometries.push(geo)
        return
      }
      o.material = materialFor(name, screen, cache)
      if (name === 'Display') glassMeshes.push(o)
    })
    // Cover glass: a faint reflective sheet just above the screen so the studio light glides across it.
    const glass = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 0,
      roughness: 0.06,
      transparent: true,
      opacity: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.6,
      depthWrite: false,
    })
    cache.set('glass', glass)
    for (const m of glassMeshes) {
      const sheet = new THREE.Mesh(m.geometry, glass)
      sheet.position.z = 0.0015
      sheet.renderOrder = 2
      m.add(sheet)
    }
    return { model: clone, materials: cache, geometries: ownedGeometries }
  }, [scene, screen])

  // Materials are ours; geometries and the texture belong to the loader cache and stay.
  useEffect(() => {
    return () => {
      materials.forEach((m) => m.dispose())
      materials.clear()
      geometries.forEach((g) => g.dispose())
    }
  }, [materials, geometries])

  // Signal readiness from the first painted frame, so the placeholder never fades over an empty canvas.
  const painted = useRef(false)

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    if (!painted.current) {
      painted.current = true
      onReady()
    }
    if (capture) {
      g.rotation.set(TILT, capture === 'angle' ? STATIC_YAW : 0, 0)
      return
    }
    if (!active) return // paused or offscreen: a demand-mode repaint must not advance the swivel
    // Local clock: fiber resets its clock whenever frameloop toggles, which would snap the phone.
    time.current += Math.min(dt, 0.1)
    g.rotation.set(TILT, MAX_YAW * Math.sin((Math.PI * 2 * time.current) / PERIOD), 0)
  })

  return (
    <group ref={group} rotation={[TILT, 0, 0]} position={[0, Y_OFFSET, 0]} scale={SCALE}>
      <primitive object={model} />
    </group>
  )
}

type Props = { active: boolean; onReady: () => void; onError: () => void; capture?: CapturePose }

export default function HeroScene({ active, onReady, onError, capture = null }: Props) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'demand'}
      dpr={capture ? 2 : [1, 2]}
      camera={{ fov: 27, position: [0, 0, 7.1], near: 0.5, far: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'default', preserveDrawingBuffer: capture !== null }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        gl.setClearColor(0x000000, 0)
        // A lost GPU context never throws; route it to the same static fallback as every other failure.
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onError()
        })
      }}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 6]} intensity={1.4} color="#fff6ee" />
      <directionalLight position={[-4, 2, 3]} intensity={0.5} color="#f1d8ce" />
      <Suspense fallback={null}>
        <Environment files={HDR} environmentIntensity={0.85} />
        <PhoneModel onReady={onReady} capture={capture} active={active} />
        <ContactShadows position={[0, -1.62, 0]} scale={5} blur={2.4} opacity={0.42} far={2.2} resolution={512} color="#34221e" frames={1} />
      </Suspense>
    </Canvas>
  )
}
