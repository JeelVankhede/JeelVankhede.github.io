import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ExperienceContent, Selection } from '../data/planetData';

const NONE = () => null;

interface Props {
  content: ExperienceContent;
  position: [number, number, number];
  onSelect: (s: Selection) => void;
  selected: boolean;
  dimmed: boolean;
}

/** A modern flat glass office (2–3 stories) representing a company / experience entry. */
export function Building({ content, position, onSelect, selected, dimmed }: Props) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = hovered || selected ? 1.1 : 1;
    const s = ref.current.scale.x;
    ref.current.scale.setScalar(s + (target - s) * Math.min(1, delta * 10));
  });

  const opacity = dimmed ? 0.4 : 1;
  const lit = dimmed ? 0.12 : 0.5;

  return (
    <group position={position}>
      <group
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(content);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* glass tower */}
        <mesh position={[0, 0.13, 0]} castShadow>
          <boxGeometry args={[0.13, 0.26, 0.1]} />
          <meshStandardMaterial
            color="#8fb6e0"
            metalness={0.35}
            roughness={0.12}
            emissive="#1b2c48"
            emissiveIntensity={lit}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* floor dividers → reads as ~3 stories */}
        {[0.065, 0.13, 0.195].map((y) => (
          <mesh key={y} position={[0, y, 0]} raycast={NONE}>
            <boxGeometry args={[0.136, 0.012, 0.106]} />
            <meshStandardMaterial color="#e6edf5" roughness={0.7} transparent opacity={opacity} />
          </mesh>
        ))}

        {/* corner mullions */}
        {[-1, 1].map((sx) => (
          <mesh key={sx} position={[sx * 0.064, 0.13, 0]} raycast={NONE}>
            <boxGeometry args={[0.008, 0.26, 0.104]} />
            <meshStandardMaterial color="#cdd8e6" roughness={0.6} transparent opacity={opacity} />
          </mesh>
        ))}

        {/* flat roof slab + accent parapet */}
        <mesh position={[0, 0.263, 0]} castShadow raycast={NONE}>
          <boxGeometry args={[0.144, 0.014, 0.112]} />
          <meshStandardMaterial color="#dfe7f0" roughness={0.6} transparent opacity={opacity} />
        </mesh>
        <mesh position={[0, 0.272, 0.05]} raycast={NONE}>
          <boxGeometry args={[0.144, 0.006, 0.012]} />
          <meshStandardMaterial color={content.accent} roughness={0.5} transparent opacity={opacity} />
        </mesh>

        {/* ground-floor entrance */}
        <mesh position={[0, 0.022, 0.051]} raycast={NONE}>
          <boxGeometry args={[0.05, 0.04, 0.006]} />
          <meshStandardMaterial color="#26354f" roughness={0.3} metalness={0.4} transparent opacity={opacity} />
        </mesh>

        {(hovered || selected) && (
          <Html center distanceFactor={3.4} position={[0, 0.4, 0]} style={{ pointerEvents: 'none' }}>
            <div className="planet-tooltip">{content.company}</div>
          </Html>
        )}
      </group>
    </group>
  );
}
