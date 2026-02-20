import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Helper: create a rounded rect shape
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

// Extruded rounded rectangle component
function RoundedRect({
  width,
  height,
  depth,
  radius,
  position = [0, 0, 0],
  children,
}: {
  width: number;
  height: number;
  depth: number;
  radius: number;
  position?: [number, number, number];
  children: React.ReactNode;
}) {
  const geometry = useMemo(() => {
    const shape = createRoundedRectShape(width, height, radius);
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
      curveSegments: 24,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [width, height, depth, radius]);

  return (
    <mesh geometry={geometry} position={position}>
      {children}
    </mesh>
  );
}

// Flat rounded rect (no bevel) for screen panels
function FlatRoundedRect({
  width,
  height,
  radius,
  position = [0, 0, 0],
  children,
}: {
  width: number;
  height: number;
  radius: number;
  position?: [number, number, number];
  children: React.ReactNode;
}) {
  const geometry = useMemo(() => {
    const shape = createRoundedRectShape(width, height, radius);
    const geo = new THREE.ShapeGeometry(shape, 24);
    return geo;
  }, [width, height, radius]);

  return (
    <mesh geometry={geometry} position={position}>
      {children}
    </mesh>
  );
}

// Frame band: a thin extruded shell around the body
function FrameBand({
  width,
  height,
  depth,
  radius,
  thickness,
}: {
  width: number;
  height: number;
  depth: number;
  radius: number;
  thickness: number;
}) {
  const geometry = useMemo(() => {
    const outer = createRoundedRectShape(width, height, radius);
    const inner = createRoundedRectShape(
      width - thickness * 2,
      height - thickness * 2,
      Math.max(0, radius - thickness)
    );
    outer.holes.push(inner as unknown as THREE.Path);
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 4,
      curveSegments: 32,
    };
    const geo = new THREE.ExtrudeGeometry(outer, extrudeSettings);
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [width, height, depth, radius, thickness]);

  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial
        color="#c0c0c0"
        metalness={1}
        roughness={0.08}
        envMapIntensity={2.5}
        clearcoat={0.3}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

// Realistic iPhone 15 Pro Model
function IPhoneModel() {
  const groupRef = useRef<THREE.Group>(null);

  // Body dimensions
  const W = 2.6;
  const H = 5.4;
  const D = 0.28;
  const R = 0.42;

  // Screen wallpaper texture
  const screenTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Deep purple/blue gradient wallpaper
    const gradient = ctx.createLinearGradient(0, 0, 512, 1024);
    gradient.addColorStop(0, '#0a001a');
    gradient.addColorStop(0.2, '#1a0533');
    gradient.addColorStop(0.4, '#2d0a5e');
    gradient.addColorStop(0.6, '#5a1a8a');
    gradient.addColorStop(0.75, '#8b2e7a');
    gradient.addColorStop(0.9, '#c44a6a');
    gradient.addColorStop(1, '#0a001a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 1024);

    // Organic flowing light streaks
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Main diagonal light
    ctx.save();
    ctx.translate(256, 420);
    ctx.rotate(-0.5);
    const s1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 280);
    s1.addColorStop(0, 'rgba(255, 100, 180, 0.7)');
    s1.addColorStop(0.4, 'rgba(200, 60, 150, 0.35)');
    s1.addColorStop(1, 'rgba(100, 20, 80, 0)');
    ctx.fillStyle = s1;
    ctx.fillRect(-300, -140, 600, 280);
    ctx.restore();

    // Secondary sweep
    ctx.save();
    ctx.translate(350, 280);
    ctx.rotate(0.8);
    const s2 = ctx.createRadialGradient(0, 0, 0, 0, 0, 200);
    s2.addColorStop(0, 'rgba(140, 60, 255, 0.5)');
    s2.addColorStop(0.5, 'rgba(100, 30, 200, 0.2)');
    s2.addColorStop(1, 'rgba(60, 10, 120, 0)');
    ctx.fillStyle = s2;
    ctx.fillRect(-200, -80, 400, 160);
    ctx.restore();

    // Top subtle glow
    ctx.save();
    ctx.translate(150, 150);
    const s3 = ctx.createRadialGradient(0, 0, 0, 0, 0, 180);
    s3.addColorStop(0, 'rgba(80, 40, 200, 0.4)');
    s3.addColorStop(1, 'rgba(40, 10, 100, 0)');
    ctx.fillStyle = s3;
    ctx.fillRect(-180, -180, 360, 360);
    ctx.restore();

    ctx.restore();

    // Status bar elements
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('9:41', 256, 70);

    // Battery, signal icons (simple)
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('100%', 480, 70);

    // Battery icon
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.roundRect(420, 58, 26, 14, 3);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(446, 62, 3, 6);

    // Signal bars
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    for (let i = 0; i < 4; i++) {
      const barH = 4 + i * 3;
      ctx.fillRect(40 + i * 6, 72 - barH, 4, barH);
    }

    // WiFi dots
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'left';

    // Time centered text at bottom
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '100 72px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('9:41', 256, 330);

    // Date
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '300 20px sans-serif';
    ctx.fillText('Quinta-feira, 20 de fevereiro', 256, 365);

    // Bottom home indicator
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.roundRect(196, 980, 120, 5, 3);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.1, 0, 0]}>
      {/* Titanium Frame Band */}
      <FrameBand width={W} height={H} depth={D} radius={R} thickness={0.06} />

      {/* Front Glass Panel */}
      <FlatRoundedRect
        width={W - 0.04}
        height={H - 0.04}
        radius={R - 0.02}
        position={[0, 0, D / 2 + 0.025]}
      >
        <meshPhysicalMaterial
          color="#050505"
          metalness={0.1}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.03}
          reflectivity={1}
          envMapIntensity={1.2}
        />
      </FlatRoundedRect>

      {/* Screen Display */}
      <FlatRoundedRect
        width={W - 0.16}
        height={H - 0.16}
        radius={R - 0.1}
        position={[0, 0, D / 2 + 0.028]}
      >
        <meshBasicMaterial map={screenTexture} toneMapped={false} />
      </FlatRoundedRect>

      {/* Dynamic Island */}
      <mesh position={[0, H / 2 - 0.42, D / 2 + 0.03]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.08, 0.28, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Back Glass Panel */}
      <FlatRoundedRect
        width={W - 0.04}
        height={H - 0.04}
        radius={R - 0.02}
        position={[0, 0, -(D / 2 + 0.025)]}
      >
        <meshPhysicalMaterial
          color="#1a1a1e"
          metalness={0.3}
          roughness={0.15}
          clearcoat={0.8}
          clearcoatRoughness={0.05}
          envMapIntensity={1.5}
        />
      </FlatRoundedRect>

      {/* Camera Module Plate */}
      <CameraModule position={[-0.58, H / 2 - 1.0, -(D / 2 + 0.028)]} />

      {/* Apple Logo (back center) */}
      <mesh position={[0, 0.2, -(D / 2 + 0.027)]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.22, 32]} />
        <meshPhysicalMaterial
          color="#aaaaaa"
          metalness={1}
          roughness={0.05}
          envMapIntensity={2}
        />
      </mesh>

      {/* Side Buttons */}
      {/* Volume Up */}
      <mesh position={[-(W / 2 + 0.025), 0.9, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.04, 0.3, 0.08]} />
        <meshPhysicalMaterial color="#888888" metalness={1} roughness={0.1} />
      </mesh>
      {/* Volume Down */}
      <mesh position={[-(W / 2 + 0.025), 0.45, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.04, 0.3, 0.08]} />
        <meshPhysicalMaterial color="#888888" metalness={1} roughness={0.1} />
      </mesh>
      {/* Action Button */}
      <mesh position={[-(W / 2 + 0.025), 1.45, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
        <meshPhysicalMaterial color="#888888" metalness={1} roughness={0.1} />
      </mesh>
      {/* Power Button */}
      <mesh position={[W / 2 + 0.025, 0.7, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.04, 0.4, 0.08]} />
        <meshPhysicalMaterial color="#888888" metalness={1} roughness={0.1} />
      </mesh>

      {/* Bottom Speaker Holes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`spk-l-${i}`} position={[-0.65 + i * 0.07, -(H / 2 + 0.015), 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
          <meshBasicMaterial color="#222" />
        </mesh>
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`spk-r-${i}`} position={[0.3 + i * 0.07, -(H / 2 + 0.015), 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
          <meshBasicMaterial color="#222" />
        </mesh>
      ))}

      {/* USB-C Port */}
      <mesh position={[0, -(H / 2 + 0.015), 0]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.03, 0.12, 8, 8]} />
        <meshBasicMaterial color="#111" />
      </mesh>
    </group>
  );
}

// Camera Module Component
function CameraModule({ position }: { position: [number, number, number] }) {
  const moduleGeo = useMemo(() => {
    const shape = createRoundedRectShape(1.2, 1.2, 0.28);
    const settings: THREE.ExtrudeGeometryOptions = {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 4,
      curveSegments: 24,
    };
    const geo = new THREE.ExtrudeGeometry(shape, settings);
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, []);

  const lensPositions: [number, number][] = [
    [-0.28, 0.28],  // Top Left
    [0.28, 0.28],   // Top Right
    [-0.28, -0.28], // Bottom Left
  ];

  return (
    <group position={position}>
      {/* Module housing */}
      <mesh geometry={moduleGeo} rotation={[0, Math.PI, 0]}>
        <meshPhysicalMaterial
          color="#1a1a1e"
          metalness={0.4}
          roughness={0.2}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Lenses */}
      {lensPositions.map(([lx, ly], i) => (
        <group key={i} position={[lx, ly, -0.05]}>
          {/* Outer ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.18, 0.025, 16, 32]} />
            <meshPhysicalMaterial
              color="#555555"
              metalness={1}
              roughness={0.08}
              envMapIntensity={2}
            />
          </mesh>
          {/* Lens body */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.06, 32]} />
            <meshPhysicalMaterial
              color="#0a0a12"
              metalness={0.9}
              roughness={0.05}
              envMapIntensity={1.5}
            />
          </mesh>
          {/* Inner glass */}
          <mesh position={[0, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.02, 32]} />
            <meshPhysicalMaterial
              color="#0a0520"
              metalness={0.8}
              roughness={0.02}
              clearcoat={1}
              clearcoatRoughness={0.01}
              envMapIntensity={3}
              ior={2.0}
            />
          </mesh>
        </group>
      ))}

      {/* Flash */}
      <mesh position={[0.28, -0.28, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
        <meshStandardMaterial
          color="#ffeecc"
          emissive="#ffeecc"
          emissiveIntensity={0.1}
          metalness={0.3}
          roughness={0.3}
        />
      </mesh>

      {/* LiDAR */}
      <mesh position={[0, -0.02, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshPhysicalMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.05}
        />
      </mesh>
    </group>
  );
}

// Marquee Text - Passando atrás do iPhone
function MarqueeText({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const content = containerRef.current.querySelector('.marquee-content-inner');
    if (!content) return;

    const clone = content.cloneNode(true);
    containerRef.current.appendChild(clone);

    gsap.to(containerRef.current.children, {
      x: '-50%',
      duration: 20,
      ease: 'none',
      repeat: -1,
    });
  }, []);

  return (
    <div className="overflow-hidden whitespace-nowrap absolute inset-0 flex items-center pointer-events-none z-0">
      <div ref={containerRef} className="inline-flex">
        <div className="marquee-content-inner flex items-center">
          {Array(6)
            .fill(text)
            .map((t, i) => (
              <span
                key={i}
                className="text-[15vw] md:text-[12vw] font-black tracking-tighter text-gray-100 select-none mx-4"
              >
                {t}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
      .fromTo(
        canvasRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.5'
      );
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white"
    >
      {/* Background Marquee - Passando atrás */}
      <MarqueeText text="Clínica do iPhone" />

      {/* Content Container */}
      <div className="relative z-10 w-full px-6 flex flex-col items-center">
        
        {/* Title - Above iPhone */}
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-7xl font-extralight text-gray-900 text-center mb-4"
          style={{ opacity: 0 }}
        >
          Clínica do <span className="text-brand-blue font-normal">iPhone</span>
        </h1>

        {/* 3D iPhone - Center */}
        <div
          ref={canvasRef}
          className="w-full max-w-[360px] md:max-w-[420px] lg:max-w-[480px] h-[500px] md:h-[600px] lg:h-[680px] my-4"
          style={{ opacity: 0 }}
        >
          <Canvas
            camera={{ position: [0, 0, 7.5], fov: 45 }}
            gl={{ 
              alpha: true, 
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2,
            }}
            style={{ background: 'transparent' }}
            dpr={[1, 2]}
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow />
            <directionalLight position={[-3, -4, -6]} intensity={0.4} />
            <spotLight
              position={[0, 5, 8]}
              angle={0.3}
              penumbra={0.8}
              intensity={1.2}
              castShadow={false}
            />
            <pointLight position={[3, 0, 4]} intensity={0.3} color="#e0e8ff" />
            <Environment preset="studio" />
            <IPhoneModel />
          </Canvas>
        </div>

        {/* Subtitle - Below iPhone */}
        <p
          ref={subtitleRef}
          className="text-lg md:text-xl font-light text-gray-600 text-center max-w-md"
          style={{ opacity: 0 }}
        >
          Especialistas em reparos Apple com peças originais e garantia real.
        </p>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </div>
    </section>
  );
}
