import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { latLngToVector3, orientToNormal } from './planetMath';
import { contactBeacon } from '../data/planetData';
import type { Selection } from '../data/planetData';

const PLANET_RADIUS = 1;
const NONE = () => null;

interface Props {
  onSelect: (s: Selection) => void;
  selected: boolean;
  dimmed: boolean;
}

/** A contact beacon: an antenna emitting pulsing signal rings. */
export function Beacon({ onSelect, selected, dimmed }: Props) {
  const [hovered, setHovered] = useState(false);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const scaleRef = useRef<THREE.Group>(null);

  const pos = latLngToVector3(contactBeacon.lat, contactBeacon.lng, PLANET_RADIUS);
  const quat = orientToNormal(pos);
  const accent = contactBeacon.content.accent;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const pulse = (r: THREE.Mesh | null, offset: number) => {
      if (!r) return;
      const p = ((t + offset) % 1.6) / 1.6;
      r.scale.setScalar(0.3 + p * 1.4);
      const m = r.material as THREE.MeshBasicMaterial;
      m.opacity = (1 - p) * (dimmed ? 0.2 : 0.6);
    };
    pulse(ring1.current, 0);
    pulse(ring2.current, 0.8);
    if (scaleRef.current) {
      const target = hovered || selected ? 1.18 : 1;
      const s = scaleRef.current.scale.x;
      scaleRef.current.scale.setScalar(s + (target - s) * Math.min(1, delta * 10));
    }
  });

  const opacity = dimmed ? 0.3 : 1;

  return (
    <group position={pos} quaternion={quat}>
      <group
        ref={scaleRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(contactBeacon.content);
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
        {/* base */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.06, 12]} />
          <meshStandardMaterial color="#d8cfc0" roughness={0.9} transparent opacity={opacity} />
        </mesh>
        {/* mast */}
        <mesh position={[0, 0.13, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
          <meshStandardMaterial color="#bcb3a4" roughness={0.9} transparent opacity={opacity} />
        </mesh>
        {/* dish — clean upward-facing bowl on the mast */}
        <mesh position={[0, 0.225, 0]} rotation={[Math.PI, 0, 0]} castShadow>
          <coneGeometry args={[0.05, 0.03, 18]} />
          <meshStandardMaterial color={accent} roughness={0.7} metalness={0.2} transparent opacity={opacity} />
        </mesh>
        {/* glowing tip */}
        <mesh position={[0, 0.23, 0]} raycast={NONE}>
          <sphereGeometry args={[0.016, 8, 8]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2} toneMapped={false} />
        </mesh>

        {/* pulsing signal rings */}
        {[ring1, ring2].map((r, i) => (
          <mesh key={i} ref={r} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={NONE}>
            <ringGeometry args={[0.08, 0.095, 24]} />
            <meshBasicMaterial color={accent} transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        ))}

        {(hovered || selected) && (
          <Html center distanceFactor={3.4} position={[0, 0.36, 0]} style={{ pointerEvents: 'none' }}>
            <div className="planet-tooltip">Contact ✦</div>
          </Html>
        )}
      </group>
    </group>
  );
}
