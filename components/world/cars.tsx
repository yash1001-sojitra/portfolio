"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody, useBeforePhysicsStep, useRapier, type RapierRigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import { Color, MeshPhysicalMaterial, Vector3, type Group, type Mesh, type Object3D } from "three";
import { groundHeight } from "./island";
import { nightMix } from "./nature";

type PhysicsWorld = ReturnType<typeof useRapier>["world"];
export type Vehicle = ReturnType<PhysicsWorld["createVehicleController"]>;

useGLTF.preload("/models/ferrari.glb");

export const SUSP_REST = 0.3;
export const WHEEL_R = 0.36;

/** Parts only worth drawing up close: the cabin and fine trim are ~60% of the model's triangles. */
const NEAR_ONLY = /interior|leather|carpet|steering|nuts|centre|brake|carbon|wipers|yellow_trim|blue|leds|grills|metal$/i;
const MID_ONLY = /chrome|plastic_gray|trim$|lights_red|lights$/i;

type CarParts = { root: Group; wheels: Object3D[]; base: Vector3[]; near: Mesh[]; mid: Mesh[]; tail: MeshPhysicalMaterial[] };

/** Clones the Ferrari, repaints it and turns it so +Z is forward (the file faces −Z). */
function useFerrari(paint: string): CarParts {
  const { scene } = useGLTF("/models/ferrari.glb");
  return useMemo(() => {
    const model = scene.clone(true);
    const near: Mesh[] = [];
    const mid: Mesh[] = [];
    const tail: MeshPhysicalMaterial[] = [];
    model.traverse((o) => {
      const m = o as Mesh;
      if (!m.isMesh) return;
      const mat = m.material as MeshPhysicalMaterial;
      const name = `${m.name} ${m.parent?.name ?? ""}`;
      if (mat?.name === "Body_Color" || m.name === "body") {
        m.material = new MeshPhysicalMaterial({
          color: new Color(paint),
          metalness: 0.6,
          roughness: 0.24,
          clearcoat: 1,
          clearcoatRoughness: 0.04,
        });
      } else if (mat?.name === "Taillight_Glass") {
        const t = (mat as MeshPhysicalMaterial).clone();
        t.emissive = new Color("#ff1a1a");
        t.emissiveIntensity = 0;
        m.material = t;
        tail.push(t);
      }
      // only the shell and tyres cast shadows; the cabin is hidden by them anyway
      m.castShadow = /body|tire|wheel/.test(m.name) && !/steering/.test(name);
      m.receiveShadow = false;
      if (NEAR_ONLY.test(m.name)) near.push(m);
      else if (MID_ONLY.test(m.name)) mid.push(m);
    });
    const root = new (model.constructor as typeof Group)();
    model.rotation.y = Math.PI;
    root.add(model);
    // wheel order: front-left, front-right, rear-left, rear-right
    const wheels = ["wheel_fr", "wheel_fl", "wheel_rr", "wheel_rl"].map((n) => model.getObjectByName(n)!);
    const base = wheels.map((w) => w.position.clone());
    wheels.forEach((w) => (w.rotation.order = "YXZ"));
    return { root, wheels, base, near, mid, tail };
  }, [scene, paint]);
}

/* ───────────────────────── registry ───────────────────────── */

export type Car = {
  id: string;
  body: RapierRigidBody;
  vehicle: Vehicle;
  /** set by the driver each frame; parked cars hold the handbrake */
  control: { engine: number; brake: number; steer: number; braking: boolean };
};

/** Every drivable car in the world, by id. */
export const cars = new Map<string, Car>();
/** Id of the car the player is driving, if any. */
export const driving = { id: null as string | null };

const _p = new Vector3();

/** A Ferrari with its own raycast-vehicle physics. Any of them can be driven. */
export function DrivableCar({ id, x, z, yaw, paint }: { id: string; x: number; z: number; yaw: number; paint: string }) {
  const { world } = useRapier();
  const parts = useFerrari(paint);
  const body = useRef<RapierRigidBody>(null);
  const vehicle = useRef<Vehicle | null>(null);
  const lod = useRef({ last: 0, level: -1 });
  const y = useMemo(() => groundHeight(x, z) + 0.5, [x, z]);

  useEffect(() => {
    const b = body.current;
    if (!b) return;
    const v = world.createVehicleController(b);
    v.indexUpAxis = 1;
    v.setIndexForwardAxis = 2;
    // hub positions in the +Z-forward frame (the model is turned 180°)
    parts.base.forEach((p) => {
      v.addWheel({ x: -p.x, y: p.y + SUSP_REST, z: -p.z }, { x: 0, y: -1, z: 0 }, { x: -1, y: 0, z: 0 }, SUSP_REST, WHEEL_R);
    });
    for (let i = 0; i < 4; i++) {
      v.setWheelSuspensionStiffness(i, 32);
      v.setWheelSuspensionCompression(i, 4.4);
      v.setWheelSuspensionRelaxation(i, 2.8);
      v.setWheelMaxSuspensionTravel(i, 0.24);
      v.setWheelMaxSuspensionForce(i, 2e5);
      v.setWheelFrictionSlip(i, i < 2 ? 2.6 : 2.4);
      v.setWheelSideFrictionStiffness(i, 1.25);
    }
    vehicle.current = v;
    const car: Car = { id, body: b, vehicle: v, control: { engine: 0, brake: 30, steer: 0, braking: false } };
    cars.set(id, car);
    return () => {
      cars.delete(id);
      world.removeVehicleController(v);
      vehicle.current = null;
    };
  }, [world, parts, id]);

  useBeforePhysicsStep((w) => {
    const v = vehicle.current;
    const car = cars.get(id);
    if (!v || !car) return;
    const c = car.control;
    if (driving.id !== id) {
      c.engine = 0;
      c.brake = 30;
      c.steer *= 0.9;
    }
    v.setWheelEngineForce(2, c.engine);
    v.setWheelEngineForce(3, c.engine);
    for (let i = 0; i < 4; i++) v.setWheelBrake(i, c.brake);
    v.setWheelSteering(0, c.steer);
    v.setWheelSteering(1, c.steer);
    v.updateVehicle(w.timestep);
  });

  useFrame(({ camera, clock }) => {
    const v = vehicle.current;
    const b = body.current;
    if (!v || !b) return;
    // wheels: suspension travel, spin and steering from the controller
    parts.wheels.forEach((w, i) => {
      const len = v.wheelSuspensionLength(i) ?? SUSP_REST;
      const p = parts.base[i];
      w.position.set(p.x, p.y + (SUSP_REST - len), p.z);
      w.rotation.set(-(v.wheelRotation(i) ?? 0), i < 2 ? (v.wheelSteering(i) ?? 0) : 0, 0);
    });
    const car = cars.get(id);
    const glow = car?.control.braking ? 4 : driving.id === id ? 0.6 + nightMix.v * 1.4 : nightMix.v * 0.3;
    for (const t of parts.tail) t.emissiveIntensity = glow;

    // level of detail by distance to the camera, checked a few times a second
    if (clock.elapsedTime - lod.current.last > 0.25) {
      lod.current.last = clock.elapsedTime;
      const t = b.translation();
      const d = camera.position.distanceTo(_p.set(t.x, t.y, t.z));
      const level = d < 18 ? 0 : d < 70 ? 1 : 2;
      if (level !== lod.current.level) {
        lod.current.level = level;
        for (const m of parts.near) m.visible = level === 0;
        for (const m of parts.mid) m.visible = level <= 1;
      }
    }
  });

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={[x, y, z]}
      rotation={[0, yaw, 0]}
      canSleep={false}
      linearDamping={0.04}
      angularDamping={0.9}
      ccd
    >
      {/* shell */}
      <CuboidCollider args={[0.94, 0.28, 2.18]} position={[0, 0.7, 0]} mass={950} friction={0.5} restitution={0.05} />
      {/* low ballast keeps the centre of mass under the floor, like a real mid-engine car */}
      <CuboidCollider args={[0.7, 0.08, 1.3]} position={[0, 0.34, -0.2]} mass={550} friction={0.5} />
      <primitive object={parts.root} />
    </RigidBody>
  );
}
