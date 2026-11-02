"use client";

import { Billboard, Text, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, CylinderCollider } from "@react-three/rapier";
import { Suspense, useMemo, useRef, type ReactNode } from "react";
import { CanvasTexture, Color, DoubleSide, RepeatWrapping, SRGBColorSpace, type Group, type Mesh } from "three";
import { districts, places, type Place } from "./places";
import { Placard, signFor } from "./placard";
import { useUI } from "./store";

export const FONT = "/fonts/Geist-Regular.ttf";

const DARK = "#14181f";
const STONE = "#2a303a";

/* ───────────────────────── shared bits ───────────────────────── */

let windowsTex: CanvasTexture | null = null;
/** Grid of lit/unlit windows used as an emissive map on buildings. */
function getWindows() {
  if (windowsTex) return windowsTex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, 128, 128);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 4; x++) {
      const v = rnd();
      g.fillStyle = v > 0.35 ? `rgba(255,255,255,${0.35 + v * 0.65})` : "#0a0a0a";
      g.fillRect(x * 32 + 6, y * 16 + 4, 20, 9);
    }
  windowsTex = new CanvasTexture(c);
  windowsTex.wrapS = windowsTex.wrapT = RepeatWrapping;
  windowsTex.colorSpace = SRGBColorSpace;
  return windowsTex;
}

function useWindows(repeatX: number, repeatY: number) {
  return useMemo(() => {
    const t = getWindows().clone();
    t.repeat.set(repeatX, repeatY);
    t.needsUpdate = true;
    return t;
  }, [repeatX, repeatY]);
}

function Glow({ color, intensity = 2.2 }: { color: string; intensity?: number }) {
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />;
}

function Label({
  children,
  size = 0.42,
  color = "#eceef0",
  maxWidth,
  ...props
}: {
  children: string;
  size?: number;
  color?: string;
  maxWidth?: number;
  position?: [number, number, number];
  anchorY?: "top" | "middle" | "bottom";
  textAlign?: "left" | "center";
}) {
  return (
    <Text font={FONT} fontSize={size} color={color} anchorX="center" anchorY="middle" maxWidth={maxWidth} {...props}>
      {children}
    </Text>
  );
}

/** Pulsing ground ring shown under the place the player can interact with. */
function FocusRing({ radius, color }: { radius: number; color: string }) {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 4) * 0.06;
    ref.current.scale.set(s, s, s);
  });
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position-y={0.06}>
      <ringGeometry args={[radius + 0.25, radius + 0.55, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.55} depthWrite={false} />
    </mesh>
  );
}

/* ───────────────────────── kinds ───────────────────────── */

function ProfilePhoto({ src }: { src: string }) {
  const tex = useTexture(src);
  tex.colorSpace = SRGBColorSpace;
  return (
    <mesh position={[0, 5.3, 0.46]}>
      <circleGeometry args={[1.15, 48]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function Monolith({ p }: { p: Place }) {
  const edges: [number, number, number, number, number, number][] = [
    [-2.05, 3.6, 0.42, 0.06, 7.2, 0.06],
    [2.05, 3.6, 0.42, 0.06, 7.2, 0.06],
    [0, 7.2, 0.42, 4.16, 0.06, 0.06],
  ];
  return (
    <group>
      <mesh position-y={0.2} castShadow receiveShadow>
        <cylinderGeometry args={[3.4, 3.8, 0.4, 8]} />
        <meshStandardMaterial color={STONE} flatShading />
      </mesh>
      <mesh position-y={3.6} castShadow>
        <boxGeometry args={[4, 7.2, 0.8]} />
        <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.35} />
      </mesh>
      {edges.map(([x, y, z, w, h, dd], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, h, dd]} />
          <Glow color={p.color} />
        </mesh>
      ))}
      <mesh position={[0, 5.3, 0.43]}>
        <ringGeometry args={[1.15, 1.28, 48]} />
        <meshBasicMaterial color={p.color} toneMapped={false} />
      </mesh>
      <Suspense fallback={null}>{p.image && <ProfilePhoto src={p.image} />}</Suspense>
      <group position-z={0.42}>
        {/* first name / surname on separate lines so they fit inside the 4 m slab */}
        {p.title
          .toUpperCase()
          .split(" ")
          .map((line, i) => (
            <Label key={line} position={[0, 3.72 - i * 0.55, 0]} size={0.46} maxWidth={3.5}>
              {line}
            </Label>
          ))}
        <Label position={[0, 2.55, 0]} size={0.22} color={p.color} maxWidth={3.5}>
          {"Senior Software Developer"}
        </Label>
        <Label position={[0, 2.1, 0]} size={0.16} color="#8b929b" maxWidth={3.5}>
          {"Flutter · Node.js · Google Cloud · AI agents"}
        </Label>
      </group>
    </group>
  );
}

function Stat({ p }: { p: Place }) {
  return (
    <group>
      <mesh position-y={p.size / 2} castShadow>
        <cylinderGeometry args={[0.55, 0.7, p.size, 6]} />
        <meshStandardMaterial color={DARK} flatShading metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position-y={p.size + 0.05}>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 6]} />
        <Glow color={p.color} />
      </mesh>
      <Billboard position-y={p.size + 1.1}>
        <Label size={0.9} color={p.color}>
          {p.title}
        </Label>
        <Label position={[0, -0.65, 0]} size={0.24} color="#c4c9cf">
          {p.eyebrow.toUpperCase()}
        </Label>
      </Billboard>
    </group>
  );
}

function Tower({ p }: { p: Place }) {
  const night = useUI((s) => s.night);
  const h = p.size;
  const w = 3.2;
  const tex = useWindows(2, Math.round(h / 1.6));
  return (
    <group>
      <mesh position-y={h / 2} castShadow receiveShadow>
        <boxGeometry args={[w, h, w]} />
        <meshStandardMaterial
          color="#6f7d8c"
          metalness={0.9}
          roughness={0.16}
          emissive={p.color}
          emissiveMap={tex}
          emissiveIntensity={night ? 1.8 : 0.45}
          envMapIntensity={1.3}
        />
      </mesh>
      {/* crown */}
      <mesh position-y={h + 0.15}>
        <boxGeometry args={[w + 0.3, 0.3, w + 0.3]} />
        <meshStandardMaterial color={STONE} />
      </mesh>
      <mesh position-y={h + 0.32}>
        <boxGeometry args={[w + 0.32, 0.06, w + 0.32]} />
        <Glow color={p.color} />
      </mesh>
      {/* rooftop monogram */}
      <Billboard position-y={h + 1.4}>
        <mesh>
          <planeGeometry args={[1.9, 1.2]} />
          <meshBasicMaterial color="#0b0d10" transparent opacity={0.85} side={DoubleSide} />
        </mesh>
        <Label position={[0, 0, 0.01]} size={0.7} color={p.color}>
          {p.mark ?? ""}
        </Label>
      </Billboard>
      {h > 9 && (
        <mesh position-y={h + 2.6}>
          <cylinderGeometry args={[0.04, 0.06, 2.2, 4]} />
          <Glow color={p.color} intensity={3} />
        </mesh>
      )}
      {/* entrance + name plate */}
      <mesh position={[0, 0.9, w / 2 + 0.01]}>
        <planeGeometry args={[1.2, 1.8]} />
        <Glow color={p.color} intensity={1.4} />
      </mesh>
    </group>
  );
}

function Cabinet({ p }: { p: Place }) {
  if (p.size === 0) {
    // apps: a giant phone standing on a plinth
    return (
      <group>
        <mesh position-y={0.15} castShadow>
          <boxGeometry args={[1.4, 0.3, 0.8]} />
          <meshStandardMaterial color={STONE} />
        </mesh>
        <group position-y={1.55}>
          <mesh castShadow>
            <boxGeometry args={[1.25, 2.4, 0.16]} />
            <meshStandardMaterial color="#0c0e12" metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh position-z={0.085}>
            <planeGeometry args={[1.08, 2.15]} />
            <Glow color={p.color} intensity={0.55} />
          </mesh>
          <Label position={[0, 0.35, 0.1]} size={0.42} color="#0b0d10">
            {p.mark ?? ""}
          </Label>
          <Label position={[0, -0.25, 0.1]} size={0.11} color="#0b0d10" maxWidth={0.95}>
            {p.title}
          </Label>
        </group>
      </group>
    );
  }
  // games: arcade cabinet
  return (
    <group>
      <mesh position-y={1} castShadow>
        <boxGeometry args={[1.2, 2, 0.95]} />
        <meshStandardMaterial color="#1b1530" flatShading />
      </mesh>
      <mesh position={[0, 1.45, 0.42]} rotation-x={-0.25}>
        <planeGeometry args={[0.95, 0.75]} />
        <Glow color={p.color} intensity={1.2} />
      </mesh>
      <Label position={[0, 1.47, 0.47]} size={0.26} color="#0b0d10">
        {p.mark ?? ""}
      </Label>
      <mesh position={[0, 0.95, 0.6]} rotation-x={-0.9}>
        <boxGeometry args={[1.1, 0.35, 0.08]} />
        <meshStandardMaterial color="#2a2142" />
      </mesh>
      {[-0.25, 0, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 1.03, 0.62]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <Glow color={[p.color, "#ffffff", p.color][i]} />
        </mesh>
      ))}
      <mesh position={[0, 2.15, 0.1]}>
        <boxGeometry args={[1.3, 0.35, 0.8]} />
        <Glow color={p.color} intensity={1.6} />
      </mesh>
      <Label position={[0, 2.15, 0.51]} size={0.12} color="#0b0d10" maxWidth={1.2}>
        {p.title.toUpperCase()}
      </Label>
    </group>
  );
}

function Kiosk({ p }: { p: Place }) {
  const ring = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.y += dt * 0.4;
  });
  return (
    <group>
      <mesh position-y={0.25} receiveShadow>
        <cylinderGeometry args={[3, 3.3, 0.5, 12]} />
        <meshStandardMaterial color={STONE} flatShading />
      </mesh>
      <mesh position-y={0.5} castShadow>
        <sphereGeometry args={[2.3, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#231a35" flatShading metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position-y={0.5}>
        <sphereGeometry args={[2.36, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color={p.color} wireframe toneMapped={false} transparent opacity={0.55} />
      </mesh>
      <group ref={ring} position-y={4}>
        {["IYGROUP", "STUDIO", "IYGROUP", "STUDIO"].map((t, i) => (
          <group key={i} rotation-y={(i * Math.PI) / 2}>
            <Label position={[0, 0, 2.4]} size={0.55} color={p.color}>
              {t}
            </Label>
          </group>
        ))}
      </group>
      <Label position={[0, 3.1, 0]} size={0.22} color="#eceef0">
        {"Software with a little more soul."}
      </Label>
    </group>
  );
}

function Crystal({ p }: { p: Place }) {
  const ref = useRef<Group>(null);
  const phase = useMemo(() => Math.random() * 10, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.6 + phase;
    ref.current.position.y = 2.4 + Math.sin(clock.elapsedTime * 1.4 + phase) * 0.2;
  });
  return (
    <group>
      <mesh position-y={0.35} castShadow>
        <cylinderGeometry args={[0.7, 0.9, 0.7, 6]} />
        <meshStandardMaterial color={STONE} flatShading />
      </mesh>
      <group ref={ref}>
        <mesh castShadow scale={[1, 1.6, 1]}>
          <octahedronGeometry args={[p.size * 0.7, 0]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={0.8}
            flatShading
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </mesh>
      </group>
      <Billboard position-y={4.6}>
        <Label size={0.42} color={p.color}>
          {p.title}
        </Label>
      </Billboard>
    </group>
  );
}

function HQ({ p }: { p: Place }) {
  const night = useUI((s) => s.night);
  const h = p.size;
  const tex1 = useWindows(3, Math.round((h * 0.6) / 1.4));
  const tex2 = useWindows(2, Math.round((h * 0.4) / 1.4));
  const mat = (t: CanvasTexture) => (
    <meshStandardMaterial
      color="#77818c"
      metalness={0.9}
      roughness={0.18}
      emissive={p.color}
      emissiveMap={t}
      emissiveIntensity={night ? 1.7 : 0.4}
      envMapIntensity={1.3}
    />
  );
  return (
    <group>
      <mesh position-y={0.2} receiveShadow>
        <boxGeometry args={[7, 0.4, 6]} />
        <meshStandardMaterial color={STONE} />
      </mesh>
      <mesh position-y={0.4 + (h * 0.6) / 2} castShadow>
        <boxGeometry args={[5, h * 0.6, 4.4]} />
        {mat(tex1)}
      </mesh>
      <mesh position-y={0.4 + h * 0.6 + (h * 0.4) / 2} castShadow>
        <boxGeometry args={[3.4, h * 0.4, 3]} />
        {mat(tex2)}
      </mesh>
      <mesh position-y={0.4 + h + 0.05}>
        <boxGeometry args={[3.5, 0.1, 3.1]} />
        <Glow color={p.color} />
      </mesh>
      <group position={[0, 0.4 + h * 0.6 - 0.6, 2.21]}>
        <mesh>
          <planeGeometry args={[4.6, 0.9]} />
          <meshBasicMaterial color="#0b0d10" />
        </mesh>
        <Label position={[0, 0, 0.01]} size={0.5} color={p.color}>
          {p.title.toUpperCase()}
        </Label>
      </group>
      <mesh position={[0, 1.4, 2.21]}>
        <planeGeometry args={[1.6, 2]} />
        <Glow color={p.color} intensity={1.2} />
      </mesh>
      {p.tags?.includes("Current") && <Beacon y={0.4 + h + 0.1} color={p.color} />}
    </group>
  );
}

function Beacon({ y, color }: { y: number; color: string }) {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.scale.setScalar(0.8 + (Math.sin(clock.elapsedTime * 3) + 1) * 0.3);
  });
  return (
    <mesh ref={ref} position-y={y + 0.4}>
      <sphereGeometry args={[0.3, 12, 12]} />
      <Glow color={color} intensity={4} />
    </mesh>
  );
}

function FramePicture({ src }: { src: string }) {
  const tex = useTexture(src);
  tex.colorSpace = SRGBColorSpace;
  const img = tex.image as { width: number; height: number } | undefined;
  const aspect = img ? img.width / img.height : 1.4;
  const w = aspect >= 1 ? 1.7 : 1.7 * aspect;
  const h = aspect >= 1 ? 1.7 / aspect : 1.7;
  return (
    <mesh position-z={0.04}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function Frame({ p }: { p: Place }) {
  return (
    <group>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0.75, -0.1]} rotation-x={0.08} castShadow>
          <boxGeometry args={[0.07, 1.6, 0.07]} />
          <meshStandardMaterial color="#3a2f22" />
        </mesh>
      ))}
      <group position-y={2.05} rotation-x={-0.08}>
        <mesh castShadow>
          <boxGeometry args={[1.95, 1.95, 0.06]} />
          <meshStandardMaterial color="#1a1d22" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position-z={0.032}>
          <planeGeometry args={[1.85, 1.85]} />
          <meshStandardMaterial color="#f4f1ea" />
        </mesh>
        <Suspense fallback={null}>{p.image && <FramePicture src={p.image} />}</Suspense>
      </group>
      {/* printed caption plaque */}
      <group position={[0, 0.88, 0.02]} rotation-x={-0.08}>
        <mesh>
          <boxGeometry args={[1.9, 0.26, 0.04]} />
          <meshStandardMaterial color="#f4efe5" roughness={0.85} />
        </mesh>
        <Text font={FONT} fontSize={0.075} color="#1f1b16" anchorX="center" anchorY="middle" maxWidth={1.75} position-z={0.025}>
          {p.title}
        </Text>
      </group>
    </group>
  );
}

function BillboardSign({ p }: { p: Place }) {
  return (
    <group>
      {[-2.1, 2.1].map((x) => (
        <mesh key={x} position={[x, 1.6, -0.1]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 3.2, 6]} />
          <meshStandardMaterial color={STONE} />
        </mesh>
      ))}
      <group position-y={3.6}>
        <mesh castShadow>
          <boxGeometry args={[5, 3, 0.2]} />
          <meshStandardMaterial color="#0e1116" />
        </mesh>
        {[
          [0, 1.52, 5.04, 0.06],
          [0, -1.52, 5.04, 0.06],
          [-2.52, 0, 0.06, 3.04],
          [2.52, 0, 0.06, 3.04],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0.11]}>
            <planeGeometry args={[w, h]} />
            <Glow color={p.color} />
          </mesh>
        ))}
        <group position-z={0.12}>
          <Label position={[0, 1.05, 0]} size={0.17} color={p.color} maxWidth={4.5}>
            {p.eyebrow.toUpperCase()}
          </Label>
          <Label position={[0, 0.2, 0]} size={0.3} maxWidth={4.4}>
            {p.title}
          </Label>
          <Label position={[0, -0.9, 0]} size={0.15} color="#8b929b" maxWidth={4.4}>
            {"MEDIUM  ·  [ E ] READ"}
          </Label>
        </group>
      </group>
    </group>
  );
}

function Hall({ p }: { p: Place }) {
  const s = p.size / 4;
  const w = 5 * s + 1;
  const h = 2.2 * s + 1;
  const roof = useMemo(() => new Color(p.color).multiplyScalar(0.35), [p.color]);
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.1 + i * 0.18, 0.4 - i * 0.15]} receiveShadow>
          <boxGeometry args={[w + 0.8 - i * 0.3, 0.2, 3.6 - i * 0.3]} />
          <meshStandardMaterial color="#d9d3c7" />
        </mesh>
      ))}
      <mesh position={[0, 0.5 + h / 2, -0.4]} castShadow>
        <boxGeometry args={[w - 0.4, h, 2.2]} />
        <meshStandardMaterial color="#ebe5d8" flatShading />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[(-0.5 + i / 4) * (w - 1), 0.5 + h / 2, 0.95]} castShadow>
          <cylinderGeometry args={[0.13, 0.15, h, 8]} />
          <meshStandardMaterial color="#f5f0e6" />
        </mesh>
      ))}
      <mesh position={[0, 0.5 + h + 0.55, 0.1]} rotation={[Math.PI / 2, 0, Math.PI / 2]} scale={[1, w / 2.2, 1]} castShadow>
        <cylinderGeometry args={[1.1, 1.1, 2.0, 3]} />
        <meshStandardMaterial color={roof} flatShading />
      </mesh>
      <Billboard position-y={0.5 + h + 2.2}>
        <Label size={0.36} color={p.color}>
          {p.title.split(",")[0]}
        </Label>
        <Label position={[0, -0.4, 0]} size={0.16} color="#c4c9cf">
          {p.eyebrow.split(" · ")[1] ?? ""}
        </Label>
      </Billboard>
    </group>
  );
}

/** Whitewashed lighthouse with red bands; the lamp sweeps at night. */
function Radio({ p }: { p: Place }) {
  const beam = useRef<Group>(null);
  const lamp = useRef<Mesh>(null);
  const night = useUI((s) => s.night);
  useFrame((_, dt) => {
    if (beam.current) beam.current.rotation.y += dt * 0.9;
  });
  const H = 15;
  const bands = [0.22, 0.52, 0.82];
  return (
    <group>
      <mesh position-y={0.3} receiveShadow castShadow>
        <cylinderGeometry args={[3.3, 3.6, 0.6, 24]} />
        <meshStandardMaterial color="#cfc6b6" roughness={0.95} />
      </mesh>
      <mesh position-y={H / 2 + 0.6} castShadow receiveShadow>
        <cylinderGeometry args={[1.45, 2.3, H, 32]} />
        <meshStandardMaterial color="#f2efe8" roughness={0.75} />
      </mesh>
      {bands.map((b) => {
        const r = 2.3 - (2.3 - 1.45) * b;
        return (
          <mesh key={b} position-y={0.6 + H * b}>
            <cylinderGeometry args={[r + 0.05, r + 0.13, 1.4, 32]} />
            <meshStandardMaterial color="#b3202a" roughness={0.7} />
          </mesh>
        );
      })}
      {/* gallery + lantern room */}
      <mesh position-y={H + 0.75}>
        <cylinderGeometry args={[2.0, 2.0, 0.25, 32]} />
        <meshStandardMaterial color="#2b2824" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position-y={H + 1.9}>
        <cylinderGeometry args={[1.15, 1.15, 2.0, 16, 1, true]} />
        <meshPhysicalMaterial color="#d9f0ff" metalness={0.1} roughness={0.05} transparent opacity={0.35} />
      </mesh>
      <mesh ref={lamp} position-y={H + 1.9}>
        <sphereGeometry args={[0.45, 16, 12]} />
        <meshStandardMaterial color="#fff6d8" emissive="#ffe6a3" emissiveIntensity={night ? 12 : 1.5} toneMapped={false} />
      </mesh>
      <mesh position-y={H + 3.3} castShadow>
        <coneGeometry args={[1.45, 1.2, 16]} />
        <meshStandardMaterial color="#b3202a" roughness={0.6} />
      </mesh>
      {night && (
        <group ref={beam} position-y={H + 1.9}>
          {[0, Math.PI].map((r) => (
            <mesh key={r} rotation={[0, r, Math.PI / 2]} position={[Math.cos(r) * 14, 0, -Math.sin(r) * 14]}>
              <coneGeometry args={[3.5, 28, 24, 1, true]} />
              <meshBasicMaterial color="#fff3cf" transparent opacity={0.12} depthWrite={false} toneMapped={false} side={2} />
            </mesh>
          ))}
        </group>
      )}
      {/* keeper's cottage */}
      <group position={[6.2, 0, -1]}>
        <CuboidCollider args={[2, 1.6, 1.7]} position-y={1.6} />
        <mesh position-y={1.6} castShadow receiveShadow>
          <boxGeometry args={[4, 3.2, 3.4]} />
          <meshStandardMaterial color="#efe9de" roughness={0.85} />
        </mesh>
        <mesh position-y={3.65} rotation-y={Math.PI / 4} castShadow>
          <coneGeometry args={[3.2, 1.6, 4]} />
          <meshStandardMaterial color="#a4482f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.1, 1.71]}>
          <planeGeometry args={[0.9, 2]} />
          <meshStandardMaterial color="#2f4f6a" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

const KINDS: Record<Place["kind"], (props: { p: Place }) => ReactNode> = {
  monolith: Monolith,
  stat: Stat,
  tower: Tower,
  cabinet: Cabinet,
  kiosk: Kiosk,
  crystal: Crystal,
  hq: HQ,
  frame: Frame,
  billboard: BillboardSign,
  hall: Hall,
  radio: Radio,
};

function Landmark({ p }: { p: Place }) {
  const focused = useUI((s) => s.nearby === p.id);
  const Kind = KINDS[p.kind];
  const sign = signFor(p);
  return (
    <group
      position={[p.x, p.y, p.z]}
      rotation-y={p.rotY}
    >
      <Kind p={p} />
      {/* fixed collider so people and cars stop at the building */}
      {p.kind !== "frame" && <CylinderCollider args={[3, p.radius]} position-y={3} />}
      {sign && <Placard place={p} {...sign} />}
      {focused && <FocusRing radius={p.radius} color={p.color} />}
    </group>
  );
}

export function Landmarks() {
  return (
    <>
      {places.map((p) => (
        <Landmark key={p.id} p={p} />
      ))}
    </>
  );
}

/** A road-sign plate at each district entrance plus a floating name for wayfinding. */
export function DistrictMarkers() {
  return (
    <>
      {districts.map((dist) => {
        // sign stands beside the drive, facing the road
        const sx = dist.x - dist.ux * (dist.radius + 2) - dist.uz * 6;
        const sz = dist.z - dist.uz * (dist.radius + 2) + dist.ux * 6;
        const yaw = Math.atan2(-dist.ux, -dist.uz);
        return (
          <group key={dist.id}>
            <group position={[sx, dist.y, sz]} rotation-y={yaw}>
              {[-1.1, 1.1].map((x) => (
                <mesh key={x} position={[x, 1.4, 0]} castShadow>
                  <cylinderGeometry args={[0.06, 0.06, 2.8, 8]} />
                  <meshStandardMaterial color="#8d939a" metalness={0.8} roughness={0.35} />
                </mesh>
              ))}
              <mesh position-y={2.7} castShadow>
                <boxGeometry args={[2.8, 1.0, 0.06]} />
                <meshStandardMaterial color="#1f4a3a" roughness={0.5} />
              </mesh>
              <mesh position={[0, 2.7, 0.032]}>
                <planeGeometry args={[2.7, 0.9]} />
                <meshStandardMaterial color="#1f4a3a" roughness={0.5} />
              </mesh>
              <mesh position={[-1.22, 2.7, 0.04]}>
                <planeGeometry args={[0.1, 0.7]} />
                <meshStandardMaterial color={dist.color} roughness={0.6} />
              </mesh>
              <Text font={FONT} fontSize={0.26} color="#f4f1e8" anchorX="center" anchorY="middle" position={[0.05, 2.82, 0.04]} maxWidth={2.4}>
                {dist.name}
              </Text>
              <Text font={FONT} fontSize={0.13} color="#cfd8d2" anchorX="center" anchorY="middle" position={[0.05, 2.5, 0.04]} maxWidth={2.4}>
                {dist.blurb}
              </Text>
            </group>
            <Billboard position={[dist.x, dist.y + (dist.id === "plaza" ? 13 : 17), dist.z]}>
              <Label size={1.5} color="#f4f1e8">
                {dist.name}
              </Label>
            </Billboard>
          </group>
        );
      })}
    </>
  );
}
