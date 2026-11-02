"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  CanvasTexture,
  Color,
  ExtrudeGeometry,
  Object3D,
  RepeatWrapping,
  SRGBColorSpace,
  Shape,
  type Group,
  type InstancedMesh,
  type Mesh,
} from "three";
import { ConvexHullCollider, CylinderCollider, CuboidCollider } from "@react-three/rapier";
import { groundHeight } from "./island";
import { COLORS, districts, ferris, postcards, ramp, type Postcard } from "./places";
import { PAPER } from "./placard";
import { useUI } from "./store";

const FONT = "/fonts/Geist-Regular.ttf";

function seeded(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}

/* ───────────────────────── ferris wheel ───────────────────────── */

const GONDOLA = [COLORS.flare, COLORS.cyan, COLORS.gold, COLORS.pink, COLORS.signal, COLORS.violet];

export function FerrisWheel() {
  const wheel = useRef<Group>(null);
  const cabins = useRef<(Group | null)[]>([]);
  const R = ferris.radius;
  const hub = R + 3.2;
  const N = 16;
  const night = useUI((s) => s.night);

  useFrame((_, dt) => {
    const w = wheel.current;
    if (!w) return;
    w.rotation.z += dt * 0.07;
    // cabins hang level whatever the wheel's angle
    for (const c of cabins.current) if (c) c.rotation.z = -w.rotation.z;
  });

  const steel = <meshStandardMaterial color="#e8e6e1" metalness={0.75} roughness={0.3} />;
  return (
    <group position={[ferris.x, ferris.y, ferris.z]} rotation-y={ferris.yaw}>
      {[-8, 8].map((x) => [-2.4, 2.4].map((z) => <CylinderCollider key={`${x}${z}`} args={[hub / 2, 0.35]} position={[x * 0.5, hub / 2, z]} />))}
      <CuboidCollider args={[1.3, 1.4, 0.9]} position={[0, 1.4, 7.5]} />
      {/* paved base */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.04} receiveShadow>
        <circleGeometry args={[12, 48]} />
        <meshStandardMaterial color="#b9b2a5" roughness={0.9} />
      </mesh>
      {/* A-frame legs either side of the wheel */}
      {[-2.4, 2.4].map((z) =>
        [-1, 1].map((sx) => {
          const dx = sx * 8;
          const len = Math.hypot(dx, hub);
          return (
            <mesh key={`${z}${sx}`} position={[dx / 2, hub / 2, z]} rotation-z={Math.atan2(dx, hub)} castShadow>
              <cylinderGeometry args={[0.22, 0.32, len, 10]} />
              {steel}
            </mesh>
          );
        }),
      )}
      <mesh position-y={hub} rotation-x={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 5.4, 16]} />
        {steel}
      </mesh>

      <group ref={wheel} position-y={hub}>
        {[-1.5, 1.5].map((z) => (
          <group key={z} position-z={z}>
            <mesh castShadow>
              <torusGeometry args={[R, 0.16, 8, 96]} />
              {steel}
            </mesh>
            <mesh>
              <torusGeometry args={[R * 0.62, 0.1, 6, 64]} />
              {steel}
            </mesh>
            {Array.from({ length: N / 2 }, (_, i) => (
              <mesh key={i} rotation-z={(i / (N / 2)) * Math.PI}>
                <boxGeometry args={[0.09, R * 2, 0.09]} />
                {steel}
              </mesh>
            ))}
          </group>
        ))}
        {/* rim lights */}
        {Array.from({ length: N * 2 }, (_, i) => {
          const a = (i / (N * 2)) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * R, Math.sin(a) * R, 1.62]}>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshStandardMaterial
                color="#fff3d6"
                emissive="#ffd78a"
                emissiveIntensity={night ? 5 : 1.2}
                toneMapped={false}
              />
            </mesh>
          );
        })}
        {Array.from({ length: N }, (_, i) => {
          const a = (i / N) * Math.PI * 2;
          const color = GONDOLA[i % GONDOLA.length];
          return (
            <group key={i} position={[Math.cos(a) * R, Math.sin(a) * R, 0]}>
              <mesh rotation-x={Math.PI / 2}>
                <cylinderGeometry args={[0.07, 0.07, 3.2, 8]} />
                {steel}
              </mesh>
              <group ref={(g) => void (cabins.current[i] = g)}>
                <mesh position-y={-0.6}>
                  <cylinderGeometry args={[0.03, 0.03, 1.2, 4]} />
                  {steel}
                </mesh>
                <mesh position-y={-1.7} castShadow>
                  <boxGeometry args={[1.5, 1.3, 1.5]} />
                  <meshStandardMaterial color={color} roughness={0.45} metalness={0.2} />
                </mesh>
                <mesh position-y={-1.55}>
                  <boxGeometry args={[1.52, 0.55, 1.52]} />
                  <meshPhysicalMaterial color="#1a2330" metalness={0.8} roughness={0.08} />
                </mesh>
                <mesh position-y={-0.95} castShadow>
                  <coneGeometry args={[1.15, 0.5, 4]} />
                  <meshStandardMaterial color="#f4efe5" roughness={0.6} />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>
      {/* ticket booth */}
      <group position={[0, 0, 7.5]}>
        <mesh position-y={1.3} castShadow>
          <boxGeometry args={[2.6, 2.6, 1.8]} />
          <meshStandardMaterial color="#f4efe5" roughness={0.8} />
        </mesh>
        <mesh position-y={2.75} castShadow>
          <boxGeometry args={[3.0, 0.3, 2.2]} />
          <meshStandardMaterial color={COLORS.flare} roughness={0.6} />
        </mesh>
        <Text font={FONT} fontSize={0.32} color={PAPER.ink} position={[0, 2.0, 0.91]} anchorX="center">
          Sunset wheel
        </Text>
      </group>
    </group>
  );
}

/* ───────────────────────── balloons ───────────────────────── */

function stripes(a: string, b: string) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 8;
  const g = c.getContext("2d")!;
  for (let i = 0; i < 8; i++) {
    g.fillStyle = i % 2 ? a : b;
    g.fillRect(i * 32, 0, 32, 8);
  }
  const t = new CanvasTexture(c);
  t.wrapS = RepeatWrapping;
  t.colorSpace = SRGBColorSpace;
  return t;
}

const BALLOONS = [
  { a: COLORS.flare, b: "#f4efe5", r: 150, h: 58, speed: 0.012, phase: 0 },
  { a: COLORS.cyan, b: "#1f3b57", r: 120, h: 72, speed: -0.01, phase: 2 },
  { a: COLORS.gold, b: COLORS.pink, r: 175, h: 48, speed: 0.008, phase: 4 },
  { a: COLORS.signal, b: "#24452c", r: 95, h: 64, speed: -0.014, phase: 5.2 },
];

export function Balloons() {
  const refs = useRef<(Group | null)[]>([]);
  const textures = useMemo(() => BALLOONS.map((b) => stripes(b.a, b.b)), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    BALLOONS.forEach((b, i) => {
      const g = refs.current[i];
      if (!g) return;
      const a = b.phase + t * b.speed;
      g.position.set(Math.cos(a) * b.r, b.h + Math.sin(t * 0.3 + i) * 2, Math.sin(a) * b.r);
      g.rotation.y = t * 0.05 + i;
    });
  });
  return (
    <>
      {BALLOONS.map((b, i) => (
        <group key={i} ref={(g) => void (refs.current[i] = g)}>
          <mesh scale={[1, 1.18, 1]} castShadow>
            <sphereGeometry args={[6, 32, 24]} />
            <meshStandardMaterial map={textures[i]} roughness={0.7} />
          </mesh>
          <mesh position-y={-6.8}>
            <cylinderGeometry args={[2.4, 1.0, 2.4, 24, 1, true]} />
            <meshStandardMaterial map={textures[i]} roughness={0.7} side={2} />
          </mesh>
          {[0, 1, 2, 3].map((k) => (
            <mesh key={k} position={[Math.cos(k * 1.57) * 0.6, -8.9, Math.sin(k * 1.57) * 0.6]}>
              <cylinderGeometry args={[0.02, 0.02, 1.6, 4]} />
              <meshStandardMaterial color="#3b2f22" />
            </mesh>
          ))}
          <mesh position-y={-10}>
            <boxGeometry args={[1.4, 1, 1.4]} />
            <meshStandardMaterial color="#8a6238" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* ───────────────────────── birds ───────────────────────── */

const GULL_X = districts[0].x + districts[0].ux * 30;
const GULL_Z = districts[0].z + districts[0].uz * 30;

export function Birds() {
  const birds = useMemo(() => {
    const rnd = seeded(61);
    return Array.from({ length: 22 }, () => ({
      r: 26 + rnd() * 22,
      h: 24 + rnd() * 10,
      phase: rnd() * Math.PI * 2,
      speed: 0.18 + rnd() * 0.06,
      flap: 7 + rnd() * 3,
    }));
  }, []);
  const refs = useRef<{ body: Group | null; l: Mesh | null; r: Mesh | null }[]>(birds.map(() => ({ body: null, l: null, r: null })));
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    birds.forEach((b, i) => {
      const o = refs.current[i];
      if (!o.body) return;
      const a = b.phase + t * b.speed;
      o.body.position.set(GULL_X + Math.cos(a) * b.r, b.h + Math.sin(t * 0.7 + i) * 1.5, GULL_Z + Math.sin(a) * b.r);
      o.body.rotation.y = -a;
      const f = Math.sin(t * b.flap + i) * 0.7;
      if (o.l) o.l.rotation.z = f;
      if (o.r) o.r.rotation.z = -f;
    });
  });
  return (
    <>
      {birds.map((_, i) => (
        <group key={i} ref={(g) => void (refs.current[i].body = g)}>
          <mesh rotation-x={Math.PI / 2}>
            <coneGeometry args={[0.08, 0.45, 5]} />
            <meshStandardMaterial color="#f2f0ec" />
          </mesh>
          {(["l", "r"] as const).map((side) => (
            <mesh key={side} ref={(m) => void (refs.current[i][side] = m)}>
              <boxGeometry args={[0.9, 0.02, 0.22]} />
              <meshStandardMaterial color="#e9e7e2" />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

/* ───────────────────────── ramps ───────────────────────── */

function chevrons() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#2c2f34";
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = "#f2c94c";
  g.lineWidth = 14;
  g.beginPath();
  g.moveTo(16, 92);
  g.lineTo(64, 44);
  g.lineTo(112, 92);
  g.stroke();
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.colorSpace = SRGBColorSpace;
  return t;
}

export function Ramps() {
  const tex = useMemo(chevrons, []);
  const r = ramp;
  const { geo, hull } = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-r.length / 2, 0);
    shape.lineTo(r.length / 2, 0);
    shape.lineTo(r.length / 2, r.height);
    shape.closePath();
    const g = new ExtrudeGeometry(shape, { depth: r.width, bevelEnabled: false });
    g.translate(0, 0, -r.width / 2);
    g.rotateY(-Math.PI / 2);
    // collider hull: the six corners of the wedge
    const L = r.length / 2;
    const W = r.width / 2;
    const pts = new Float32Array([-W, 0, -L, W, 0, -L, -W, 0, L, W, 0, L, -W, r.height, L, W, r.height, L]);
    return { geo: g, hull: pts };
  }, [r]);
  const deck = Math.hypot(r.length, r.height);
  const slope = Math.atan2(r.height, r.length);
  const t = useMemo(() => {
    const c = tex.clone();
    c.repeat.set(2, deck / 2.5);
    c.needsUpdate = true;
    return c;
  }, [tex, deck]);
  return (
    <group position={[r.x, r.y, r.z]} rotation-y={r.yaw}>
      <ConvexHullCollider args={[hull]} friction={1} />
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color="#b7b1a6" roughness={0.85} />
      </mesh>
      <mesh position-y={r.height / 2 + 0.01} rotation-x={-Math.PI / 2 + slope}>
        <planeGeometry args={[r.width - 0.2, deck]} />
        <meshStandardMaterial map={t} roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ───────────────────────── postcards ───────────────────────── */

function postcardTexture(p: Postcard, color: string) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 170;
  const g = c.getContext("2d")!;
  g.fillStyle = "#f4efe5";
  g.fillRect(0, 0, 256, 170);
  g.strokeStyle = color;
  g.lineWidth = 8;
  g.strokeRect(8, 8, 240, 154);
  // stamp
  g.fillStyle = color;
  g.fillRect(196, 20, 40, 48);
  g.fillStyle = "#f4efe5";
  g.fillRect(202, 26, 28, 36);
  g.fillStyle = "#1f1b16";
  g.font = "500 22px Geist, sans-serif";
  g.fillText("Greetings from", 22, 70);
  g.font = "500 28px Geist, sans-serif";
  g.fillText(p.title, 22, 108, 210);
  g.fillStyle = "#7b7266";
  g.font = "16px Geist, sans-serif";
  g.fillText("yash.world", 22, 142);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

const CARD_COLORS = [COLORS.flare, COLORS.cyan, COLORS.gold, COLORS.pink, COLORS.violet, "#3f8f5a"];

function PostcardPickup({ p, i }: { p: Postcard; i: number }) {
  const collected = useUI((s) => s.collected.includes(p.id));
  const ref = useRef<Group>(null);
  const gone = useRef(collected ? 1 : 0);
  const tex = useMemo(() => postcardTexture(p, CARD_COLORS[i % CARD_COLORS.length]), [p, i]);
  const base = useMemo(() => groundHeight(p.x, p.z), [p]);

  useFrame(({ clock }, dt) => {
    const g = ref.current;
    if (!g) return;
    if (collected) gone.current = Math.min(1, gone.current + dt * 2.2);
    const k = gone.current;
    g.visible = k < 1;
    const t = clock.elapsedTime + i;
    g.position.y = base + p.y + Math.sin(t * 1.8) * 0.15 + k * 2.5;
    g.rotation.y = t * 1.2 + k * 8;
    g.scale.setScalar(1 - k * k);
  });

  return (
    <group position={[p.x, 0, p.z]}>
      <group ref={ref}>
        <mesh castShadow>
          <boxGeometry args={[0.95, 0.63, 0.02]} />
          <meshStandardMaterial map={tex} roughness={0.7} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.25} />
        </mesh>
      </group>
      {!collected && (
        <mesh rotation-x={-Math.PI / 2} position-y={base + 0.08}>
          <ringGeometry args={[0.7, 0.85, 40]} />
          <meshBasicMaterial color="#f4efe5" transparent opacity={0.7} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

export function Postcards() {
  return (
    <>
      {postcards.map((p, i) => (
        <PostcardPickup key={p.id} p={p} i={i} />
      ))}
    </>
  );
}

/* ───────────────────────── fireworks ───────────────────────── */

const BURSTS = 7;
const SPARKS = 70;
const FW_COLORS = [COLORS.signal, COLORS.flare, COLORS.cyan, COLORS.gold, COLORS.pink, COLORS.violet];

/** Celebration over the plaza once every postcard is collected. */
export function Fireworks() {
  const count = useUI((s) => s.collected.length);
  const mesh = useRef<InstancedMesh>(null);
  const start = useRef<number | null>(null);
  const prev = useRef(count);
  const sparks = useMemo(() => {
    const rnd = seeded(404);
    return Array.from({ length: BURSTS * SPARKS }, (_, i) => {
      const b = Math.floor(i / SPARKS);
      const u = rnd() * 2 - 1;
      const th = rnd() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const v = 9 + rnd() * 4;
      return {
        b,
        vx: s * Math.cos(th) * v,
        vy: u * v,
        vz: s * Math.sin(th) * v,
        ox: districts[0].x + districts[0].ux * 40 + (rnd() - 0.5) * 60,
        oy: 38 + rnd() * 16,
        oz: districts[0].z + districts[0].uz * 40 + (rnd() - 0.5) * 40,
        delay: b * 0.8,
      };
    });
  }, []);
  // burst origins are per burst, so reuse the first spark's offset
  const origins = useMemo(() => Array.from({ length: BURSTS }, (_, b) => sparks[b * SPARKS]), [sparks]);

  useEffect(() => {
    if (count === postcards.length && prev.current < postcards.length) start.current = -1;
    prev.current = count;
  }, [count]);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const c = new Color();
    // over-bright colours so the sparks bloom
    sparks.forEach((s, i) => m.setColorAt(i, c.set(FW_COLORS[s.b % FW_COLORS.length]).multiplyScalar(4)));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [sparks]);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    if (start.current === -1) start.current = clock.elapsedTime;
    if (start.current === null) {
      m.visible = false;
      return;
    }
    const t = clock.elapsedTime - start.current;
    if (t > BURSTS * 0.8 + 3) {
      start.current = null;
      return;
    }
    m.visible = true;
    const o = new Object3D();
    sparks.forEach((s, i) => {
      const lt = t - s.delay;
      const org = origins[s.b];
      if (lt < 0 || lt > 2.6) {
        o.scale.setScalar(0);
      } else {
        const drag = 1 - Math.exp(-lt * 1.6);
        o.position.set(org.ox + (s.vx * drag) / 1.6, org.oy + (s.vy * drag) / 1.6 - 2.5 * lt * lt, org.oz + (s.vz * drag) / 1.6);
        o.scale.setScalar(Math.max(0, 1 - lt / 2.6) * 0.35);
      }
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, BURSTS * SPARKS]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}
