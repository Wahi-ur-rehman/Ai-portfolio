import React, { useRef, useMemo, Component, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Float, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Error boundary
interface EBState { hasError: boolean; }
class WebGLBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const ParticleNetwork = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  // Reduced count for performance
  const count = 600; 
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
        const time = state.clock.getElapsedTime();
        pointsRef.current.rotation.y = time * 0.03;
        // Faster lerp for snappier response
        pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, mouse.y * 0.3, 0.15);
        pointsRef.current.rotation.z = THREE.MathUtils.lerp(pointsRef.current.rotation.z, mouse.x * 0.3, 0.15);
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3b82f6"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.4}
      />
    </Points>
  );
};

const NeuralNodes = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  const nodeCount = 10; // Lowered from 15
  const nodes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < nodeCount; i++) {
        temp.push({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            )
        });
    }
    return temp;
  }, []);

  useFrame(() => {
    if (groupRef.current) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.8, 0.1);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.y * 0.8, 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
          <mesh position={node.position}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} />
          </mesh>
        </Float>
      ))}
      
      {/* Visual Connections - Simplified geometry */}
      <primitive object={new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(6, 1)), // Lower detail level
        new THREE.LineBasicMaterial({ color: '#3b82f6', transparent: true, opacity: 0.04 })
      )} />
    </group>
  );
}

const Background3D: React.FC = () => {
  return (
    <WebGLBoundary>
      <div className="background-3d-fixed" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Optimized dpr and performance options */}
        <Canvas 
          camera={{ position: [0, 0, 12], fov: 45 }} 
          dpr={[1, 1.5]} 
          gl={{ 
            antialias: false,
            powerPreference: "high-performance",
            alpha: true
          }}
        >
           <ambientLight intensity={0.5} />
           <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
           <ParticleNetwork />
           <NeuralNodes />
           
           {/* Central Core */}
           <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
             <Sphere args={[0.8, 32, 32]} position={[0,0,0]}>
               <MeshDistortMaterial
                 color="#3b82f6"
                 speed={1.5}
                 distort={0.3}
                 radius={1}
                 emissive="#1e40af"
                 emissiveIntensity={0.3}
               />
             </Sphere>
           </Float>
        </Canvas>
      </div>
    </WebGLBoundary>
  );
};

export default Background3D;
