import * as THREE from 'three';

/** Convert lat/lng (degrees) on a sphere of given radius to a 3D position. */
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/** Quaternion that orients an object's +Y axis along the surface normal at a point. */
export function orientToNormal(position: THREE.Vector3): THREE.Quaternion {
  const up = new THREE.Vector3(0, 1, 0);
  const normal = position.clone().normalize();
  return new THREE.Quaternion().setFromUnitVectors(up, normal);
}

/**
 * Orientation that tilts local +Y toward the surface normal for a point offset
 * (x,z) from an island centre on a sphere of radius R — keeps objects flush.
 */
export function surfaceTilt(x: number, z: number, R = 1): THREE.Quaternion {
  const rho = Math.hypot(x, z);
  if (rho < 1e-4) return new THREE.Quaternion();
  const axis = new THREE.Vector3(z, 0, -x).normalize();
  return new THREE.Quaternion().setFromAxisAngle(axis, rho / R);
}

/** Small deterministic PRNG so island shapes are stable across renders. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build an irregular (non-circular) island landmass: a jagged polygon extruded
 * to a small height, oriented so it sits flat on the sphere with +Y pointing
 * outward. Base at local y=0, rising upward.
 */
export function makeIslandGeometry(size: number, seed: number): THREE.ExtrudeGeometry {
  const rng = mulberry32(seed);
  const N = 16;
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const r = size * (0.58 + rng() * 0.55); // irregular coastline
    pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
  }
  const shape = new THREE.Shape(pts);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: size * 0.16,
    bevelEnabled: true,
    bevelThickness: size * 0.06,
    bevelSize: size * 0.08,
    bevelSegments: 2,
    steps: 1,
  });
  geo.rotateX(-Math.PI / 2); // footprint onto XZ plane, height along +Y
  geo.computeVertexNormals();
  return geo;
}

/**
 * Smooth, irregular island coastline as unit-scale 2D points. A handful of
 * random control radii are run through a closed Catmull-Rom curve so the
 * outline is wavy and natural — never a circle.
 */
export function islandOutline(seed: number, ctrl = 9, samples = 54): THREE.Vector2[] {
  const rng = mulberry32(seed);
  const control: THREE.Vector3[] = [];
  for (let i = 0; i < ctrl; i++) {
    const a = (i / ctrl) * Math.PI * 2;
    const r = 0.45 + rng() * 0.8; // strong radius variation → lobed coast
    control.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
  }
  const curve = new THREE.CatmullRomCurve3(control, true, 'catmullrom', 0.5);
  return curve.getPoints(samples).map((p) => new THREE.Vector2(p.x, p.y));
}

/**
 * Extrude a coastline outline into a slab. `pad` pushes every point outward
 * along its radial so a beach band can run parallel to the land's coast.
 */
export function extrudeOutline(
  outline: THREE.Vector2[],
  size: number,
  pad: number,
  depth: number,
  bevel: number,
  curveR = 0
): THREE.ExtrudeGeometry {
  const pts = outline.map((p) => {
    const q = p.clone().multiplyScalar(size);
    if (pad) q.add(p.clone().normalize().multiplyScalar(pad));
    return q;
  });
  const shape = new THREE.Shape(pts);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    steps: 2,
    curveSegments: 16,
  });
  geo.rotateX(-Math.PI / 2); // footprint on XZ, thickness along +Y

  // Bend the slab onto the planet so its underside follows the curvature
  // instead of floating off a flat tangent plane.
  if (curveR > 0) {
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const rho2 = v.x * v.x + v.z * v.z;
      const drop = curveR - Math.sqrt(Math.max(0, curveR * curveR - rho2));
      v.y -= drop;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

const smooth = (u: number) => u * u * (3 - 2 * u);

/** Land-surface height (above the sphere) at a normalized profile param t. */
export function islandHeightAt(t: number, baseH: number): number {
  const plateau = 0.7;
  if (t <= plateau) return baseH * (1 - 0.14 * (t / plateau)); // gentle dome
  if (t <= 1) return THREE.MathUtils.lerp(baseH * 0.86, 0.012, smooth((t - plateau) / (1 - plateau)));
  return THREE.MathUtils.lerp(0.012, -0.035, smooth(Math.min(1, (t - 1) / 0.18)));
}

/**
 * A single island surface that slopes from a domed land plateau, down through a
 * sandy beach, and feathers below the waterline — curved onto the planet so the
 * edges blend into the sphere. Carries vertex colors (land → sand).
 */
export function buildIslandGeometry(
  outline: THREE.Vector2[],
  size: number,
  baseH: number,
  landColor: string,
  sandColor: string,
  curveR = 1
): THREE.BufferGeometry {
  const S = outline.length;
  const RINGS = 22;
  const T_MAX = 1.18;
  const land = new THREE.Color(landColor);
  const sand = new THREE.Color(sandColor);
  const plateau = 0.7;

  const positions: number[] = [];
  const colors: number[] = [];

  for (let i = 0; i < RINGS; i++) {
    const t = (i / (RINGS - 1)) * T_MAX;
    for (let j = 0; j < S; j++) {
      const p = outline[j];
      const ur = p.length() || 1;
      const dx = p.x / ur;
      const dy = p.y / ur;
      const radius = ur * size * t;
      const x = dx * radius;
      const z = dy * radius;

      const h = islandHeightAt(t, baseH);
      const rho2 = x * x + z * z;
      const drop = curveR - Math.sqrt(Math.max(0, curveR * curveR - rho2));
      positions.push(x, h - drop, z);

      let c: THREE.Color;
      if (t <= plateau) c = land;
      else if (t <= 1) c = land.clone().lerp(sand, smooth((t - plateau) / (1 - plateau)));
      else c = sand;
      colors.push(c.r, c.g, c.b);
    }
  }

  const idx: number[] = [];
  for (let i = 0; i < RINGS - 1; i++) {
    for (let j = 0; j < S; j++) {
      const a = i * S + j;
      const b = i * S + ((j + 1) % S);
      const c = (i + 1) * S + j;
      const d = (i + 1) * S + ((j + 1) % S);
      // wind CCW as seen from +Y so face normals point up (out of the planet)
      idx.push(a, b, c, b, d, c);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setIndex(idx);
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

/** Scatter points within a radius on the local XZ plane (for trees on an island). */
export function scatterOnIsland(
  count: number,
  maxRadius: number,
  seed: number
): { x: number; z: number }[] {
  const rng = mulberry32(seed * 7 + 3);
  const out: { x: number; z: number }[] = [];
  for (let i = 0; i < count; i++) {
    const a = rng() * Math.PI * 2;
    const r = Math.sqrt(rng()) * maxRadius * 0.7;
    out.push({ x: Math.cos(a) * r, z: Math.sin(a) * r });
  }
  return out;
}
