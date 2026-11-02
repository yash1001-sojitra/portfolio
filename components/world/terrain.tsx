"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody, TrimeshCollider } from "@react-three/rapier";
import { useLayoutEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  ConeGeometry,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  Vector2,
  Vector3,
  type Group,
  type Texture,
} from "three";
import { GRID, ROAD_HALF, groundHeight, island } from "./island";
import { districts } from "./places";


/* ───────────────────────── textures ───────────────────────── */

const SETS = ["grass", "sand", "rock", "asphalt", "plaster", "roof", "planks", "cobble"] as const;
export type MaterialSet = (typeof SETS)[number];

/** Loads every PBR set once; colour maps are sRGB, the rest linear. */
export function usePBR() {
  const urls = useMemo(() => {
    const o: Record<string, string> = {};
    for (const s of SETS) {
      o[`${s}_diff`] = `/textures/${s}_diff.jpg`;
      o[`${s}_nor`] = `/textures/${s}_nor.jpg`;
      o[`${s}_rough`] = `/textures/${s}_rough.jpg`;
    }
    return o;
  }, []);
  const tex = useTexture(urls) as Record<string, Texture>;
  // configure the originals before anything clones them, so clones inherit it
  useMemo(() => {
    for (const [k, t] of Object.entries(tex)) {
      t.wrapS = t.wrapT = RepeatWrapping;
      t.anisotropy = 8;
      if (k.endsWith("_diff")) t.colorSpace = SRGBColorSpace;
      t.needsUpdate = true;
    }
  }, [tex]);
  return useMemo(() => (set: MaterialSet, repeat: [number, number] = [1, 1]) => {
    const clone = (t: Texture) => {
      const c = t.clone();
      c.repeat.set(...repeat);
      c.needsUpdate = true;
      return c;
    };
    return {
      map: clone(tex[`${set}_diff`]),
      normalMap: clone(tex[`${set}_nor`]),
      roughnessMap: clone(tex[`${set}_rough`]),
    };
  }, [tex]);
}

/* ───────────────────────── terrain ───────────────────────── */

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function useTerrainGeometry() {
  return useMemo(() => {
    const { heights } = island();
    const { size, res } = GRID;
    const n = res + 1;
    const pos = new Float32Array(n * n * 3);
    const uv = new Float32Array(n * n * 2);
    for (let j = 0; j < n; j++)
      for (let i = 0; i < n; i++) {
        const k = j * n + i;
        pos[k * 3] = -size / 2 + (i / res) * size;
        pos[k * 3 + 1] = heights[k];
        pos[k * 3 + 2] = -size / 2 + (j / res) * size;
        uv[k * 2] = i / res;
        uv[k * 2 + 1] = j / res;
      }
    const idx = new Uint32Array(res * res * 6);
    let o = 0;
    for (let j = 0; j < res; j++)
      for (let i = 0; i < res; i++) {
        const a = j * n + i;
        const b = a + 1;
        const c = a + n;
        const d = c + 1;
        // a-c-b / c-d-b, matching groundHeight()'s split
        idx.set([a, c, b, c, d, b], o);
        o += 6;
      }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("uv", new BufferAttribute(uv, 2));
    g.setIndex(new BufferAttribute(idx, 1));
    g.computeVertexNormals();

    // splat weights: grass / sand / rock from height and slope
    const nrm = g.attributes.normal;
    const splat = new Float32Array(n * n * 3);
    for (let k = 0; k < n * n; k++) {
      const h = heights[k];
      const ny = nrm.getY(k);
      const x = pos[k * 3];
      const z = pos[k * 3 + 2];
      const wobble = Math.sin(x * 0.21) * Math.cos(z * 0.17) * 0.5;
      const sand = 1 - smooth(0.7 + wobble * 0.4, 1.5 + wobble * 0.4, h);
      const rock = Math.max(smooth(0.9, 0.74, ny), smooth(30, 42, h) * 0.7) * (1 - sand);
      const grass = Math.max(0, 1 - sand - rock);
      const sum = sand + rock + grass || 1;
      splat[k * 3] = grass / sum;
      splat[k * 3 + 1] = sand / sum;
      splat[k * 3 + 2] = rock / sum;
    }
    g.setAttribute("splat", new BufferAttribute(splat, 3));
    return g;
  }, []);
}

/** MeshStandardMaterial that blends three PBR sets by a per-vertex splat attribute. */
function useTerrainMaterial() {
  const pbr = usePBR();
  return useMemo(() => {
    const tiles = GRID.size / 7;
    const grass = pbr("grass", [tiles, tiles]);
    const sand = pbr("sand", [tiles, tiles]);
    const rock = pbr("rock", [tiles, tiles]);
    const m = new MeshStandardMaterial({ ...grass, roughness: 1, color: new Color("#bcd78e") });
    m.onBeforeCompile = (sh) => {
      sh.uniforms.sandMap = { value: sand.map };
      sh.uniforms.sandNormal = { value: sand.normalMap };
      sh.uniforms.sandRough = { value: sand.roughnessMap };
      sh.uniforms.rockMap = { value: rock.map };
      sh.uniforms.rockNormal = { value: rock.normalMap };
      sh.uniforms.rockRough = { value: rock.roughnessMap };
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nattribute vec3 splat;\nvarying vec3 vSplat;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvSplat = splat;");
      sh.fragmentShader = sh.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
varying vec3 vSplat;
uniform sampler2D sandMap; uniform sampler2D sandNormal; uniform sampler2D sandRough;
uniform sampler2D rockMap; uniform sampler2D rockNormal; uniform sampler2D rockRough;`,
        )
        .replace(
          "#include <map_fragment>",
          `vec2 tuv = vMapUv;
vec4 gA = texture2D(map, tuv);
vec4 gB = texture2D(map, tuv * 0.23 + vec2(0.37, 0.11));
vec4 gC = mix(gA, gB, 0.45);
vec4 sC = texture2D(sandMap, tuv);
vec4 rC = texture2D(rockMap, tuv * 0.5);
diffuseColor *= gC * vSplat.x + sC * vSplat.y + rC * vSplat.z;`,
        )
        .replace(
          "#include <roughnessmap_fragment>",
          `float roughnessFactor = roughness;
roughnessFactor *= (texture2D(roughnessMap, tuv) * vSplat.x + texture2D(sandRough, tuv) * vSplat.y + texture2D(rockRough, tuv * 0.5) * vSplat.z).g;`,
        )
        .replace(
          "#include <normal_fragment_maps>",
          `vec3 nG = texture2D(normalMap, tuv).xyz * 2.0 - 1.0;
vec3 nS = texture2D(sandNormal, tuv).xyz * 2.0 - 1.0;
vec3 nR = texture2D(rockNormal, tuv * 0.5).xyz * 2.0 - 1.0;
vec3 mapN = normalize(nG * vSplat.x + nS * vSplat.y + nR * vSplat.z);
mapN.xy *= normalScale;
normal = normalize(tbn * mapN);`,
        );
    };
    return m;
  }, [pbr]);
}

export function Terrain() {
  const geo = useTerrainGeometry();
  const mat = useTerrainMaterial();
  const collider = useMemo(() => {
    return [geo.attributes.position.array as Float32Array, geo.index!.array as Uint32Array] as const;
  }, [geo]);
  return (
    <>
      <mesh geometry={geo} material={mat} receiveShadow />
      <RigidBody type="fixed" colliders={false} friction={1}>
        <TrimeshCollider args={[collider[0], collider[1]]} />
      </RigidBody>
    </>
  );
}

/* ───────────────────────── road ───────────────────────── */

function ribbon(offset: number, half: number, lift: number, dash?: [number, number]) {
  const { road } = island();
  const verts: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];
  const N = road.length;
  let quad = 0;
  for (let i = 0; i <= N; i++) {
    const r = road[i % N];
    const next = road[(i + 1) % N];
    if (dash) {
      const phase = (r.s % (dash[0] + dash[1])) / (dash[0] + dash[1]);
      if (phase > dash[0] / (dash[0] + dash[1])) continue;
      if (i === N) break;
      // a short quad from this sample to the next
      for (const p of [r, next]) {
        const cx = p.x + p.nx * offset;
        const cz = p.z + p.nz * offset;
        verts.push(cx - p.nx * half, p.y + lift, cz - p.nz * half, cx + p.nx * half, p.y + lift, cz + p.nz * half);
        uvs.push(0, 0, 1, 0);
      }
      const b = quad * 4;
      idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3);
      quad++;
      continue;
    }
    const cx = r.x + r.nx * offset;
    const cz = r.z + r.nz * offset;
    verts.push(cx - r.nx * half, r.y + lift, cz - r.nz * half, cx + r.nx * half, r.y + lift, cz + r.nz * half);
    const v = (i === N ? road[N - 1].s + Math.hypot(road[0].x - road[N - 1].x, road[0].z - road[N - 1].z) : r.s) / 7;
    uvs.push(0, v, 1, v);
    if (i < N) {
      const b = i * 2;
      idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(verts), 3));
  g.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
  // make sure the strip faces up whichever way the loop winds
  const tri = (a: number) => {
    const p = (k: number) => [verts[k * 3], verts[k * 3 + 1], verts[k * 3 + 2]];
    const [ax, ay, az] = p(idx[a]);
    const [bx, by, bz] = p(idx[a + 1]);
    const [cx, cy, cz] = p(idx[a + 2]);
    void ay;
    void by;
    void cy;
    return (bz - az) * (cx - ax) - (bx - ax) * (cz - az);
  };
  if (idx.length && tri(0) < 0)
    for (let k = 0; k < idx.length; k += 3) [idx[k + 1], idx[k + 2]] = [idx[k + 2], idx[k + 1]];
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function Road() {
  const pbr = usePBR();
  const asphalt = useMemo(() => pbr("asphalt", [1, 1]), [pbr]);
  const geos = useMemo(
    () => ({
      road: ribbon(0, ROAD_HALF, 0.06),
      shoulderL: ribbon(-ROAD_HALF - 0.6, 0.6, 0.04),
      shoulderR: ribbon(ROAD_HALF + 0.6, 0.6, 0.04),
      centre: ribbon(0, 0.08, 0.075, [3, 4]),
      edgeL: ribbon(-ROAD_HALF + 0.35, 0.08, 0.075),
      edgeR: ribbon(ROAD_HALF - 0.35, 0.08, 0.075),
    }),
    [],
  );
  return (
    <group>
      <mesh geometry={geos.road} receiveShadow>
        <meshStandardMaterial {...asphalt} roughness={1} color="#9a9a9a" />
      </mesh>
      {[geos.shoulderL, geos.shoulderR].map((g, i) => (
        <mesh key={i} geometry={g} receiveShadow>
          <meshStandardMaterial color="#8d8576" roughness={1} />
        </mesh>
      ))}
      <mesh geometry={geos.centre}>
        <meshStandardMaterial color="#e8c96a" roughness={0.7} />
      </mesh>
      {[geos.edgeL, geos.edgeR].map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshStandardMaterial color="#efefe9" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ───────────────────────── pads + harbour ───────────────────────── */

export function Pads() {
  const pbr = usePBR();
  const mats = useMemo(
    () => districts.map((d) => pbr("cobble", [d.radius / 2.2, d.radius / 2.2])),
    [pbr],
  );
  const drive = useMemo(() => pbr("cobble", [2, 3]), [pbr]);
  return (
    <>
      {districts.map((d, i) => {
        // short cobbled drive linking the pad to the road
        const len = ROAD_HALF + 5;
        const ex = d.x - d.ux * (d.radius + len / 2 - 1);
        const ez = d.z - d.uz * (d.radius + len / 2 - 1);
        return (
          <group key={d.id}>
            <mesh rotation-x={-Math.PI / 2} position={[d.x, d.y + 0.05, d.z]} receiveShadow>
              <circleGeometry args={[d.radius, 64]} />
              <meshStandardMaterial {...mats[i]} roughness={1} />
            </mesh>
            <mesh rotation-x={-Math.PI / 2} position={[d.x, d.y + 0.07, d.z]}>
              <ringGeometry args={[d.radius, d.radius + 0.6, 64]} />
              <meshStandardMaterial color="#cfc6b6" roughness={0.9} />
            </mesh>
            <mesh
              rotation={[-Math.PI / 2, 0, -Math.atan2(d.ux, d.uz)]}
              position={[ex, d.y + 0.045, ez]}
              receiveShadow
            >
              <planeGeometry args={[7, len]} />
              <meshStandardMaterial {...drive} roughness={1} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

/** Timber pier running out to sea from Harbour Square, with boats tied alongside. */
export function Harbour() {
  const pbr = usePBR();
  const plaza = districts[0];
  const deck = useMemo(() => pbr("planks", [1.2, 10]), [pbr]);
  const L = 46;
  const W = 4.4;
  const start = plaza.radius - 1;
  const yaw = Math.atan2(plaza.ux, plaza.uz);
  const cx = plaza.x + plaza.ux * (start + L / 2);
  const cz = plaza.z + plaza.uz * (start + L / 2);
  const y = Math.max(plaza.y, 1.6);
  return (
    <group position={[cx, 0, cz]} rotation-y={yaw}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[W / 2, 0.15, L / 2]} position={[0, y - 0.15, 0]} />
      </RigidBody>
      <mesh position-y={y - 0.15} castShadow receiveShadow>
        <boxGeometry args={[W, 0.3, L]} />
        <meshStandardMaterial {...deck} roughness={1} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) =>
        [-1, 1].map((s) => (
          <mesh key={`${i}${s}`} position={[s * (W / 2 - 0.2), y - 4, -L / 2 + 2 + i * 3.9]} castShadow>
            <cylinderGeometry args={[0.18, 0.2, 8, 8]} />
            <meshStandardMaterial color="#4a3b2c" roughness={1} />
          </mesh>
        )),
      )}
      {/* rails */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (W / 2 - 0.1), y + 0.55, 0]} castShadow>
          <boxGeometry args={[0.08, 0.08, L]} />
          <meshStandardMaterial color="#5a4632" roughness={0.9} />
        </mesh>
      ))}
      <Boats y={0} deckY={y} />
    </group>
  );
}

function Boat({ color, position, rot, phase }: { color: string; position: [number, number, number]; rot: number; phase: number }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime + phase;
    g.position.y = position[1] + Math.sin(t * 1.1) * 0.12;
    g.rotation.z = Math.sin(t * 0.9) * 0.04;
    g.rotation.x = Math.sin(t * 0.7) * 0.025;
  });
  return (
    <group ref={ref} position={position} rotation-y={rot}>
      <mesh scale={[1, 0.55, 2.6]} position-y={0.2} castShadow>
        <sphereGeometry args={[1.2, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#f3f1ec" roughness={0.45} side={2} />
      </mesh>
      <mesh position-y={0.26} scale={[1, 1, 2.6]}>
        <cylinderGeometry args={[1.18, 1.18, 0.12, 24]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position-y={0.34} scale={[0.92, 1, 2.4]}>
        <cylinderGeometry args={[1.1, 1.1, 0.05, 24]} />
        <meshStandardMaterial color="#8a6a48" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.2, 0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 6, 8]} />
        <meshStandardMaterial color="#d8d2c6" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.9, -0.6]} castShadow>
        <boxGeometry args={[1.2, 0.9, 1.4]} />
        <meshStandardMaterial color="#f3f1ec" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Boats({ y, deckY }: { y: number; deckY: number }) {
  void deckY;
  return (
    <>
      <Boat color="#1d4e89" position={[5.2, y, -8]} rot={0.05} phase={0} />
      <Boat color="#b3202a" position={[-5.4, y, 4]} rot={-0.08} phase={1.7} />
      <Boat color="#2f6d4f" position={[5.6, y, 14]} rot={0.12} phase={3.1} />
    </>
  );
}

/* ───────────────────────── sea ───────────────────────── */

export const SUN_DIR = new Vector3(-0.45, 0.42, 0.79).normalize();

/**
 * Ocean: a PBR surface that reflects the real sky (scene environment) with two scrolling
 * wave normal maps. No mirror pass, so it costs one draw call instead of a second scene render.
 */
export function Sea() {
  const base = useTexture("/textures/waternormals.jpg");
  const maps = useMemo(() => {
    const a = base.clone();
    const b = base.clone();
    for (const t of [a, b]) {
      t.wrapS = t.wrapT = RepeatWrapping;
      t.needsUpdate = true;
    }
    a.repeat.set(70, 70);
    b.repeat.set(23, 23);
    return { a, b };
  }, [base]);
  const mat = useMemo(() => {
    const m = new MeshStandardMaterial({
      color: new Color("#0f4756"),
      roughness: 0.08,
      metalness: 0.0,
      normalMap: maps.a,
      normalScale: new Vector2(0.55, 0.55),
      envMapIntensity: 1.15,
    });
    m.onBeforeCompile = (sh) => {
      sh.uniforms.waveB = { value: maps.b };
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", "#include <common>\nuniform sampler2D waveB;")
        .replace(
          "#include <normal_fragment_maps>",
          `vec3 nA = texture2D(normalMap, vNormalMapUv).xyz * 2.0 - 1.0;
vec3 nB = texture2D(waveB, vNormalMapUv * 0.33 + vec2(0.13, 0.41)).xyz * 2.0 - 1.0;
vec3 mapN = normalize(vec3(nA.xy + nB.xy, nA.z * nB.z));
mapN.xy *= normalScale;
normal = normalize(tbn * mapN);`,
        );
      m.userData.shader = sh;
    };
    return m;
  }, [maps]);
  const geo = useMemo(() => new PlaneGeometry(4000, 4000), []);
  useFrame((_, dt) => {
    maps.a.offset.x += dt * 0.004;
    maps.a.offset.y += dt * 0.0025;
    maps.b.offset.x -= dt * 0.0018;
    maps.b.offset.y += dt * 0.003;
  });
  return <mesh geometry={geo} material={mat} rotation-x={-Math.PI / 2} position-y={0.05} receiveShadow />;
}

/** The island's edge: an invisible barrier just past the beach, marked by bobbing buoys. */
export function Boundary() {
  const ring = useMemo(() => {
    const plaza = districts[0];
    const pierEnd = { x: plaza.x + plaza.ux * (plaza.radius + 48), z: plaza.z + plaza.uz * (plaza.radius + 48) };
    const pierAngle = Math.atan2(pierEnd.z, pierEnd.x);
    const pierR = Math.hypot(pierEnd.x, pierEnd.z);
    const N = 120;
    return Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2;
      let r = 100;
      while (r < 260 && groundHeight(Math.cos(a) * r, Math.sin(a) * r) > -1.2) r += 1;
      const da = Math.abs(Math.atan2(Math.sin(a - pierAngle), Math.cos(a - pierAngle)));
      if (da < 0.12) r = Math.max(r, pierR + 6);
      return { x: Math.cos(a) * r, z: Math.sin(a) * r };
    });
  }, []);
  const buoys = useRef<(Group | null)[]>([]);
  useFrame(({ clock }) => {
    buoys.current.forEach((b, i) => {
      if (!b) return;
      const t = clock.elapsedTime + i * 0.7;
      b.position.y = Math.sin(t * 1.3) * 0.12;
      b.rotation.z = Math.sin(t * 1.1) * 0.12;
    });
  });
  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        {ring.map((p, i) => {
          const q = ring[(i + 1) % ring.length];
          const len = Math.hypot(q.x - p.x, q.z - p.z);
          return (
            <CuboidCollider
              key={i}
              args={[len / 2 + 0.6, 6, 0.6]}
              position={[(p.x + q.x) / 2, 0, (p.z + q.z) / 2]}
              rotation={[0, -Math.atan2(q.z - p.z, q.x - p.x), 0]}
            />
          );
        })}
      </RigidBody>
      {ring
        .filter((_, i) => i % 2 === 0)
        .map((p, i) => (
          <group key={i} position={[p.x, 0, p.z]}>
            <group ref={(g) => void (buoys.current[i] = g)}>
              <mesh position-y={0.25}>
                <sphereGeometry args={[0.45, 16, 12]} />
                <meshStandardMaterial color={i % 2 ? "#f4f1e8" : "#c8331f"} roughness={0.5} />
              </mesh>
              <mesh position-y={0.85}>
                <cylinderGeometry args={[0.04, 0.04, 0.8, 6]} />
                <meshStandardMaterial color="#2b2824" />
              </mesh>
            </group>
          </group>
        ))}
    </>
  );
}

/** A few far islands on the horizon so the sea isn't empty. */
export function DistantIslands() {
  const shapes = useMemo(() => {
    const out: { x: number; z: number; r: number; h: number; rot: number }[] = [];
    const spots = [
      [700, -300, 160, 70],
      [-650, -500, 220, 110],
      [-900, 350, 180, 60],
      [500, 800, 140, 45],
      [1100, 200, 260, 90],
    ];
    for (const [x, z, r, h] of spots) out.push({ x, z, r, h, rot: x * 0.01 });
    return out;
  }, []);
  const geo = useMemo(() => {
    const g = new ConeGeometry(1, 1, 18, 6);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i);
      if (y > -0.49) {
        const w = 1 + Math.sin(i * 12.9898) * 0.12;
        p.setXYZ(i, p.getX(i) * w, y + Math.cos(i * 4.1) * 0.04, p.getZ(i) * w);
      }
    }
    g.translate(0, 0.5, 0);
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <>
      {shapes.map((s, i) => (
        <mesh key={i} geometry={geo} position={[s.x, -2, s.z]} scale={[s.r, s.h, s.r * 0.7]} rotation-y={s.rot}>
          <meshStandardMaterial color="#5d6f5a" roughness={1} flatShading />
        </mesh>
      ))}
    </>
  );
}

export { groundHeight };
