import { useRef, useMemo, Component, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

class ParticleErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = 300;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const t = state.clock.elapsedTime;
      pointsRef.current.rotation.y = t * 0.02;
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += Math.sin(t * 0.3 + posArray[i * 3]) * 0.002;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#1EAE98"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#D4AF37" />
      <ParticleField />
    </>
  );
}

export default function ParticleScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <ParticleErrorBoundary>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      </ParticleErrorBoundary>
    </div>
  );
}
