import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeVertices } from 'three-stdlib';

const PLANET_RADIUS = 1;
const NO_RAYCAST = () => null;

/**
 * Clay ocean planet — faceted dark-blue water with animated waves and a soft
 * atmosphere halo. Decorative only; never absorbs pointer events.
 */
export function PlanetBody() {
  const meshRef = useRef<THREE.Mesh>(null);

  // store the rest (unit) positions so we can re-derive waves every frame
  const { geometry, base } = useMemo(() => {
    // weld duplicate vertices → indexed geometry → smooth (averaged) normals
    const geo = mergeVertices(new THREE.IcosahedronGeometry(PLANET_RADIUS, 12));
    const base = (geo.attributes.position as THREE.BufferAttribute).clone();
    return { geometry: geo, base };
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const pos = mesh.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const bx = base.getX(i);
      const by = base.getY(i);
      const bz = base.getZ(i);
      const w =
        Math.sin(bx * 6 + t * 1.3) * 0.5 +
        Math.sin(by * 7 - t * 1.1) * 0.5 +
        Math.sin(bz * 5 + t * 1.7) * 0.4 +
        Math.sin((bx + bz) * 9 + t * 2.0) * 0.3;
      const s = 1 + w * 0.014;
      pos.setXYZ(i, bx * s, by * s, bz * s);
    }
    pos.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  });

  return (
    <group>
      {/* animated faceted ocean */}
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow raycast={NO_RAYCAST}>
        <meshStandardMaterial color="#2a62d8" roughness={0.4} metalness={0.15} />
      </mesh>
      {/* darker deep-water core for depth toward the limb */}
      <mesh scale={0.965} raycast={NO_RAYCAST}>
        <sphereGeometry args={[PLANET_RADIUS, 32, 32]} />
        <meshStandardMaterial color="#173a8f" roughness={1} />
      </mesh>
    </group>
  );
}
