import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { SatelliteDef, Selection } from '../data/planetData';

const NONE = () => null;

interface Props {
  def: SatelliteDef;
  onSelect: (s: Selection) => void;
  frozen: boolean;        // pause orbit while a satellite is in focus
  focused: boolean;       // this satellite is the selected one
  dimmed: boolean;
  focusPos: React.MutableRefObject<THREE.Vector3>;
}

/** An orbiting satellite. Projects are mechanical probes; the identity is a unique glowing beacon. */
export function Satellite({ def, onSelect, frozen, focused, dimmed, focusPos }: Props) {
  const group = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.MeshStandardMaterial>(null);
  const angle = useRef(def.orbit.phase);
  const [hovered, setHovered] = useState(false);
  const isIdentity = def.content.kind === 'identity';

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (!frozen) angle.current += def.orbit.speed * delta;
    const a = angle.current;
    const r = def.orbit.radius;
    // circle in XZ, tilt the plane about X (inclination), then rotate it about Y (node)
    const x0 = Math.cos(a) * r;
    const z1 = Math.sin(a) * r;
    const inc = def.orbit.inclination;
    const y = -z1 * Math.sin(inc);
    const z0 = z1 * Math.cos(inc);
    const node = def.orbit.node ?? 0;
    const cn = Math.cos(node);
    const sn = Math.sin(node);
    g.position.set(x0 * cn + z0 * sn, y, -x0 * sn + z0 * cn);

    if (spinner.current) spinner.current.rotation.y += delta * (isIdentity ? 0.8 : 0.4);
    if (focused) focusPos.current.copy(g.position);

    // identity beacon pulses + counter-rotating halo
    if (isIdentity) {
      const t = state.clock.elapsedTime;
      if (core.current) core.current.emissiveIntensity = 1.1 + Math.sin(t * 2.5) * 0.5;
      if (halo.current) halo.current.rotation.z += delta * 0.6;
    }

    const target = hovered || focused ? 1.3 : 1;
    const s = g.scale.x;
    g.scale.setScalar(s + (target - s) * Math.min(1, delta * 8));
  });

  const opacity = dimmed ? 0.3 : 1;

  return (
    <group ref={group}>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect(def.content);
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
        {isIdentity ? (
          // ---- unique identity beacon: glowing gold core + orbiting halo ring + spikes ----
          <group ref={spinner}>
            <mesh castShadow>
              <octahedronGeometry args={[0.13, 0]} />
              <meshStandardMaterial
                ref={core}
                color="#fff4cf"
                emissive="#ffc23a"
                emissiveIntensity={1.3}
                metalness={0.4}
                roughness={0.25}
                toneMapped={false}
                transparent
                opacity={opacity}
              />
            </mesh>
            {/* soft outer glow shell */}
            <mesh raycast={NONE} scale={1.55}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshBasicMaterial color="#ffd970" transparent opacity={dimmed ? 0.05 : 0.14} />
            </mesh>
            {/* halo ring */}
            <mesh ref={halo} rotation={[Math.PI / 2.2, 0, 0]} raycast={NONE}>
              <torusGeometry args={[0.2, 0.012, 10, 40]} />
              <meshStandardMaterial color="#ffe49a" emissive="#ffb02a" emissiveIntensity={0.8} metalness={0.6} roughness={0.3} toneMapped={false} transparent opacity={opacity} />
            </mesh>
          </group>
        ) : (
          // ---- project probe: body + solar arrays on booms + dish ----
          <group ref={spinner}>
            <mesh castShadow>
              <boxGeometry args={[0.1, 0.09, 0.1]} />
              <meshStandardMaterial color={def.color} metalness={0.4} roughness={0.5} transparent opacity={opacity} />
            </mesh>
            {[-1, 1].map((s) => (
              <group key={s}>
                {/* boom */}
                <mesh position={[s * 0.085, 0, 0]} raycast={NONE}>
                  <boxGeometry args={[0.06, 0.006, 0.006]} />
                  <meshStandardMaterial color="#aab0c4" metalness={0.5} roughness={0.4} transparent opacity={opacity} />
                </mesh>
                {/* solar array */}
                <mesh position={[s * 0.17, 0, 0]} castShadow>
                  <boxGeometry args={[0.1, 0.004, 0.075]} />
                  <meshStandardMaterial color="#3550a0" emissive="#16205a" emissiveIntensity={dimmed ? 0.1 : 0.4} metalness={0.4} roughness={0.35} transparent opacity={opacity} />
                </mesh>
              </group>
            ))}
            {/* dish on a short mast — a clean upward-facing bowl */}
            <mesh position={[0, 0.07, 0]} raycast={NONE}>
              <cylinderGeometry args={[0.004, 0.004, 0.04, 6]} />
              <meshStandardMaterial color="#cdd2e0" metalness={0.6} roughness={0.4} transparent opacity={opacity} />
            </mesh>
            <mesh position={[0, 0.095, 0]} rotation={[Math.PI, 0, 0]} castShadow>
              <coneGeometry args={[0.045, 0.026, 18]} />
              <meshStandardMaterial color="#f0ead8" roughness={0.7} metalness={0.2} transparent opacity={opacity} />
            </mesh>
            <mesh position={[0, 0.1, 0]} raycast={NONE}>
              <sphereGeometry args={[0.006, 8, 8]} />
              <meshStandardMaterial color="#c8c2aa" roughness={0.7} transparent opacity={opacity} />
            </mesh>
          </group>
        )}

        {(hovered || focused) && (
          <Html center distanceFactor={3.6} position={[0, isIdentity ? 0.3 : 0.22, 0]} style={{ pointerEvents: 'none' }}>
            <div className="planet-tooltip">{def.content.name}</div>
          </Html>
        )}
      </group>
    </group>
  );
}
