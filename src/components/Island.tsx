import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  latLngToVector3,
  orientToNormal,
  islandOutline,
  buildIslandGeometry,
  islandHeightAt,
  surfaceTilt,
  mulberry32,
} from './planetMath';
import { Building } from './Building';
import { Chests } from './Chests';
import type { IslandDef, Selection } from '../data/planetData';

const PLANET_RADIUS = 1;
const NONE = () => null;

function shadeColor(hex: string, amt: number): string {
  const c = new THREE.Color(hex);
  c.offsetHSL(0, 0, amt);
  return `#${c.getHexString()}`;
}

type TreeKind = 'round' | 'pine' | 'baobab';

const TRUNK = '#9c6b43';
const trunkMat = (k = 1) => (
  <meshStandardMaterial color={shadeColor(TRUNK, (k - 1) * 0.04)} roughness={1} />
);

/** Smooth clay trees in several species. Trunk base sits at local y=0 (on the land). */
function ClayTree({
  position,
  color,
  phase,
  scale,
  kind,
}: {
  position: [number, number, number];
  color: string;
  phase: number;
  scale: number;
  kind: TreeKind;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.1 + phase) * (0.05 / scale);
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {kind === 'round' && (
        <>
          <mesh position={[0, 0.05, 0]} raycast={NONE} castShadow>
            <cylinderGeometry args={[0.012, 0.02, 0.1, 10]} />
            {trunkMat()}
          </mesh>
          <mesh position={[0, 0.15, 0]} raycast={NONE} castShadow>
            <sphereGeometry args={[0.066, 16, 12]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
          <mesh position={[0.04, 0.115, 0.025]} raycast={NONE} castShadow>
            <sphereGeometry args={[0.044, 16, 12]} />
            <meshStandardMaterial color={shadeColor(color, -0.05)} roughness={0.9} />
          </mesh>
          <mesh position={[-0.04, 0.125, -0.02]} raycast={NONE} castShadow>
            <sphereGeometry args={[0.038, 16, 12]} />
            <meshStandardMaterial color={shadeColor(color, 0.05)} roughness={0.9} />
          </mesh>
        </>
      )}

      {kind === 'pine' && (
        <>
          <mesh position={[0, 0.06, 0]} raycast={NONE} castShadow>
            <cylinderGeometry args={[0.011, 0.018, 0.12, 10]} />
            {trunkMat()}
          </mesh>
          {[0.13, 0.18, 0.225].map((y, i) => (
            <mesh key={i} position={[0, y, 0]} raycast={NONE} castShadow>
              <coneGeometry args={[0.075 - i * 0.018, 0.075, 16]} />
              <meshStandardMaterial color={shadeColor(color, -0.02 + i * 0.02)} roughness={0.9} />
            </mesh>
          ))}
        </>
      )}

      {kind === 'baobab' && (
        <>
          {/* fat tapering trunk */}
          <mesh position={[0, 0.07, 0]} raycast={NONE} castShadow>
            <cylinderGeometry args={[0.022, 0.05, 0.14, 12]} />
            {trunkMat()}
          </mesh>
          {/* wide flattened canopy */}
          <mesh position={[0, 0.17, 0]} scale={[1, 0.5, 1]} raycast={NONE} castShadow>
            <sphereGeometry args={[0.105, 18, 12]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
          <mesh position={[0.06, 0.15, 0.03]} scale={[1, 0.55, 1]} raycast={NONE} castShadow>
            <sphereGeometry args={[0.05, 14, 10]} />
            <meshStandardMaterial color={shadeColor(color, 0.05)} roughness={0.9} />
          </mesh>
        </>
      )}
    </group>
  );
}

interface Props {
  def: IslandDef;
  onSelect: (s: Selection) => void;
  selectedId: string | null;
  dimmed: boolean;
}

export function Island({ def, onSelect, selectedId, dimmed }: Props) {
  const [hovered, setHovered] = useState(false);

  const BASE_H = def.size * 0.2;

  const outline = useMemo(() => islandOutline(def.seed), [def.seed]);
  const islandGeo = useMemo(
    () => buildIslandGeometry(outline, def.size, BASE_H, def.land, '#ecd9a6', PLANET_RADIUS),
    [outline, def.size, BASE_H, def.land]
  );

  const { position, quaternion } = useMemo(() => {
    const pos = latLngToVector3(def.lat, def.lng, PLANET_RADIUS);
    return { position: pos, quaternion: orientToNormal(pos) };
  }, [def.lat, def.lng]);

  // coastline radius (unit) as a function of direction angle — the island is
  // irregular, so this varies and is what determines the true land height.
  const radial = useMemo(() => {
    const pts = outline.map((p) => ({ a: Math.atan2(p.y, p.x), r: p.length() }));
    return pts.sort((u, v) => u.a - v.a);
  }, [outline]);
  const urAt = (angle: number) => {
    const a = Math.atan2(Math.sin(angle), Math.cos(angle));
    const pts = radial;
    for (let i = 0; i < pts.length; i++) {
      const p0 = pts[i];
      const p1 = pts[(i + 1) % pts.length];
      let a1 = p1.a;
      let aa = a;
      if (i === pts.length - 1) {
        a1 += Math.PI * 2;
        if (aa < p0.a) aa += Math.PI * 2;
      }
      if (aa >= p0.a && aa <= a1) {
        const f = a1 === p0.a ? 0 : (aa - p0.a) / (a1 - p0.a);
        return p0.r + (p1.r - p0.r) * f;
      }
    }
    return pts[0].r;
  };

  // place an object by direction angle + profile fraction t (0 = centre, 1 = coast).
  // Returns the local position resting on the sloped, curved land surface.
  const place = (angle: number, t: number) => {
    const rho = urAt(angle) * def.size * t;
    const drop = PLANET_RADIUS - Math.sqrt(Math.max(0, PLANET_RADIUS * PLANET_RADIUS - rho * rho));
    return {
      x: Math.cos(angle) * rho,
      y: islandHeightAt(t, BASE_H) - drop,
      z: Math.sin(angle) * rho,
    };
  };

  // landmarks kept on the flat plateau (low t) so they sit flush
  const bldg = place(2.5, 0.4);
  // two chests placed ~100° apart around the centre so they never collide
  const chestSpots = def.chests
    ? [place(0.4, 0.46), place(0.4 + (100 * Math.PI) / 180, 0.46)]
    : [];

  // a little jungle: trees on the plateau, no overlaps, clear of building & chests
  const trees = useMemo(() => {
    const rng = mulberry32(def.seed * 7 + 3);
    const pickKind = (): TreeKind => {
      const r = rng();
      if (r < 0.5) return 'round';
      if (r < 0.82) return 'pine';
      return 'baobab';
    };
    const hasBldg = !!def.building;
    const placed: { x: number; z: number }[] = [];
    const minGap = def.size * 0.16;       // between trees
    const chestGap = def.size * 0.24;      // around each chest
    const bldgGap = def.size * 0.26;       // around the office
    const out: { x: number; y: number; z: number; scale: number; kind: TreeKind; phase: number }[] = [];

    for (let i = 0; i < def.treeCount; i++) {
      let p: ReturnType<typeof place> | null = null;
      for (let tries = 0; tries < 30; tries++) {
        const a = rng() * Math.PI * 2;
        const t = 0.1 + Math.sqrt(rng()) * 0.44; // plateau band
        const cand = place(a, t);
        const okChest = chestSpots.every((c) => Math.hypot(cand.x - c.x, cand.z - c.z) > chestGap);
        const okBldg = !hasBldg || Math.hypot(cand.x - bldg.x, cand.z - bldg.z) > bldgGap;
        const okTrees = placed.every((q) => Math.hypot(cand.x - q.x, cand.z - q.z) > minGap);
        if (okChest && okBldg && okTrees) {
          p = cand;
          break;
        }
      }
      if (!p) continue; // no room → skip rather than overlap
      placed.push({ x: p.x, z: p.z });
      const scale = (0.6 + rng() * 0.95) * 0.9; // 10% smaller than before
      out.push({ x: p.x, y: p.y, z: p.z, scale, kind: pickKind(), phase: rng() * Math.PI * 2 });
    }
    return out.sort((u, v) => v.z - u.z);
  }, [def.treeCount, def.size, def.seed]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = selectedId === def.skill.id;
  const opacity = dimmed ? 0.32 : 1;

  return (
    <group position={position} quaternion={quaternion}>
      {/* single sloped, curved island surface (land → beach → waterline) */}
      <mesh
        geometry={islandGeo}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect(def.skill);
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
        <meshStandardMaterial vertexColors roughness={1} transparent opacity={opacity} />
      </mesh>

      {trees.map((t, i) => (
        <group key={i} position={[t.x, t.y, t.z]} quaternion={surfaceTilt(t.x, t.z)}>
          <ClayTree position={[0, 0, 0]} color={def.treeColor} phase={t.phase} scale={t.scale} kind={t.kind} />
        </group>
      ))}

      {def.building && (
        <group position={[bldg.x, bldg.y, bldg.z]} quaternion={surfaceTilt(bldg.x, bldg.z)}>
          <Building
            content={def.building}
            position={[0, 0, 0]}
            onSelect={onSelect}
            selected={selectedId === def.building.id}
            dimmed={dimmed}
          />
        </group>
      )}

      {def.chests && (
        // each chest grounds + tilts to the land it sits on
        <Chests
          content={def.chests}
          spots={chestSpots}
          onSelect={onSelect}
          selected={selectedId === def.chests.id}
        />
      )}

      {(hovered || selected) && (
        <Html center distanceFactor={3.6} position={[0, def.size * 0.6, 0]} style={{ pointerEvents: 'none' }}>
          <div className="planet-tooltip">{def.skill.title}</div>
        </Html>
      )}
    </group>
  );
}
