"use client";

import { Environment, Stars } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { CylinderCollider, Physics, RigidBody } from "@react-three/rapier";
import { ToneMappingMode } from "postprocessing";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, type DirectionalLight, type Fog, type Group, type HemisphereLight, type PointLight } from "three";
import { Balloons, Birds, FerrisWheel, Fireworks, Postcards, Ramps } from "./attractions";
import { groundHeight } from "./island";
import { DataBoards, DistrictMarkers, Landmarks } from "./landmarks";
import { Nature, lamps, nightMix } from "./nature";
import { districts, toWorld } from "./places";
import { DrivableCar } from "./cars";
import { PlayerRig } from "./player";
import { player, useUI } from "./store";
import { Boundary, DistantIslands, Harbour, Pads, Road, Sea, Terrain, usePBR } from "./terrain";

const DAY_FOG = new Color("#c9d6df");
const NIGHT_FOG = new Color("#0a1020");

/* ───────────────────────── loose props ───────────────────────── */

/** Crates, barrels and cones you can knock over on foot or by car. */
function Props() {
  const pbr = usePBR();
  const wood = useMemo(() => pbr("planks", [1, 1]), [pbr]);
  const crates = useMemo(() => {
    const out: { x: number; y: number; z: number }[] = [];
    const base = toWorld("plaza", -9, 7);
    const y0 = groundHeight(base.x, base.z);
    for (let layer = 0; layer < 3; layer++)
      for (let i = 0; i < 3 - layer; i++)
        out.push({ x: base.x + (i - (2 - layer) / 2) * 1.05, y: y0 + 0.5 + layer * 1.0, z: base.z });
    return out;
  }, []);
  const barrels = useMemo(
    () =>
      [-2, 0, 2].map((dx) => {
        const p = toWorld("plaza", 9 + dx * 0.6, 8 + dx);
        return { ...p, y: groundHeight(p.x, p.z) + 0.6 };
      }),
    [],
  );
  const cones = useMemo(() => {
    const career = districts.find((d) => d.id === "career")!;
    return Array.from({ length: 6 }, (_, i) => {
      const p = toWorld("career", -7 + i * 2.8, -(career.radius - 3));
      return { ...p, y: groundHeight(p.x, p.z) + 0.4 };
    });
  }, []);
  return (
    <>
      {crates.map((c, i) => (
        <RigidBody key={`c${i}`} position={[c.x, c.y, c.z]} colliders="cuboid" mass={25} friction={0.8}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial {...wood} roughness={1} />
          </mesh>
        </RigidBody>
      ))}
      {barrels.map((b, i) => (
        <RigidBody key={`b${i}`} position={[b.x, b.y, b.z]} colliders={false} mass={40}>
          <CylinderCollider args={[0.55, 0.38]} />
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.38, 1.1, 20]} />
            <meshStandardMaterial color="#2f5d7a" metalness={0.6} roughness={0.45} />
          </mesh>
          {[-0.4, 0.4].map((y) => (
            <mesh key={y} position-y={y}>
              <torusGeometry args={[0.385, 0.025, 6, 24]} />
              <meshStandardMaterial color="#c9ced4" metalness={0.9} roughness={0.3} />
            </mesh>
          ))}
        </RigidBody>
      ))}
      {cones.map((c, i) => (
        <RigidBody key={`k${i}`} position={[c.x, c.y, c.z]} colliders={false} mass={3}>
          <CylinderCollider args={[0.36, 0.22]} />
          <mesh castShadow>
            <coneGeometry args={[0.24, 0.72, 20]} />
            <meshStandardMaterial color="#f06a2a" roughness={0.6} />
          </mesh>
          <mesh position-y={0.02}>
            <cylinderGeometry args={[0.15, 0.19, 0.12, 20]} />
            <meshStandardMaterial color="#f4f1e8" roughness={0.6} />
          </mesh>
          <mesh position-y={-0.34}>
            <boxGeometry args={[0.5, 0.04, 0.5]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}

/** Every car on the island is a real, drivable vehicle. The red one waits beside you. */
const CARS: [string, string][] = [
  ["career", "#e9eaec"],
  ["gallery", "#1d3557"],
  ["work", "#f2b134"],
  ["campus", "#2f4f3a"],
];

function Cars() {
  const plaza = districts[0];
  // parked on the square beside the spawn point, nose toward the road
  const home = { x: plaza.x + plaza.uz * 6 - plaza.ux * 2, z: plaza.z - plaza.ux * 6 - plaza.uz * 2 };
  return (
    <>
      <DrivableCar id="red" x={home.x} z={home.z} yaw={Math.atan2(-plaza.ux, -plaza.uz)} paint="#b3121b" />
      {CARS.map(([id, paint]) => {
        const d = districts.find((x) => x.id === id)!;
        const p = toWorld(d.id, d.radius - 4, -(d.radius - 5));
        return <DrivableCar key={id} id={id} x={p.x} z={p.z} yaw={Math.atan2(d.ux, d.uz)} paint={paint} />;
      })}
    </>
  );
}

/* ───────────────────────── day / night ───────────────────────── */

function DayNight({
  sun,
  hemi,
  stars,
}: {
  sun: React.RefObject<DirectionalLight | null>;
  hemi: React.RefObject<HemisphereLight | null>;
  stars: React.RefObject<Group | null>;
}) {
  const night = useUI((s) => s.night);
  const scene = useThree((s) => s.scene);
  const lights = useRef<(PointLight | null)[]>([]);
  const lastPick = useRef(0);

  useFrame(({ clock }, dt) => {
    nightMix.v += ((night ? 1 : 0) - nightMix.v) * (1 - Math.exp(-dt * 1.4));
    const m = nightMix.v;
    scene.backgroundIntensity = 1 - m * 0.97;
    scene.environmentIntensity = 1 - m * 0.95;
    if (sun.current) {
      sun.current.intensity = 3.4 * (1 - m) + 0.12 * m;
      sun.current.color.setRGB(1 - m * 0.4, 0.93 - m * 0.2, 0.82 + m * 0.18);
    }
    if (hemi.current) hemi.current.intensity = 0.35 * (1 - m) + 0.05 * m;
    if (scene.fog) (scene.fog as Fog).color.lerpColors(DAY_FOG, NIGHT_FOG, m);
    if (stars.current) stars.current.visible = m > 0.35;

    // a handful of real lights follow the street lamps nearest the player
    if (clock.elapsedTime - lastPick.current > 0.5) {
      lastPick.current = clock.elapsedTime;
      const near = [...lamps]
        .sort((a, b) => Math.hypot(a.x - player.x, a.z - player.z) - Math.hypot(b.x - player.x, b.z - player.z))
        .slice(0, lights.current.length);
      near.forEach((l, i) => lights.current[i]?.position.set(l.x + Math.sin(l.yaw) * 1.3, l.y + 5, l.z + Math.cos(l.yaw) * 1.3));
    }
    for (const l of lights.current) if (l) l.intensity = m * 90;
  });

  return (
    <>
      {Array.from({ length: 4 }, (_, i) => (
        <pointLight key={i} ref={(l) => void (lights.current[i] = l)} color="#ffc983" distance={22} decay={1.6} intensity={0} />
      ))}
    </>
  );
}

/* ───────────────────────── scene ───────────────────────── */

export function Scene({ quality }: { quality: "high" | "low" }) {
  const sun = useRef<DirectionalLight>(null);
  const hemi = useRef<HemisphereLight>(null);
  const stars = useRef<Group>(null);
  const night = useUI((s) => s.night);
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    if (sun.current) scene.add(sun.current.target);
  }, [scene]);

  return (
    <>
      {/* real sky: the HDRI is both the backdrop and the light */}
      <Environment files="/textures/sky.hdr" background backgroundRotation={[0, 1.2, 0]} environmentRotation={[0, 1.2, 0]} />
      <group ref={stars} visible={false}>
        <Stars radius={600} depth={80} count={6000} factor={6} saturation={0.15} fade speed={0.4} />
      </group>
      <fog attach="fog" args={["#c9d6df", 160, 900]} />
      <hemisphereLight ref={hemi} args={["#cfe2ff", "#7a6a50", 0.35]} />
      <directionalLight
        ref={sun}
        color="#fff0d6"
        intensity={3.4}
        castShadow
        shadow-mapSize={quality === "high" ? [2048, 2048] : [1024, 1024]}
        shadow-camera-near={10}
        shadow-camera-far={400}
        shadow-bias={-0.0003}
        shadow-normalBias={0.05}
      />
      <DayNight sun={sun} hemi={hemi} stars={stars} />

      <Sea />
      <DistantIslands />

      <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60} interpolate>
        <Terrain />
        <Road />
        <Pads />
        <Harbour />
        <Nature />
        <Landmarks />
        <DistrictMarkers />
        <DataBoards />
        <Ramps />
        <FerrisWheel />
        <Props />
        <Cars />
        <Boundary />
        <PlayerRig sun={sun} />
      </Physics>

      <Balloons />
      <Birds />
      <Postcards />
      <Fireworks />

      {quality === "high" && (
        <EffectComposer multisampling={0}>
          <N8AO halfRes quality="performance" aoRadius={1.6} intensity={1.8} distanceFalloff={1} />
          <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.3} intensity={night ? 0.9 : 0.4} />
          <ToneMapping mode={ToneMappingMode.AGX} />
          <Vignette eskil={false} offset={0.35} darkness={0.35} />
          <SMAA />
        </EffectComposer>
      )}
    </>
  );
}
