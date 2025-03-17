"use client"; // Ensure this runs only on the client-side

import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as Tone from 'tone';

const HexagonalGrid = () => {
  const hexRef = useRef([]);
  const [hovered, setHovered] = useState(null);

  // Mouse tracking effect
  const handleMouseMove = (e) => {
    const mousePos = new THREE.Vector2();
    mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;

    hexRef.current.forEach((hex) => {
      const distance = hex.position.distanceTo(new THREE.Vector3(mousePos.x, mousePos.y, 0));
      hex.material.emissiveIntensity = 1 / distance;
    });
  };

  useEffect(() => {
    // 10Hz transient sound setup
    const player = new Tone.Oscillator(10, "sine").toDestination();
    player.start();
    player.volume.value = -30;

    return () => player.stop();
  }, []);

  return (
    <group>
      {[...Array(10)].map((_, i) => {
        const x = Math.cos((i / 10) * Math.PI * 2) * 4;
        const z = Math.sin((i / 10) * Math.PI * 2) * 4;
        return (
          <mesh
            key={i}
            ref={(el) => (hexRef.current[i] = el)}
            position={[x, 0, z]}
            onPointerOver={() => setHovered(i)}
            onPointerOut={() => setHovered(null)}
          >
            <cylinderGeometry args={[1, 1, 0.2, 6]} />
            <meshStandardMaterial
              color={hovered === i ? 'orange' : 'blue'}
              emissive={hovered === i ? 'yellow' : 'black'}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const HexagonalScene = () => {
  return (
    <Canvas onPointerMove={handleMouseMove}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <HexagonalGrid />
      <OrbitControls />
    </Canvas>
  );
};

export default HexagonalScene;
