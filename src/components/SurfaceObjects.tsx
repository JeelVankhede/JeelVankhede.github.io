import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { latLngToVector3, orientToNormal } from './planetMath';
import { audio } from '../audio';
import type { Rocket as RocketData, CloudPuff, SkillContent, Selection } from '../data/planetData';

const PLANET_RADIUS = 1;
const NONE = () => null;

// ---------- Clay Rocket (external link) on a launch stand ----------
export function Rocket({ rocket }: { rocket: RocketData }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [launching, setLaunching] = useState(false);
  const launchT = useRef(0);

  const { position, quaternion } = useMemo(() => {
    const pos = latLngToVector3(rocket.lat, rocket.lng, PLANET_RADIUS);
    return { position: pos, quaternion: orientToNormal(pos) };
  }, [rocket.lat, rocket.lng]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const bob = Math.sin(performance.now() * 0.002 + rocket.lat) * 0.005;
    if (launching) {
      launchT.current += delta;
      groupRef.current.position.y = 0.085 + launchT.current * launchT.current * 2.2;
      if (launchT.current > 0.7) {
        window.open(rocket.href, '_blank', 'noopener');
        setLaunching(false);
        launchT.current = 0;
        groupRef.current.position.y = 0.085;
      }
    } else {
      groupRef.current.position.y = 0.085 + bob;
      const target = hovered ? 1.15 : 1;
      const s = groupRef.current.scale.x;
      groupRef.current.scale.setScalar(s + (target - s) * Math.min(1, delta * 10));
    }
  });

  return (
    <group position={position} quaternion={quaternion}>
      {/* launch stand (stays on the surface) */}
      <mesh position={[0, 0.012, 0]} raycast={NONE} castShadow>
        <cylinderGeometry args={[0.05, 0.062, 0.024, 16]} />
        <meshStandardMaterial color="#5b5b70" roughness={0.7} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={NONE}>
        <torusGeometry args={[0.05, 0.007, 8, 18]} />
        <meshStandardMaterial color="#7a7a92" roughness={0.6} metalness={0.5} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[Math.cos((i / 3) * Math.PI * 2) * 0.05, 0.03, Math.sin((i / 3) * Math.PI * 2) * 0.05]}
          rotation={[0.25, -(i / 3) * Math.PI * 2, 0]}
          raycast={NONE}
        >
          <boxGeometry args={[0.012, 0.06, 0.012]} />
          <meshStandardMaterial color="#6b6b82" roughness={0.7} metalness={0.4} />
        </mesh>
      ))}

      {/* the rocket itself (bobs / launches) */}
      <group
        ref={groupRef}
        position={[0, 0.085, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (!launching) {
            audio.sparkle();
            setLaunching(true);
          }
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
        <mesh castShadow>
          <capsuleGeometry args={[0.03, 0.08, 4, 12]} />
          <meshStandardMaterial color={rocket.bodyColor} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.085, 0]} castShadow>
          <coneGeometry args={[0.03, 0.05, 12]} />
          <meshStandardMaterial color={rocket.finColor} roughness={0.85} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 3) * Math.PI * 2) * 0.03,
              -0.05,
              Math.sin((i / 3) * Math.PI * 2) * 0.03,
            ]}
            rotation={[0, -(i / 3) * Math.PI * 2, 0.3]}
            castShadow
          >
            <boxGeometry args={[0.012, 0.04, 0.025]} />
            <meshStandardMaterial color={rocket.finColor} roughness={0.9} />
          </mesh>
        ))}
        {launching && (
          <mesh position={[0, -0.08, 0]} raycast={NONE}>
            <coneGeometry args={[0.025, 0.08, 10]} />
            <meshStandardMaterial color="#ffd27a" emissive="#ff9d3a" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        )}
        {hovered && !launching && (
          <Html center distanceFactor={3.2} position={[0, 0.2, 0]} style={{ pointerEvents: 'none' }}>
            <div className="planet-tooltip">{rocket.label} ↗</div>
          </Html>
        )}
      </group>
    </group>
  );
}

// ---------- Clouds = Cloud & DevOps (smooth + interactive) ----------
interface CloudProps {
  puff: CloudPuff;
  content: SkillContent;
  label: string; // distinct tech name shown as this cloud's tooltip
  onSelect: (s: Selection) => void;
  selected: boolean;
  dimmed: boolean;
}

export function Cloud({ puff, content, label, onSelect, selected, dimmed }: CloudProps) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const position = useMemo(
    () => latLngToVector3(puff.lat, puff.lng, PLANET_RADIUS + puff.altitude),
    [puff.lat, puff.lng, puff.altitude]
  );

  useFrame((_, delta) => {
    if (outer.current) {
      outer.current.position.y = position.y + Math.sin(performance.now() * 0.0006 + puff.lat) * 0.03;
    }
    if (inner.current) {
      const target = puff.scale * (hovered || selected ? 1.14 : 1);
      const s = inner.current.scale.x;
      inner.current.scale.setScalar(s + (target - s) * Math.min(1, delta * 10));
    }
  });

  const opacity = dimmed ? 0.4 : 0.96;
  const blobs: [number, number, number, number][] = [
    [0, 0, 0, 0.11],
    [0.11, -0.01, 0.02, 0.085],
    [-0.11, 0, -0.02, 0.08],
    [0.04, 0.055, 0, 0.082],
    [-0.05, 0.04, 0.03, 0.065],
  ];

  return (
    <group
      ref={outer}
      position={position}
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
      <group ref={inner} scale={puff.scale}>
        {blobs.map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <sphereGeometry args={[r, 18, 14]} />
            <meshStandardMaterial color="#eef0ff" roughness={1} transparent opacity={opacity} />
          </mesh>
        ))}
      </group>
      {(hovered || selected) && (
        <Html center distanceFactor={3.6} position={[0, 0.24, 0]} style={{ pointerEvents: 'none' }}>
          <div className="planet-tooltip">☁ {label}</div>
        </Html>
      )}
    </group>
  );
}
