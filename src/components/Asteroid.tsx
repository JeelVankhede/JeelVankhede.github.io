import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { mulberry32 } from './planetMath';
import type { AsteroidDef, Selection } from '../data/planetData';

interface Props {
  def: AsteroidDef;
  onSelect: (s: Selection) => void;
  frozen: boolean;
  focused: boolean;
  dimmed: boolean;
  focusPos: React.MutableRefObject<THREE.Vector3>;
}

/** A clay stat asteroid that orbits in a belt and selects like a tree. */
export function Asteroid({ def, onSelect, frozen, focused, dimmed, focusPos }: Props) {
  const group = useRef<THREE.Group>(null);
  const angle = useRef(def.orbit.phase);
  const [hovered, setHovered] = useState(false);

  // a craggy, uneven solid clay rock with a random clay color (per seed)
  const { geometry, color } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.15, 12);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    const s = def.seed * 0.7;

    // a few craters at random surface directions (deterministic per seed)
    const crng = mulberry32(def.seed * 3 + 7);
    const craters = Array.from({ length: 5 }, () => {
      const u = crng() * 2 - 1;
      const th = crng() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      return {
        dir: new THREE.Vector3(r * Math.cos(th), u, r * Math.sin(th)),
        rad: 0.3 + crng() * 0.35,
        depth: 0.05 + crng() * 0.05,
      };
    });

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const d = v.clone().normalize();
      // displacement is a continuous function of DIRECTION only, so the
      // duplicated corner vertices of this non-indexed mesh stay welded.
      // only broad low-frequency lobes → a smooth, rounded clay boulder.
      const lump =
        Math.sin(d.x * 1.9 + s) * 0.13 +
        Math.cos(d.y * 2.2 + s * 1.3) * 0.11 +
        Math.sin(d.z * 2.5 + s * 0.7) * 0.1 +
        Math.sin(d.x * 3.3 + d.y * 2.6 + s) * 0.05;

      // carve craters: smooth concave bowls (zero slope at the rim → no crease)
      let delta = 0;
      for (const cr of craters) {
        const ang = d.angleTo(cr.dir);
        if (ang < cr.rad) {
          const f = ang / cr.rad; // 0 = centre, 1 = edge
          const k = 1 - f * f;
          const dd = -cr.depth * k * k; // deepest at centre, smooth to 0 at edge
          if (dd < delta) delta = dd;
        }
      }

      v.multiplyScalar(1 + lump + delta);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals(); // smooth normals → detailed clay, not facets
    const cRng = mulberry32(def.seed * 9 + 5);
    const col = new THREE.Color().setHSL(cRng(), 0.4 + cRng() * 0.25, 0.5 + cRng() * 0.18);
    return { geometry: geo, color: col };
  }, [def.seed]);

  // random tumbling spin (per asteroid, deterministic from seed)
  const spin = useMemo(() => {
    const r = mulberry32(def.seed * 5 + 1);
    return { x: (r() - 0.5) * 1.5, y: (r() - 0.5) * 1.5, z: (r() - 0.5) * 1.5 };
  }, [def.seed]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    if (!frozen) angle.current += def.orbit.speed * delta;
    const a = angle.current;
    const r = def.orbit.radius;
    // circle in XZ, tilt about X (inclination), rotate plane about Y (node)
    const x0 = Math.cos(a) * r;
    const z1 = Math.sin(a) * r;
    const inc = def.orbit.inclination;
    const y = -z1 * Math.sin(inc);
    const z0 = z1 * Math.cos(inc);
    const node = def.orbit.node ?? 0;
    const cn = Math.cos(node);
    const sn = Math.sin(node);
    g.position.set(x0 * cn + z0 * sn, y, -x0 * sn + z0 * cn);
    // random tumble
    g.rotation.x += delta * spin.x;
    g.rotation.y += delta * spin.y;
    g.rotation.z += delta * spin.z;

    if (focused) focusPos.current.copy(g.position);

    const target = hovered || focused ? 1.45 : 1;
    const s = g.scale.x;
    g.scale.setScalar(s + (target - s) * Math.min(1, delta * 8));
  });

  const opacity = dimmed ? 0.3 : 1;

  return (
    <group ref={group}>
      <mesh
        geometry={geometry}
        castShadow
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
        <meshStandardMaterial color={color} roughness={1} metalness={0} transparent opacity={opacity} />
      </mesh>
      {(hovered || focused) && (
        <Html center distanceFactor={3.4} position={[0, 0.22, 0]} style={{ pointerEvents: 'none' }}>
          <div className="planet-tooltip">{def.content.value} · {def.content.label}</div>
        </Html>
      )}
    </group>
  );
}
