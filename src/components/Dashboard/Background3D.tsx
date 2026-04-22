import React, { useRef, Component, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Error boundary so WebGL failures don't crash the entire app
interface EBState { hasError: boolean; }
class WebGLBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return null; // graceful fallback: just show nothing
    return this.props.children;
  }
}

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null);
  
  // Create a subtle particle field
  const particlesCount = 2000;
  const positions = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.3}
        />
      </Points>
    </group>
  );
};

const Background3D: React.FC = () => {
  return (
    <WebGLBoundary>
      <div className="background-3d-container">
        <Canvas camera={{ position: [0, 0, 1] }} gl={{ failIfMajorPerformanceCaveat: false }}>
          <ParticleField />
        </Canvas>
      </div>
    </WebGLBoundary>
  );
};

export default Background3D;
