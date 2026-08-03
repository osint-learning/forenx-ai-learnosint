import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const HologramCoreMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.5;
      ringRef.current.rotation.y += delta * 0.3;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x -= delta * 0.3;
      outerRingRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group>
      {/* Central Quantum Reactor Sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial
          color="#00ff99"
          emissive="#00ff99"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner Glowing Crystal Core */}
      <mesh>
        <octahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial color="#7efeff" wireframe transparent opacity={0.9} />
      </mesh>

      {/* Orbital Hologram Ring 1 */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.4, 0.04, 16, 100]} />
        <meshStandardMaterial color="#17ff88" emissive="#17ff88" emissiveIntensity={1} />
      </mesh>

      {/* Orbital Hologram Ring 2 */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[3.1, 0.03, 16, 100]} />
        <meshStandardMaterial color="#7efeff" emissive="#7efeff" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};

export const IntelligenceCore: React.FC = () => {
  return (
    <div className="relative w-full h-[450px] flex items-center justify-center pointer-events-none">
      {/* Canvas 3D Core */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ff99" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#7efeff" />
          <HologramCoreMesh />
        </Canvas>
      </div>

      {/* CSS Holographic Ambient Backlight Glow */}
      <div className="absolute w-72 h-72 bg-[#00ff99]/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute w-96 h-96 bg-[#7efeff]/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
