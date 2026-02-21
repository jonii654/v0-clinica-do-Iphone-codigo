import { useEffect, useRef, useMemo, lazy, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// ─── Geometry helpers ────────────────────────────────────────────

function createRoundedRectShape(w: number, h: number, r: number) {
  const shape = new THREE.Shape();
  const hw = w / 2;
  const hh = h / 2;
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  return shape;
}

// ─── Flat rounded rect (screen / panels) ─────────────────────────

function FlatRoundedRect({
  width, height, radius,
  position = [0, 0, 0],
  rotation,
  children,
}: {
  width: number; height: number; radius: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  children: React.ReactNode;
}) {
  const geo = useMemo(() => {
    const s = createRoundedRectShape(width, height, radius);
    return new THREE.ShapeGeometry(s, 16);
  }, [width, height, radius]);

  return (
    <mesh geometry={geo} position={position} rotation={rotation}>
      {children}
    </mesh>
  );
}

// ─── Frame band (extruded shell around body) ─────────────────────

function FrameBand({ width, height, depth, radius, thickness }: {
  width: number; height: number; depth: number; radius: number; thickness: number;
}) {
  const geo = useMemo(() => {
    const outer = createRoundedRectShape(width, height, radius);
    const inner = createRoundedRectShape(
      width - thickness * 2,
      height - thickness * 2,
      Math.max(0, radius - thickness)
    );
    outer.holes.push(inner as unknown as THREE.Path);
    const g = new THREE.ExtrudeGeometry(outer, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 3,
      curveSegments: 20,
    });
    g.center();
    g.computeVertexNormals();
    return g;
  }, [width, height, depth, radius, thickness]);

  return (
    <mesh geometry={geo}>
      <meshPhysicalMaterial
        color="#8a8a8a"
        metalness={1}
        roughness={0.12}
        envMapIntensity={2}
        clearcoat={0.2}
        clearcoatRoughness={0.15}
      />
    </mesh>
  );
}

// ─── Camera module ───────────────────────────────────────────────

function CameraModule({ position }: { position: [number, number, number] }) {
  const moduleGeo = useMemo(() => {
    const s = createRoundedRectShape(1.15, 1.15, 0.26);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.07,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 3,
      curveSegments: 16,
    });
    g.center();
    g.computeVertexNormals();
    return g;
  }, []);

  const lenses: [number, number][] = [[-0.27, 0.27], [0.27, 0.27], [-0.27, -0.27]];

  return (
    <group position={position}>
      <mesh geometry={moduleGeo} rotation={[0, Math.PI, 0]}>
        <meshPhysicalMaterial color="#18181c" metalness={0.4} roughness={0.22} clearcoat={0.4} clearcoatRoughness={0.12} />
      </mesh>

      {lenses.map(([lx, ly], i) => (
        <group key={i} position={[lx, ly, -0.045]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.17, 0.022, 12, 24]} />
            <meshPhysicalMaterial color="#505050" metalness={1} roughness={0.1} envMapIntensity={2} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.05, 24]} />
            <meshPhysicalMaterial color="#08080e" metalness={0.9} roughness={0.06} envMapIntensity={1.5} />
          </mesh>
          <mesh position={[0, 0, -0.008]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.015, 24]} />
            <meshPhysicalMaterial color="#06041a" metalness={0.7} roughness={0.03} clearcoat={1} clearcoatRoughness={0.02} envMapIntensity={2.5} ior={1.8} />
          </mesh>
        </group>
      ))}

      {/* Flash */}
      <mesh position={[0.27, -0.27, -0.035]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.025, 12]} />
        <meshStandardMaterial color="#ffeecc" emissive="#ffeecc" emissiveIntensity={0.08} metalness={0.3} roughness={0.3} />
      </mesh>

      {/* LiDAR */}
      <mesh position={[0, -0.02, -0.035]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.015, 12]} />
        <meshPhysicalMaterial color="#080808" metalness={0.9} roughness={0.06} />
      </mesh>
    </group>
  );
}

// ─── Apple logo (simplified shape) ───────────────────────────────

function AppleLogo({ position }: { position: [number, number, number] }) {
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    // Simplified apple silhouette
    shape.moveTo(0, 0.18);
    shape.bezierCurveTo(0.06, 0.22, 0.12, 0.18, 0.12, 0.12);
    shape.bezierCurveTo(0.15, 0.12, 0.18, 0.06, 0.16, 0);
    shape.bezierCurveTo(0.18, -0.06, 0.16, -0.14, 0.1, -0.18);
    shape.bezierCurveTo(0.06, -0.22, 0.02, -0.2, 0, -0.18);
    shape.bezierCurveTo(-0.02, -0.2, -0.06, -0.22, -0.1, -0.18);
    shape.bezierCurveTo(-0.16, -0.14, -0.18, -0.06, -0.16, 0);
    shape.bezierCurveTo(-0.18, 0.06, -0.15, 0.12, -0.12, 0.12);
    shape.bezierCurveTo(-0.12, 0.18, -0.06, 0.22, 0, 0.18);
    return new THREE.ShapeGeometry(shape, 12);
  }, []);

  return (
    <mesh geometry={geo} position={position} rotation={[0, Math.PI, 0]}>
      <meshPhysicalMaterial color="#999" metalness={1} roughness={0.06} envMapIntensity={2.5} />
    </mesh>
  );
}

// ─── iPhone model ────────────────────────────────────────────────

function IPhoneModel() {
  const groupRef = useRef<THREE.Group>(null);
  const W = 2.5, H = 5.2, D = 0.26, R = 0.4;

  // Screen texture
  const screenTexture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 1024;
    const ctx = c.getContext('2d')!;

    // Dark blue/purple wallpaper
    const g = ctx.createLinearGradient(0, 0, 512, 1024);
    g.addColorStop(0, '#060014');
    g.addColorStop(0.25, '#12042e');
    g.addColorStop(0.45, '#280856');
    g.addColorStop(0.6, '#4a1578');
    g.addColorStop(0.75, '#782468');
    g.addColorStop(0.9, '#a03858');
    g.addColorStop(1, '#060014');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 1024);

    ctx.save(); ctx.globalCompositeOperation = 'screen';
    // Flowing highlight
    ctx.save(); ctx.translate(256, 380); ctx.rotate(-0.45);
    const s1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 250);
    s1.addColorStop(0, 'rgba(255,90,160,0.6)');
    s1.addColorStop(0.5, 'rgba(180,50,130,0.2)');
    s1.addColorStop(1, 'rgba(80,15,60,0)');
    ctx.fillStyle = s1; ctx.fillRect(-280, -120, 560, 240);
    ctx.restore();
    ctx.restore();

    // Status bar
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 17px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('9:41', 256, 68);

    // Lock screen clock
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '100 68px sans-serif';
    ctx.fillText('9:41', 256, 320);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '300 18px sans-serif';
    ctx.fillText('Sexta-feira, 21 de fevereiro', 256, 355);

    // Home indicator
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.roundRect(200, 982, 112, 4, 2); ctx.fill();

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Back texture with branding
  const backTexture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 1024;
    const ctx = c.getContext('2d')!;

    // Dark titanium
    const g = ctx.createLinearGradient(0, 0, 0, 1024);
    g.addColorStop(0, '#1c1c20');
    g.addColorStop(0.5, '#1a1a1e');
    g.addColorStop(1, '#161618');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 1024);

    // Subtle shimmer
    const shimmer = ctx.createLinearGradient(0, 0, 512, 512);
    shimmer.addColorStop(0, 'rgba(255,255,255,0)');
    shimmer.addColorStop(0.5, 'rgba(255,255,255,0.015)');
    shimmer.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shimmer;
    ctx.fillRect(0, 200, 512, 512);

    // "iPhone" text at the bottom
    ctx.fillStyle = 'rgba(160,160,160,0.18)';
    ctx.font = '300 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('iPhone', 256, 920);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.08, 0, 0]}>
      {/* Frame */}
      <FrameBand width={W} height={H} depth={D} radius={R} thickness={0.055} />

      {/* Front glass */}
      <FlatRoundedRect width={W - 0.04} height={H - 0.04} radius={R - 0.02} position={[0, 0, D / 2 + 0.022]}>
        <meshPhysicalMaterial color="#040404" metalness={0.1} roughness={0.06} clearcoat={1} clearcoatRoughness={0.04} reflectivity={1} envMapIntensity={1} />
      </FlatRoundedRect>

      {/* Screen */}
      <FlatRoundedRect width={W - 0.14} height={H - 0.14} radius={R - 0.08} position={[0, 0, D / 2 + 0.025]}>
        <meshBasicMaterial map={screenTexture} toneMapped={false} />
      </FlatRoundedRect>

      {/* Dynamic Island */}
      <mesh position={[0, H / 2 - 0.4, D / 2 + 0.027]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.07, 0.24, 12, 12]} />
        <meshBasicMaterial color="#000" />
      </mesh>

      {/* Back glass with texture */}
      <FlatRoundedRect width={W - 0.04} height={H - 0.04} radius={R - 0.02} position={[0, 0, -(D / 2 + 0.022)]}>
        <meshPhysicalMaterial
          map={backTexture}
          metalness={0.35}
          roughness={0.18}
          clearcoat={0.6}
          clearcoatRoughness={0.06}
          envMapIntensity={1.2}
        />
      </FlatRoundedRect>

      {/* Camera module */}
      <CameraModule position={[-0.55, H / 2 - 0.95, -(D / 2 + 0.025)]} />

      {/* Apple logo */}
      <AppleLogo position={[0, 0.15, -(D / 2 + 0.024)]} />

      {/* Side buttons */}
      <mesh position={[-(W / 2 + 0.022), 0.85, 0]}>
        <boxGeometry args={[0.035, 0.28, 0.07]} />
        <meshPhysicalMaterial color="#777" metalness={1} roughness={0.12} />
      </mesh>
      <mesh position={[-(W / 2 + 0.022), 0.42, 0]}>
        <boxGeometry args={[0.035, 0.28, 0.07]} />
        <meshPhysicalMaterial color="#777" metalness={1} roughness={0.12} />
      </mesh>
      <mesh position={[-(W / 2 + 0.022), 1.35, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.035, 12]} />
        <meshPhysicalMaterial color="#777" metalness={1} roughness={0.12} />
      </mesh>
      <mesh position={[W / 2 + 0.022, 0.65, 0]}>
        <boxGeometry args={[0.035, 0.36, 0.07]} />
        <meshPhysicalMaterial color="#777" metalness={1} roughness={0.12} />
      </mesh>

      {/* Speaker holes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`sl${i}`} position={[-0.6 + i * 0.065, -(H / 2 + 0.012), 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.05, 6]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`sr${i}`} position={[0.28 + i * 0.065, -(H / 2 + 0.012), 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.05, 6]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
      ))}

      {/* USB-C */}
      <mesh position={[0, -(H / 2 + 0.012), 0]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.025, 0.1, 6, 6]} />
        <meshBasicMaterial color="#111" />
      </mesh>
    </group>
  );
}

// ─── Facade text behind iPhone ───────────────────────────────────

function FacadeText() {
  return (
    <group position={[0, 0, -3]}>
      <Text
        font="/fonts/Geist-Bold.ttf"
        fontSize={1.1}
        color="#1E3A8A"
        anchorX="center"
        anchorY="middle"
        position={[0, 0.4, 0]}
        fillOpacity={0.08}
      >
        QUALIDADE
      </Text>
      <Text
        font="/fonts/Geist-Bold.ttf"
        fontSize={1.5}
        color="#1E3A8A"
        anchorX="center"
        anchorY="middle"
        position={[0, -0.8, 0]}
        fillOpacity={0.06}
      >
        {'E AQUI'}
      </Text>
    </group>
  );
}

// ─── 3D Scene ────────────────────────────────────────────────────

function IPhoneScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{
        alpha: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        powerPreference: 'high-performance',
      }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} />
      <directionalLight position={[-2, -3, -5]} intensity={0.3} />
      <spotLight position={[0, 4, 7]} angle={0.3} penumbra={0.8} intensity={1} />
      <pointLight position={[2.5, 0, 3.5]} intensity={0.25} color="#dde4ff" />
      <Environment preset="studio" />
      <FacadeText />
      <IPhoneModel />
    </Canvas>
  );
}

// ─── Hero section ────────────────────────────────────────────────

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    // Delay canvas mount for faster initial paint
    const timer = setTimeout(() => setShowCanvas(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
      .fromTo(
        canvasRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.4'
      );
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white"
    >
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #1E3A8A 0%, transparent 70%)' }}
        />
      </div>

      {/* Facade text behind (HTML fallback while 3D loads) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
        <span className="text-[12vw] md:text-[8vw] font-bold tracking-tight text-brand-blue/[0.04] leading-none">
          QUALIDADE
        </span>
        <span className="text-[16vw] md:text-[10vw] font-bold tracking-tight text-brand-blue/[0.03] leading-none mt-2">
          {'E AQUI'}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 flex flex-col items-center">

        {/* Title */}
        <div
          ref={titleRef}
          className="flex flex-col items-center mb-2"
          style={{ opacity: 0 }}
        >
          <img
            src="/images/logo-clinica.jpg"
            alt="Clinica do iPhone"
            className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover mb-3"
          />
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extralight text-gray-900 text-center text-balance">
            Clinica do <span className="text-brand-blue font-normal">iPhone</span>
          </h1>
        </div>

        {/* 3D iPhone */}
        <div
          ref={canvasRef}
          className="w-full max-w-[340px] md:max-w-[400px] lg:max-w-[440px] h-[460px] md:h-[540px] lg:h-[600px] my-2"
          style={{ opacity: 0 }}
        >
          {showCanvas ? (
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
              </div>
            }>
              <IPhoneScene />
            </Suspense>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-base md:text-lg font-light text-gray-500 text-center max-w-md text-pretty"
          style={{ opacity: 0 }}
        >
          Especialistas em reparos Apple com pecas originais e garantia real.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
