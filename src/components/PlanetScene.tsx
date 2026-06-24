import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetBody } from './Planet';
import { Island } from './Island';
import { Beacon } from './Beacon';
import { Satellite } from './Satellite';
import { Asteroid } from './Asteroid';
import { Rocket, Cloud } from './SurfaceObjects';
import {
  islands,
  rockets,
  cloudPuffs,
  cloudSkill,
  identitySatellite,
  projectSatellites,
  statAsteroids,
  contactBeacon,
} from '../data/planetData';
import type { Selection } from '../data/planetData';
import { latLngToVector3 } from './planetMath';

const BG_FROM = new THREE.Color('#000000');
const BG_TO = new THREE.Color('#070512'); // darker space tone for depth
const FOV = 42;
const V_HALF_TAN = Math.tan((FOV * Math.PI) / 180 / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const FRONT = new THREE.Vector3(0, 0, 1);

function baseDistance(width: number, height: number): number {
  const aspect = width / Math.max(1, height);
  const frac = width < 768 ? 0.75 : 0.34;
  const d = 1 / (frac * V_HALF_TAN * aspect);
  return Math.min(Math.max(d, 2.6), 11);
}

/** Resolve the surface direction (unit vector) for a selectable surface entity. */
function surfaceDirFor(sel: Selection | null): THREE.Vector3 | null {
  if (!sel) return null;
  if (sel.kind === 'skill') {
    const isl = islands.find((i) => i.skill.id === sel.id || i.chests?.id === sel.id);
    if (isl) return latLngToVector3(isl.lat, isl.lng, 1).normalize();
    if (sel.id === 'cloud') return latLngToVector3(cloudPuffs[0].lat, cloudPuffs[0].lng, 1).normalize();
    return null;
  }
  if (sel.kind === 'experience') {
    const isl = islands.find((i) => i.building?.id === sel.id);
    return isl ? latLngToVector3(isl.lat, isl.lng, 1).normalize() : null;
  }
  if (sel.kind === 'contact') {
    return latLngToVector3(contactBeacon.lat, contactBeacon.lng, 1).normalize();
  }
  return null; // project / identity are orbiting
}

interface SceneProps {
  selected: Selection | null;
  onSelect: (s: Selection | null) => void;
  started?: boolean; // intro greeting finished → begin the planet reveal
}

// ---------- distant blurred planets in the background ----------
// spread all around the scene so they're visible from any orbit angle
const DISTANT_PLANETS: { pos: [number, number, number]; r: number; color: string; glow: string; ring?: boolean }[] = [
  { pos: [-15, 7, -13], r: 2.4, color: '#3b2f6e', glow: '#6b58c0' },
  { pos: [17, -6, -10], r: 3.0, color: '#243e72', glow: '#3f63a8', ring: true },
  { pos: [7, 11, 16], r: 1.7, color: '#5a2f57', glow: '#9a5586' },
  { pos: [-13, -8, 15], r: 2.1, color: '#2f5a55', glow: '#4f9a8a' },
  { pos: [18, 5, 7], r: 2.0, color: '#46306a', glow: '#7a5ec0' },
  { pos: [-9, 10, 19], r: 1.6, color: '#34506e', glow: '#5a86b0' },
];

function Background() {
  return (
    <group>
      {DISTANT_PLANETS.map((p, i) => (
        <group key={i} position={p.pos}>
          {/* soft glow shell */}
          <mesh raycast={() => null} scale={1.3}>
            <sphereGeometry args={[p.r, 24, 24]} />
            <meshBasicMaterial color={p.glow} transparent opacity={0.22} />
          </mesh>
          <mesh raycast={() => null}>
            <sphereGeometry args={[p.r, 32, 32]} />
            <meshStandardMaterial color={p.color} emissive={p.glow} emissiveIntensity={0.5} roughness={1} />
          </mesh>
          {p.ring && (
            <mesh rotation={[1.2, 0.3, 0]} raycast={() => null}>
              <torusGeometry args={[p.r * 1.5, p.r * 0.06, 12, 48]} />
              <meshStandardMaterial color={p.glow} emissive={p.glow} emissiveIntensity={0.3} transparent opacity={0.5} roughness={1} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// ---------- decorative birds for life ----------
const BIRD_COLORS = ['#d8d8e0', '#ecc25e', '#e8964a', '#a6acba', '#f2f2f7', '#c98a52'];
const BIRD_COUNT = 6;
const FWD = new THREE.Vector3(0, 0, 1);

// a swept wing silhouette (root at x=0, extends +X) with a little thickness so
// it stays visible edge-on, laid flat in the XZ plane.
const WING_GEO = (() => {
  const s = new THREE.Shape();
  s.moveTo(0, 0.032);      // leading edge at the body
  s.lineTo(0.1, 0.022);    // leading edge sweeping out
  s.lineTo(0.175, -0.004); // pointed tip, swept back
  s.lineTo(0.085, -0.05);  // trailing edge curve
  s.lineTo(0, -0.026);     // trailing edge at the body
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false });
  g.translate(0, 0, -0.006); // center the thickness
  g.rotateX(-Math.PI / 2); // lay flat (span +X, chord Z, thickness Y)
  g.computeVertexNormals();
  return g;
})();

// a closed flight path that threads just above every island, so birds
// continuously travel from one island to the next.
function useBirdPath() {
  return useMemo(() => {
    const pts = islands.map((i) => latLngToVector3(i.lat, i.lng, 1.16));
    return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.4);
  }, []);
}

function Bird({ index, path }: { index: number; path: THREE.CatmullRomCurve3 }) {
  const group = useRef<THREE.Group>(null);
  const leftWing = useRef<THREE.Group>(null);
  const rightWing = useRef<THREE.Group>(null);
  const color = BIRD_COLORS[index % BIRD_COLORS.length];
  const speed = 0.012 + (index % 3) * 0.004;
  const phase = index / BIRD_COUNT;
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const u = (t * speed + phase) % 1;
    path.getPointAt(u, g.position);
    // small vertical wobble along the local radial
    tmp.copy(g.position).normalize();
    g.position.addScaledVector(tmp, Math.sin(t * 2 + index) * 0.015);
    // face travel direction
    path.getTangentAt(u, tmp).normalize();
    quat.setFromUnitVectors(FWD, tmp);
    g.quaternion.copy(quat);
    // both wings share the same flap angle; the left group is mirrored in X
    // so they beat symmetrically. Resting dihedral + a wide sweep.
    const flap = 0.45 + Math.sin(t * 10 + index) * 0.8;
    if (leftWing.current) leftWing.current.rotation.z = flap;
    if (rightWing.current) rightWing.current.rotation.z = flap;
  });

  return (
    <group ref={group} scale={0.22}>
      {/* body points forward (+Z); wings extend sideways (±X) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <capsuleGeometry args={[0.013, 0.06, 4, 8]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <group ref={rightWing} raycast={() => null}>
        <mesh geometry={WING_GEO} raycast={() => null}>
          <meshStandardMaterial color={color} roughness={1} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={leftWing} scale={[-1, 1, 1]} raycast={() => null}>
        <mesh geometry={WING_GEO} raycast={() => null}>
          <meshStandardMaterial color={color} roughness={1} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

function Birds() {
  const path = useBirdPath();
  return (
    <>
      {Array.from({ length: BIRD_COUNT }, (_, i) => (
        <Bird key={i} index={i} path={path} />
      ))}
    </>
  );
}

interface RigProps {
  sceneRef: React.RefObject<THREE.Group | null>;
  planetRef: React.RefObject<THREE.Group | null>;
  controlsRef: React.RefObject<any>;
  ready: boolean;
  focusDir: THREE.Vector3 | null;     // surface focus
  orbitFocus: boolean;                // satellite focus
  focusPos: React.MutableRefObject<THREE.Vector3>;
}

function Rig({ sceneRef, planetRef, controlsRef, ready, focusDir, orbitFocus, focusPos }: RigProps) {
  const { scene, camera, size } = useThree();
  const introT = useRef(0);
  const targetQuat = useMemo(() => new THREE.Quaternion(), []);
  const identity = useMemo(() => new THREE.Quaternion(), []);

  useEffect(() => {
    const d = baseDistance(size.width, size.height);
    if (introT.current < 1) camera.position.set(0, 0.15, d * 1.5);
  }, [size.width, size.height, camera]);

  useFrame((_, delta) => {
    const bg = scene.background as THREE.Color | null;
    const base = baseDistance(size.width, size.height);
    const controls = controlsRef.current;

    // --- gated intro: only zoom in once everything is rendered ---
    if (introT.current < 1) {
      if (controls) controls.enabled = false;
      if (ready) {
        introT.current = Math.min(1, introT.current + delta / 2.4);
        const e = easeOutCubic(introT.current);
        if (bg) bg.copy(BG_FROM).lerp(BG_TO, e);
        if (sceneRef.current) sceneRef.current.scale.setScalar(0.001 + e * 0.999);
        const z = base * 1.5 - (base * 0.5) * e;
        camera.position.set(0, 0.15, z);
        camera.lookAt(0, 0, 0);
      }
      return;
    }

    const focusing = !!focusDir || orbitFocus;
    if (controls) controls.enabled = !focusing;

    if (focusDir) {
      // surface: rotate planet to face the point, dolly to front
      targetQuat.setFromUnitVectors(focusDir, FRONT);
      if (planetRef.current) planetRef.current.quaternion.slerp(targetQuat, Math.min(1, delta * 4));
      const desired = new THREE.Vector3(0, 0.15, base * 0.62);
      camera.position.lerp(desired, Math.min(1, delta * 3));
      camera.lookAt(0, 0, 0);
    } else if (orbitFocus) {
      // satellite: zoom the camera out to the satellite, framing planet behind
      const fp = focusPos.current;
      const dir = fp.clone().normalize();
      const desired = fp.clone().add(dir.multiplyScalar(1.5));
      camera.position.lerp(desired, Math.min(1, delta * 3));
      camera.lookAt(fp);
      if (planetRef.current) planetRef.current.quaternion.slerp(identity, Math.min(1, delta * 3));
    } else {
      // neutral: ease the planet back to rest; OrbitControls owns the camera
      if (planetRef.current) planetRef.current.quaternion.slerp(identity, Math.min(1, delta * 3));
    }
  });

  return null;
}

function Scene({ selected, onSelect, started = true }: SceneProps) {
  const sceneRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);
  const focusPos = useRef(new THREE.Vector3(0, 0, 2));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // everything is mounted synchronously; flip ready next frame so the
    // intro zoom only plays once the scene has actually rendered.
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  const focusDir = useMemo(() => surfaceDirFor(selected), [selected]);
  const orbitFocus =
    selected?.kind === 'project' || selected?.kind === 'identity' || selected?.kind === 'stat';
  const frozen = selected !== null;

  const selId = (() => {
    if (!selected) return null;
    if (
      selected.kind === 'skill' ||
      selected.kind === 'experience' ||
      selected.kind === 'project' ||
      selected.kind === 'stat'
    )
      return selected.id;
    return selected.kind;
  })();

  return (
    <>
      <color attach="background" args={['#000000']} />
      {/* light fog for depth, but far enough that distant planets stay visible */}
      <fog attach="fog" args={['#070512', 11, 36]} />

      <hemisphereLight args={['#cdbfff', '#3a2a66', 0.95]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 3]} intensity={2.1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-4, -1, -2]} intensity={0.5} color="#8f7bff" />

      <Stars radius={60} depth={40} count={2600} factor={3.6} saturation={0} fade speed={0.5} />
      {/* twinkling distant sparks */}
      <Sparkles count={150} scale={42} size={4} speed={0.3} noise={1.2} color="#fff3d0" opacity={0.8} />
      <Background />

      <group ref={sceneRef} scale={0.001}>
        {/* planet + everything anchored to its surface (rotates on surface focus) */}
        <group ref={planetRef}>
          <PlanetBody />
          {islands.map((isl) => (
            <Island key={isl.skill.id} def={isl} onSelect={onSelect} selectedId={selId} dimmed={frozen && selId !== isl.skill.id && selId !== isl.building?.id && selId !== isl.chests?.id} />
          ))}
          <Beacon onSelect={onSelect} selected={selId === 'contact'} dimmed={frozen && selId !== 'contact'} />
          {rockets.map((r) => (
            <Rocket key={r.id} rocket={r} />
          ))}
          {cloudPuffs.map((c, i) => (
            <Cloud
              key={i}
              puff={c}
              content={cloudSkill}
              label={cloudSkill.tags[i % cloudSkill.tags.length]}
              onSelect={onSelect}
              selected={selId === 'cloud'}
              dimmed={frozen && selId !== 'cloud'}
            />
          ))}
        </group>

        {/* orbiters live outside the planet group so surface-focus doesn't move them */}
        <group>
          <Satellite def={identitySatellite} onSelect={onSelect} frozen={frozen} focused={selId === 'identity'} dimmed={frozen && selId !== 'identity'} focusPos={focusPos} />
          {projectSatellites.map((s) => (
            <Satellite key={s.id} def={s} onSelect={onSelect} frozen={frozen} focused={selId === s.id} dimmed={frozen && selId !== s.id} focusPos={focusPos} />
          ))}
          {statAsteroids.map((a) => (
            <Asteroid key={a.id} def={a} onSelect={onSelect} frozen={frozen} focused={selId === a.id} dimmed={frozen && selId !== a.id} focusPos={focusPos} />
          ))}
          {/* birds disabled for now — needs more work */}
          {/* <Birds /> */}
        </group>
      </group>

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom
        minDistance={2.2}
        maxDistance={12}
        autoRotate={!selected}
        autoRotateSpeed={0.35}
        rotateSpeed={0.6}
        dampingFactor={0.08}
      />

      <Rig
        sceneRef={sceneRef}
        planetRef={planetRef}
        controlsRef={controlsRef}
        ready={ready && started}
        focusDir={focusDir}
        orbitFocus={orbitFocus}
        focusPos={focusPos}
      />
    </>
  );
}

export function PlanetScene({ selected, onSelect, started }: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: FOV, position: [0, 0.15, 7], near: 0.1, far: 100 }}
      gl={{ antialias: true }}
      style={{ position: 'absolute', inset: 0 }}
      onPointerMissed={() => onSelect(null)}
    >
      <Scene selected={selected} onSelect={onSelect} started={started} />
    </Canvas>
  );
}
