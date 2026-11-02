"use client";

import { useFrame } from "@react-three/fiber";
import { BallCollider, CylinderCollider, RigidBody } from "@react-three/rapier";
import { useLayoutEffect, useMemo, useRef } from "react";
import {
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  Object3D,
  PlaneGeometry,
  type InstancedMesh,
  type MeshStandardMaterial,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ROAD_HALF, distanceToRoad, groundHeight, island } from "./island";
import { districts, ferris, ramp } from "./places";

function seeded(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}

/** Night factor shared with the scene's day/night rig. */
export const nightMix = { v: 0 };

/* ───────────────────────── placement ───────────────────────── */

function blocked(x: number, z: number, pad: number) {
  for (const d of districts) if (Math.hypot(x - d.x, z - d.z) < d.radius + pad) return true;
  if (Math.hypot(x - ferris.x, z - ferris.z) < 16 + pad) return true;
  if (Math.hypot(x - ramp.x, z - ramp.z) < 22 + pad) return true;
  return distanceToRoad(x, z) < ROAD_HALF + 2.5 + pad;
}

function scatter(count: number, seed: number, test: (x: number, z: number, h: number) => boolean, spacing = 0) {
  const rnd = seeded(seed);
  const out: { x: number; z: number; y: number; s: number; yaw: number; tone: number }[] = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 80) {
    const x = (rnd() - 0.5) * 380;
    const z = (rnd() - 0.5) * 380;
    const h = groundHeight(x, z);
    if (!test(x, z, h)) continue;
    if (spacing && out.some((o) => (o.x - x) ** 2 + (o.z - z) ** 2 < spacing * spacing)) continue;
    out.push({ x, z, y: h, s: 0.8 + rnd() * 0.6, yaw: rnd() * 6.28, tone: rnd() });
  }
  return out;
}

const slope = (x: number, z: number) => {
  const dx = groundHeight(x + 1, z) - groundHeight(x - 1, z);
  const dz = groundHeight(x, z + 1) - groundHeight(x, z - 1);
  return Math.hypot(dx, dz) / 2;
};

export const trees = scatter(380, 7, (x, z, h) => h > 3.2 && slope(x, z) < 0.7 && !blocked(x, z, 4), 3.4);
export const palms = scatter(70, 17, (x, z, h) => h > 1.1 && h < 3.4 && slope(x, z) < 0.35 && !blocked(x, z, 3), 5);
export const rocks = scatter(110, 99, (x, z, h) => h > 0.4 && (slope(x, z) > 0.45 || h < 1.6) && !blocked(x, z, 1), 2.5);
const tufts = scatter(1800, 31, (x, z, h) => h > 3 && slope(x, z) < 0.6 && !blocked(x, z, 0.2));
const flowers = scatter(400, 1234, (x, z, h) => h > 3 && slope(x, z) < 0.4 && !blocked(x, z, 0.5));

/** Street lamps on the outside of the loop road. */
export const lamps = (() => {
  const { road } = island();
  const out: { x: number; z: number; y: number; yaw: number }[] = [];
  let last = -Infinity;
  for (const r of road) {
    if (r.s - last < 26) continue;
    last = r.s;
    const x = r.x + r.nx * (ROAD_HALF + 1.6);
    const z = r.z + r.nz * (ROAD_HALF + 1.6);
    if (districts.some((d) => Math.hypot(x - d.x, z - d.z) < d.radius + 1)) continue;
    out.push({ x, z, y: groundHeight(x, z), yaw: Math.atan2(-r.nx, -r.nz) });
  }
  return out;
})();

/* ───────────────────────── geometry ───────────────────────── */

function merged(parts: [BufferGeometry, number, number, number, number?][]) {
  return mergeGeometries(
    parts.map(([g, x, y, z, rz]) => {
      const c = g.index ? g.toNonIndexed() : g;
      if (rz) c.rotateZ(rz);
      c.translate(x, y, z);
      return c;
    }),
  );
}

function frond() {
  // a long leaf that droops: a strip bent along its length
  const g = new PlaneGeometry(0.9, 4.2, 1, 10);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i) + 2.1;
    const t = y / 4.2;
    const x = p.getX(i) * (1 - t * 0.85);
    p.setXYZ(i, x, Math.sin(t * 1.3) * 1.4 - t * t * 2.2, y);
  }
  g.computeVertexNormals();
  return g;
}

function palmTrunk() {
  const parts: [BufferGeometry, number, number, number, number][] = [];
  for (let i = 0; i < 8; i++) {
    const g = new CylinderGeometry(0.2 - i * 0.012, 0.24 - i * 0.012, 1.05, 8);
    parts.push([g, Math.sin(i * 0.22) * 0.9, 0.5 + i, 0, -0.05 * i]);
  }
  return merged(parts);
}

function crownGeo() {
  const f = frond();
  const parts: BufferGeometry[] = [];
  for (let i = 0; i < 9; i++) {
    const c = f.clone();
    c.rotateY((i / 9) * Math.PI * 2 + (i % 2) * 0.2);
    parts.push(c);
  }
  const m = mergeGeometries(parts);
  m.translate(0.9 * Math.sin(7 * 0.22), 8.3, 0);
  return m;
}

/* ───────────────────────── instancing ───────────────────────── */

function useInstances<T>(
  ref: React.RefObject<InstancedMesh | null>,
  items: T[],
  build: (o: Object3D, item: T, i: number) => Color | void,
) {
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new Object3D();
    items.forEach((it, i) => {
      o.position.set(0, 0, 0);
      o.rotation.set(0, 0, 0);
      o.scale.set(1, 1, 1);
      const c = build(o, it, i);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      if (c) m.setColorAt(i, c);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.computeBoundingSphere();
  }, [ref, items, build]);
}

const LEAVES = ["#3f6a2c", "#4b7a31", "#557b2e", "#33602d", "#62873a"];
const PINE = ["#25462d", "#2c5233", "#203f2a"];

export function Nature() {
  const trunkRef = useRef<InstancedMesh>(null);
  const broadRef = useRef<InstancedMesh>(null);
  const pineRef = useRef<InstancedMesh>(null);
  const palmTrunkRef = useRef<InstancedMesh>(null);
  const palmCrownRef = useRef<InstancedMesh>(null);
  const rockRef = useRef<InstancedMesh>(null);
  const tuftRef = useRef<InstancedMesh>(null);
  const flowerRef = useRef<InstancedMesh>(null);
  const poleRef = useRef<InstancedMesh>(null);
  const headRef = useRef<InstancedMesh>(null);
  const bulbRef = useRef<InstancedMesh>(null);
  const bulbMat = useRef<MeshStandardMaterial>(null);

  const geos = useMemo(
    () => ({
      broad: merged([
        [new IcosahedronGeometry(1.7, 2), 0, 4.0, 0],
        [new IcosahedronGeometry(1.3, 2), 1.1, 3.4, 0.4],
        [new IcosahedronGeometry(1.25, 1), -1.0, 3.5, -0.5],
        [new IcosahedronGeometry(1.1, 1), 0.2, 5.0, -0.2],
      ]),
      pine: merged([
        [new ConeGeometry(1.7, 3, 14), 0, 2.4, 0],
        [new ConeGeometry(1.35, 2.6, 14), 0, 3.8, 0],
        [new ConeGeometry(0.95, 2.1, 14), 0, 5.1, 0],
      ]),
      palmTrunk: palmTrunk(),
      palmCrown: crownGeo(),
      tuft: merged([
        [new ConeGeometry(0.04, 0.55, 3), 0, 0.27, 0],
        [new ConeGeometry(0.04, 0.42, 3), 0.1, 0.2, 0.05, 0.2],
        [new ConeGeometry(0.04, 0.48, 3), -0.08, 0.23, -0.06, -0.2],
        [new ConeGeometry(0.04, 0.38, 3), 0.02, 0.18, 0.12, 0.1],
      ]),
    }),
    [],
  );
  // post plus an arm reaching over the road along +Z
  const poleGeo = useMemo(() => {
    const arm = new CylinderGeometry(0.04, 0.04, 1.4, 6).toNonIndexed();
    arm.rotateX(Math.PI / 2);
    arm.translate(0, 5.3, 0.65);
    const post = new CylinderGeometry(0.07, 0.11, 5.4, 10).toNonIndexed();
    post.translate(0, 2.7, 0);
    return mergeGeometries([post, arm]);
  }, []);

  const broad = useMemo(() => trees.filter((t) => t.tone > 0.35), []);
  const pines = useMemo(() => trees.filter((t) => t.tone <= 0.35), []);

  useInstances(trunkRef, trees, (o, t) => {
    o.position.set(t.x, t.y + 1.3 * t.s, t.z);
    o.scale.setScalar(t.s);
  });
  useInstances(broadRef, broad, (o, t) => {
    o.position.set(t.x, t.y, t.z);
    o.rotation.y = t.yaw;
    o.scale.setScalar(t.s);
    return new Color(LEAVES[Math.floor(((t.tone - 0.35) / 0.65) * LEAVES.length) % LEAVES.length]);
  });
  useInstances(pineRef, pines, (o, t) => {
    o.position.set(t.x, t.y, t.z);
    o.rotation.y = t.yaw;
    o.scale.set(t.s, t.s * 1.3, t.s);
    return new Color(PINE[Math.floor((t.tone / 0.35) * PINE.length) % PINE.length]);
  });
  useInstances(palmTrunkRef, palms, (o, t) => {
    o.position.set(t.x, t.y - 0.1, t.z);
    o.rotation.y = t.yaw;
    o.scale.setScalar(t.s);
  });
  useInstances(palmCrownRef, palms, (o, t) => {
    o.position.set(t.x, t.y - 0.1, t.z);
    o.rotation.y = t.yaw;
    o.scale.setScalar(t.s);
    return new Color().setHSL(0.27 + t.tone * 0.03, 0.45, 0.24 + t.tone * 0.06);
  });
  useInstances(rockRef, rocks, (o, t, i) => {
    const s = 0.5 + t.tone * 1.6;
    o.position.set(t.x, t.y + s * 0.15, t.z);
    o.rotation.set(i * 0.7, t.yaw, i * 1.3);
    o.scale.set(s * 1.2, s * 0.7, s);
    const v = 0.36 + t.tone * 0.14;
    return new Color(v, v * 0.97, v * 0.92);
  });
  useInstances(tuftRef, tufts, (o, t) => {
    o.position.set(t.x, t.y, t.z);
    o.rotation.y = t.yaw;
    o.scale.setScalar(0.7 + t.tone);
    return new Color().setHSL(0.24 + t.tone * 0.05, 0.42, 0.2 + t.tone * 0.1);
  });
  const FLOWERS = ["#f4f1e8", "#f7d34a", "#e86a8a", "#b28cf0", "#f08a3a"];
  useInstances(flowerRef, flowers, (o, t) => {
    o.position.set(t.x, t.y + 0.3, t.z);
    o.scale.setScalar(0.7 + t.s * 0.4);
    return new Color(FLOWERS[Math.floor(t.tone * FLOWERS.length)]);
  });
  useInstances(poleRef, lamps, (o, l) => {
    o.position.set(l.x, l.y, l.z);
    o.rotation.y = l.yaw;
  });
  const headAt = (o: Object3D, l: (typeof lamps)[number], drop: number) => {
    o.position.set(l.x + Math.sin(l.yaw) * 1.3, l.y + 5.3 - drop, l.z + Math.cos(l.yaw) * 1.3);
    o.rotation.y = l.yaw;
  };
  useInstances(headRef, lamps, (o, l) => headAt(o, l, 0.05));
  useInstances(bulbRef, lamps, (o, l) => headAt(o, l, 0.2));

  useFrame(() => {
    if (bulbMat.current) bulbMat.current.emissiveIntensity = 0.4 + nightMix.v * 7;
  });

  return (
    <>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, trees.length]} castShadow>
        <cylinderGeometry args={[0.17, 0.3, 2.6, 8]} />
        <meshStandardMaterial color="#5b4332" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={broadRef} args={[geos.broad, undefined, broad.length]} castShadow receiveShadow>
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={pineRef} args={[geos.pine, undefined, pines.length]} castShadow receiveShadow>
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={palmTrunkRef} args={[geos.palmTrunk, undefined, palms.length]} castShadow>
        <meshStandardMaterial color="#8a7356" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={palmCrownRef} args={[geos.palmCrown, undefined, palms.length]} castShadow>
        <meshStandardMaterial roughness={0.8} side={2} />
      </instancedMesh>
      <instancedMesh ref={rockRef} args={[undefined, undefined, rocks.length]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.95} flatShading />
      </instancedMesh>
      <instancedMesh ref={tuftRef} args={[geos.tuft, undefined, tufts.length]}>
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
      <instancedMesh ref={flowerRef} args={[undefined, undefined, flowers.length]}>
        <icosahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={poleRef} args={[poleGeo, undefined, lamps.length]} castShadow>
        <meshStandardMaterial color="#2c3035" metalness={0.8} roughness={0.35} />
      </instancedMesh>
      <instancedMesh ref={headRef} args={[undefined, undefined, lamps.length]} castShadow>
        <boxGeometry args={[0.5, 0.12, 0.3]} />
        <meshStandardMaterial color="#2c3035" metalness={0.8} roughness={0.35} />
      </instancedMesh>
      <instancedMesh ref={bulbRef} args={[undefined, undefined, lamps.length]}>
        <boxGeometry args={[0.4, 0.05, 0.22]} />
        <meshStandardMaterial ref={bulbMat} color="#fff1d8" emissive="#ffd48a" emissiveIntensity={0.4} toneMapped={false} />
      </instancedMesh>

      {/* solid things you bump into */}
      <RigidBody type="fixed" colliders={false}>
        {trees.map((t, i) => (
          <CylinderCollider key={`t${i}`} args={[2, 0.3 * t.s]} position={[t.x, t.y + 2, t.z]} />
        ))}
        {palms.map((t, i) => (
          <CylinderCollider key={`p${i}`} args={[2, 0.25]} position={[t.x, t.y + 2, t.z]} />
        ))}
        {rocks.map((t, i) => (
          <BallCollider key={`r${i}`} args={[0.6 + t.tone * 1.1]} position={[t.x, t.y, t.z]} />
        ))}
        {lamps.map((l, i) => (
          <CylinderCollider key={`l${i}`} args={[2.7, 0.12]} position={[l.x, l.y + 2.7, l.z]} />
        ))}
      </RigidBody>
    </>
  );
}
