import React, { useRef, useMemo, Component, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Float, MeshDistortMaterial } from '@react-three/drei';
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

const NodeGraph = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  const nodeCount = 12;
  const nodes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < nodeCount; i++) {
        temp.push({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4
            ),
            speed: Math.random() * 0.01 + 0.005,
            offset: Math.random() * 100
        });
    }
    return temp;
  }, []);

  useFrame(() => {
    if (groupRef.current) {
        // Smooth rotation
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.4, 0.05);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.4, 0.05);
        
        // Smooth position follow (within its bounds)
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouse.x * 2, 0.05);
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouse.y * 2, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Core */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[0.4, 64, 64]}>
          <MeshDistortMaterial
            color="#3b82f6"
            speed={3}
            distort={0.4}
            radius={1}
            emissive="#1e40af"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>

      {/* Orbiting Nodes */}
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            emissive="#60a5fa" 
            emissiveIntensity={2} 
          />
        </mesh>
      ))}

      {/* Connection Lines */}
      <primitive object={new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.5, 1)),
        new THREE.LineBasicMaterial({ color: '#3b82f6', transparent: true, opacity: 0.1 })
      )} />
    </group>
  );
};

const Background3D: React.FC = () => {
  return (
    <WebGLBoundary>
      <div className="background-3d-container" style={{ position: 'absolute', right: '5%', top: '10%', width: '300px', height: '300px', pointerEvents: 'none', zIndex: 10 }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
           <ambientLight intensity={0.5} />
           <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
           <NodeGraph />
        </Canvas>
      </div>
    </WebGLBoundary>
  );
};

export default Background3D;
