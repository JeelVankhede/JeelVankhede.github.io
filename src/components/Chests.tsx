import { useState } from 'react';
import { Html } from '@react-three/drei';
import { surfaceTilt } from './planetMath';
import type { SkillContent, Selection } from '../data/planetData';

const NONE = () => null;

export interface ChestSpot {
  x: number;
  y: number;
  z: number;
}

/** A single gold treasure chest (base + rounded lid + lock). */
function Chest({ scale = 1, spin = 0 }: { scale?: number; spin?: number }) {
  return (
    <group scale={scale} rotation={[0, spin, 0]} position={[0, -0.012, 0]}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <boxGeometry args={[0.12, 0.07, 0.08]} />
        <meshStandardMaterial color="#caa23a" roughness={0.5} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0.075, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.042, 0.042, 0.12, 16]} />
        <meshStandardMaterial color="#e0b94a" roughness={0.45} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.045, 0]} raycast={NONE}>
        <boxGeometry args={[0.125, 0.012, 0.085]} />
        <meshStandardMaterial color="#8a6b1f" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.05, 0.044]} raycast={NONE}>
        <boxGeometry args={[0.022, 0.026, 0.012]} />
        <meshStandardMaterial color="#f4e08a" emissive="#5a4410" emissiveIntensity={0.5} roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}

interface Props {
  content: SkillContent;
  spots: ChestSpot[]; // each chest's own grounded position (island-local)
  onSelect: (s: Selection) => void;
  selected: boolean;
}

/** Gold chests (Data & Storage) — each chest grounded + tilted to the land it sits on. */
export function Chests({ content, spots, onSelect, selected }: Props) {
  const [hovered, setHovered] = useState(false);

  if (!spots.length) return null;

  return (
    <group
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
      {spots.map((s, i) => (
        <group key={i} position={[s.x, s.y, s.z]} quaternion={surfaceTilt(s.x, s.z)}>
          {/* larger + smaller chest, oriented ~100° apart for alignment */}
          <Chest scale={i === 0 ? 1.35 : 1.05} spin={i === 0 ? 0.4 : 0.4 + (100 * Math.PI) / 180} />
        </group>
      ))}

      {(hovered || selected) && (
        <Html
          center
          distanceFactor={3.6}
          position={[spots[0].x, spots[0].y + 0.32, spots[0].z]}
          style={{ pointerEvents: 'none' }}
        >
          <div className="planet-tooltip">Data &amp; Storage</div>
        </Html>
      )}
    </group>
  );
}
