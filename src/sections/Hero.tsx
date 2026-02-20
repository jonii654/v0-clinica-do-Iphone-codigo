import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// iPhone 3D Component - iPhone 13 Pro Style
function IPhoneModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  const screenTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // iPhone 13 Pro wallpaper - purple/red gradient with geometric shapes
    const gradient = ctx.createLinearGradient(0, 0, 512, 1024);
    gradient.addColorStop(0, '#1a0a2e');
    gradient.addColorStop(0.3, '#2d1b4e');
    gradient.addColorStop(0.5, '#4a1c6b');
    gradient.addColorStop(0.7, '#7c2d6e');
    gradient.addColorStop(1, '#1a0a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 1024);
    
    // Add geometric light streaks
    ctx.save();
    ctx.translate(256, 512);
    ctx.rotate(-Math.PI / 6);
    
    const streakGradient = ctx.createLinearGradient(-200, 0, 200, 0);
    streakGradient.addColorStop(0, 'rgba(255, 50, 100, 0)');
    streakGradient.addColorStop(0.5, 'rgba(255, 80, 150, 0.6)');
    streakGradient.addColorStop(1, 'rgba(255, 50, 100, 0)');
    ctx.fillStyle = streakGradient;
    ctx.fillRect(-300, -100, 600, 200);
    ctx.restore();
    
    // Second streak
    ctx.save();
    ctx.translate(200, 300);
    ctx.rotate(Math.PI / 4);
    const streak2 = ctx.createLinearGradient(-150, 0, 150, 0);
    streak2.addColorStop(0, 'rgba(200, 50, 255, 0)');
    streak2.addColorStop(0.5, 'rgba(180, 60, 220, 0.4)');
    streak2.addColorStop(1, 'rgba(200, 50, 255, 0)');
    ctx.fillStyle = streak2;
    ctx.fillRect(-200, -50, 400, 100);
    ctx.restore();
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.15, 0, 0]}>
      {/* Main Body */}
      <RoundedBox 
        args={[2.8, 5.7, 0.32]} 
        radius={0.45} 
        smoothness={12}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.6} 
          roughness={0.25}
          envMapIntensity={1.5}
        />
      </RoundedBox>

      {/* Stainless Steel Frame */}
      <mesh position={[0, 2.85, 0]}>
        <boxGeometry args={[2.8, 0.06, 0.34]} />
        <meshStandardMaterial color="#e0e0e0" metalness={1} roughness={0.05} />
      </mesh>
      <mesh position={[0, -2.85, 0]}>
        <boxGeometry args={[2.8, 0.06, 0.34]} />
        <meshStandardMaterial color="#e0e0e0" metalness={1} roughness={0.05} />
      </mesh>
      <mesh position={[-1.4, 0, 0]}>
        <boxGeometry args={[0.06, 5.7, 0.34]} />
        <meshStandardMaterial color="#e0e0e0" metalness={1} roughness={0.05} />
      </mesh>
      <mesh position={[1.4, 0, 0]}>
        <boxGeometry args={[0.06, 5.7, 0.34]} />
        <meshStandardMaterial color="#e0e0e0" metalness={1} roughness={0.05} />
      </mesh>

      {/* Screen */}
      <RoundedBox 
        args={[2.65, 5.55, 0.015]} 
        radius={0.4} 
        smoothness={12}
        position={[0, 0, 0.16]}
      >
        <meshBasicMaterial map={screenTexture} />
      </RoundedBox>

      {/* Black Bezel */}
      <RoundedBox 
        args={[2.67, 5.57, 0.01]} 
        radius={0.41} 
        smoothness={12}
        position={[0, 0, 0.155]}
      >
        <meshBasicMaterial color="#000000" />
      </RoundedBox>

      {/* Dynamic Island / Notch */}
      <group position={[0, 2.35, 0.17]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <capsuleGeometry args={[0.32, 0.45, 4, 8]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* Volume Buttons */}
      <mesh position={[-1.43, 1.1, 0]}>
        <boxGeometry args={[0.04, 0.35, 0.06]} />
        <meshStandardMaterial color="#e0e0e0" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[-1.43, 0.55, 0]}>
        <boxGeometry args={[0.04, 0.35, 0.06]} />
        <meshStandardMaterial color="#e0e0e0" metalness={1} roughness={0.1} />
      </mesh>

      {/* Power Button */}
      <mesh position={[1.43, 0.9, 0]}>
        <boxGeometry args={[0.04, 0.45, 0.06]} />
        <meshStandardMaterial color="#e0e0e0" metalness={1} roughness={0.1} />
      </mesh>

      {/* Back Glass */}
      <RoundedBox 
        args={[2.8, 5.7, 0.015]} 
        radius={0.45} 
        smoothness={12}
        position={[0, 0, -0.16]}
      >
        <meshStandardMaterial 
          color="#2a2a2a" 
          metalness={0.5} 
          roughness={0.2}
        />
      </RoundedBox>

      {/* Apple Logo */}
      <mesh position={[0, 0.4, -0.17]}>
        <circleGeometry args={[0.32, 32]} />
        <meshStandardMaterial 
          color="#c0c0c0" 
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>

      {/* Camera Module */}
      <RoundedBox 
        args={[1.35, 1.35, 0.12]} 
        radius={0.25} 
        smoothness={8}
        position={[-0.65, 1.9, -0.22]}
      >
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.5} 
          roughness={0.3}
        />
      </RoundedBox>

      {/* Camera Lenses with rings */}
      {/* Top Left */}
      <mesh position={[-0.95, 2.2, -0.28]}>
        <cylinderGeometry args={[0.2, 0.2, 0.06, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.95, 2.2, -0.31]}>
        <cylinderGeometry args={[0.14, 0.14, 0.02, 32]} />
        <meshStandardMaterial color="#1a1a3a" metalness={0.9} roughness={0.05} />
      </mesh>
      {/* Lens ring */}
      <mesh position={[-0.95, 2.2, -0.275]}>
        <torusGeometry args={[0.2, 0.015, 8, 32]} />
        <meshStandardMaterial color="#606060" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Top Right */}
      <mesh position={[-0.35, 2.2, -0.28]}>
        <cylinderGeometry args={[0.2, 0.2, 0.06, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.35, 2.2, -0.31]}>
        <cylinderGeometry args={[0.14, 0.14, 0.02, 32]} />
        <meshStandardMaterial color="#1a1a3a" metalness={0.9} roughness={0.05} />
      </mesh>
      <mesh position={[-0.35, 2.2, -0.275]}>
        <torusGeometry args={[0.2, 0.015, 8, 32]} />
        <meshStandardMaterial color="#606060" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Bottom Left */}
      <mesh position={[-0.95, 1.6, -0.28]}>
        <cylinderGeometry args={[0.2, 0.2, 0.06, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.95, 1.6, -0.31]}>
        <cylinderGeometry args={[0.14, 0.14, 0.02, 32]} />
        <meshStandardMaterial color="#1a1a3a" metalness={0.9} roughness={0.05} />
      </mesh>
      <mesh position={[-0.95, 1.6, -0.275]}>
        <torusGeometry args={[0.2, 0.015, 8, 32]} />
        <meshStandardMaterial color="#606060" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Flash */}
      <mesh position={[-0.35, 1.6, -0.28]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
        <meshStandardMaterial color="#ffffcc" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* LiDAR */}
      <mesh position={[-0.65, 1.35, -0.28]}>
        <cylinderGeometry args={[0.06, 0.06, 0.015, 16]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Bottom Speaker Grills */}
      <mesh position={[-0.7, -2.8, 0.17]}>
        <boxGeometry args={[0.35, 0.025, 0.015]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.7, -2.8, 0.17]}>
        <boxGeometry args={[0.35, 0.025, 0.015]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>

      {/* Lightning Port */}
      <mesh position={[0, -2.8, 0.17]}>
        <boxGeometry args={[0.12, 0.04, 0.015]} />
        <meshBasicMaterial color="#1a1a1a" />
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
          className="w-full max-w-[280px] md:max-w-[320px] h-[400px] md:h-[500px] my-4"
          style={{ opacity: 0 }}
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <directionalLight position={[-5, -5, -5]} intensity={0.5} />
            <pointLight position={[0, 0, 5]} intensity={0.4} />
            <Environment preset="city" />
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
