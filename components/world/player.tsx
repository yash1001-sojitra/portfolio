"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier, type RapierCollider, type RapierRigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import { Euler, Quaternion, Vector3, type DirectionalLight, type Fog, type Group, type Mesh, type Object3D, type PerspectiveCamera, type SpotLight } from "three";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import { cars, driving, type Car } from "./cars";
import { groundHeight } from "./island";
import { nightMix } from "./nature";
import { arrival, districts, places, postcards, type DistrictId } from "./places";
import { input, isPaused, loadCollected, player, saveCollected, ui } from "./store";
import { SUN_DIR } from "./terrain";

type PhysicsWorld = ReturnType<typeof useRapier>["world"];
type KinematicCharacterController = ReturnType<PhysicsWorld["createCharacterController"]>;

useGLTF.preload("/models/soldier.glb");

function angleLerp(a: number, b: number, t: number) {
  const d = Math.atan2(Math.sin(b - a), Math.cos(b - a));
  return a + d * t;
}

/** Horizontal distance from (x, z) toward the camera at which a landmark blocks the view, or null. */
function occlusion(x: number, z: number, yaw: number, len: number) {
  const dx = Math.sin(yaw);
  const dz = Math.cos(yaw);
  let best: number | null = null;
  for (const pl of places) {
    if (pl.kind === "frame" || pl.kind === "cabinet" || pl.kind === "stat") continue;
    const ox = pl.x - x;
    const oz = pl.z - z;
    const along = ox * dx + oz * dz;
    if (along <= 0 || along > len + pl.radius) continue;
    const perp = Math.abs(ox * dz - oz * dx);
    const r = pl.radius + 0.4;
    if (perp >= r) continue;
    const hit = along - Math.sqrt(r * r - perp * perp);
    if (hit > 0 && hit < len && (best === null || hit < best)) best = hit;
  }
  return best;
}

const _cam = new Vector3();
const _look = new Vector3();
const _q = new Quaternion();
const _e = new Euler();
const _up = new Vector3();

function poseOf(car: Car) {
  const t = car.body.translation();
  const r = car.body.rotation();
  _q.set(r.x, r.y, r.z, r.w);
  _e.setFromQuaternion(_q, "YXZ");
  return { x: t.x, y: t.y, z: t.z, yaw: _e.y, up: _up.set(0, 1, 0).applyQuaternion(_q).y };
}

function nearestCar(x: number, z: number, within: number) {
  let best: Car | null = null;
  let bd = within;
  for (const c of cars.values()) {
    const t = c.body.translation();
    const d = Math.hypot(t.x - x, t.z - z);
    if (d < bd) {
      bd = d;
      best = c;
    }
  }
  return best;
}

/* ───────────────────────── player rig ───────────────────────── */

export function PlayerRig({ sun }: { sun: React.RefObject<DirectionalLight | null> }) {
  const { world, rapier } = useRapier();
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const scene = useThree((s) => s.scene);

  const soldier = useGLTF("/models/soldier.glb");
  const hero = useMemo(() => {
    const c = cloneSkinned(soldier.scene) as Group;
    c.traverse((o) => {
      if ((o as Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        (o as Mesh).frustumCulled = false;
      }
    });
    // the Mixamo rig faces −Z; turn it so it looks where it walks
    c.rotation.y = Math.PI;
    return c;
  }, [soldier.scene]);
  const heroGroup = useRef<Group>(null);
  const { actions } = useAnimations(soldier.animations, heroGroup);
  const current = useRef<"Idle" | "Walk" | "Run">("Idle");
  const heroBody = useRef<RapierRigidBody>(null);
  const heroCollider = useRef<RapierCollider>(null);
  const kcc = useRef<KinematicCharacterController | null>(null);
  const headlight = useRef<SpotLight>(null);
  const headTarget = useRef<Object3D>(null);

  const start = useMemo(() => arrival("plaza"), []);
  const state = useRef({
    heading: start.yaw + Math.PI,
    vy: 0,
    speed: 0,
    grounded: true,
    camYaw: start.yaw,
    camDist: input.zoom,
    intro: 0,
    snap: false,
    lastUi: 0,
    flipped: 0,
    up: 1,
  });

  useEffect(() => {
    actions.Idle?.reset().play();
    loadCollected();
    if (headlight.current && headTarget.current) headlight.current.target = headTarget.current;
  }, [actions]);

  useEffect(() => {
    const c = world.createCharacterController(0.02);
    c.setUp({ x: 0, y: 1, z: 0 });
    c.setMaxSlopeClimbAngle((48 * Math.PI) / 180);
    c.setMinSlopeSlideAngle((55 * Math.PI) / 180);
    c.enableAutostep(0.4, 0.2, true);
    c.enableSnapToGround(0.5);
    c.setApplyImpulsesToDynamicBodies(true);
    c.setCharacterMass(75);
    kcc.current = c;
    return () => {
      world.removeCharacterController(c);
      kcc.current = null;
    };
  }, [world]);

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    const st = state.current;
    const ui0 = ui.get();
    const paused = isPaused();
    const hb = heroBody.current;
    if (!hb) return;
    let car = driving.id ? (cars.get(driving.id) ?? null) : null;
    let heroT = hb.translation();

    /* get in / out of whichever car is closest */
    if (input.toggleCar) {
      input.toggleCar = false;
      if (car) {
        const pose = poseOf(car);
        if (Math.abs(car.vehicle.currentVehicleSpeed()) < 3) {
          const x = pose.x - Math.cos(pose.yaw) * 2;
          const z = pose.z + Math.sin(pose.yaw) * 2;
          const y = groundHeight(x, z) + 0.9;
          heroT = { x, y, z };
          hb.setTranslation(heroT, true);
          hb.setNextKinematicTranslation(heroT);
          st.heading = pose.yaw;
          st.vy = 0;
          st.speed = 0;
          car.control.braking = false;
          driving.id = null;
          car = null;
          ui.set({ driving: false, speed: 0 });
        }
      } else if (ui0.started) {
        const near = nearestCar(heroT.x, heroT.z, 3.8);
        if (near) {
          driving.id = near.id;
          car = near;
          ui.set({ driving: true, nearCar: false, nearby: null });
        }
      }
    }

    /* fast travel */
    if (input.teleport) {
      const a = arrival(input.teleport);
      const y = groundHeight(a.x, a.z);
      const d = districts.find((x) => x.id === input.teleport)!;
      const ryaw = Math.atan2(-d.uz, d.ux);
      if (car) {
        // cars arrive on the road at the district's entrance, pointing along the road
        const rx = d.x - d.ux * (d.radius + 6.6);
        const rz = d.z - d.uz * (d.radius + 6.6);
        car.body.setTranslation({ x: rx, y: groundHeight(rx, rz) + 0.6, z: rz }, true);
        car.body.setRotation(_q.setFromEuler(_e.set(0, ryaw, 0, "YXZ")), true);
        car.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        car.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      } else {
        heroT = { x: a.x, y: y + 0.95, z: a.z };
        hb.setTranslation(heroT, true);
        hb.setNextKinematicTranslation(heroT);
      }
      st.heading = car ? ryaw : a.yaw + Math.PI;
      input.look = 0;
      input.teleport = null;
      st.snap = true;
    }

    const throttle = paused ? 0 : input.forward;
    const turn = paused ? 0 : input.turn;
    let px: number;
    let py: number;
    let pz: number;
    let moving: number;
    let carSpeed = 0;

    if (car) {
      /* driving: rear-wheel drive, speed-sensitive steering */
      const pose = poseOf(car);
      carSpeed = car.vehicle.currentVehicleSpeed();
      const kmh = Math.abs(carSpeed) * 3.6;
      const top = input.run ? 220 : 160;
      const c = car.control;
      c.engine = 0;
      c.brake = 0;
      if (throttle > 0) {
        if (carSpeed < -0.8) c.brake = 60;
        else c.engine = kmh < top ? 5200 * (1 - (kmh / top) ** 2 * 0.6) : 0;
      } else if (throttle < 0) {
        if (carSpeed > 0.8) c.brake = 75;
        else c.engine = kmh < 30 ? -2600 : 0;
      } else c.brake = 2.5;
      if (input.brake && !paused) c.brake = Math.max(c.brake, 90);
      c.braking = c.brake > 10;
      const maxSteer = 0.6 / (1 + Math.abs(carSpeed) * 0.05);
      c.steer += (-turn * maxSteer - c.steer) * (1 - Math.exp(-dt * 7));

      // put it back on its wheels if it rolls over
      st.flipped = pose.up < 0.3 ? st.flipped + dt : 0;
      if (st.flipped > 1.2) {
        car.body.setTranslation({ x: pose.x, y: groundHeight(pose.x, pose.z) + 1.2, z: pose.z }, true);
        car.body.setRotation(_q.setFromEuler(_e.set(0, pose.yaw, 0, "YXZ")), true);
        car.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
        st.flipped = 0;
      }

      px = pose.x;
      py = pose.y;
      pz = pose.z;
      st.heading = pose.yaw;
      st.up = pose.up;
      moving = Math.abs(carSpeed);
      // keep the walker out of the way while driving
      hb.setNextKinematicTranslation({ x: px, y: -40, z: pz });

      // the one headlight follows the car being driven
      const hl = headlight.current;
      const ht = headTarget.current;
      if (hl && ht) {
        const s = Math.sin(pose.yaw);
        const co = Math.cos(pose.yaw);
        hl.position.set(px + s * 2.3, py + 0.75, pz + co * 2.3);
        ht.position.set(px + s * 18, py, pz + co * 18);
        ht.updateMatrixWorld();
        hl.intensity = nightMix.v * 340;
      }
    } else {
      /* walking: A/D turn, W/S along the facing; Rapier's controller handles slopes, steps and bumps */
      st.heading -= turn * (st.speed > 4 ? 2.3 : 2.8) * dt;
      const target = throttle > 0 ? (input.run ? 6.2 : 2.2) : throttle < 0 ? -1.6 : 0;
      st.speed += (target - st.speed) * (1 - Math.exp(-dt * 7));
      if (!paused && input.jump && st.grounded) st.vy = 5.2;
      input.jump = false;
      st.vy = Math.max(-30, st.vy - 18 * dt);
      const desired = {
        x: Math.sin(st.heading) * st.speed * dt,
        y: st.vy * dt,
        z: Math.cos(st.heading) * st.speed * dt,
      };
      let move = desired;
      const c = kcc.current;
      const col = heroCollider.current;
      if (c && col) {
        c.computeColliderMovement(col, desired);
        move = c.computedMovement();
        st.grounded = c.computedGrounded();
        if (st.grounded && st.vy < 0) st.vy = -1;
      }
      const nx = heroT.x + move.x;
      const nz = heroT.z + move.z;
      // safety net: never sink below the terrain surface
      const ny = Math.max(heroT.y + move.y, groundHeight(nx, nz) + 0.85);
      hb.setNextKinematicTranslation({ x: nx, y: ny, z: nz });
      px = heroT.x;
      py = heroT.y - 0.85;
      pz = heroT.z;
      moving = Math.abs(st.speed);
      if (headlight.current) headlight.current.intensity = 0;

      const want: "Idle" | "Walk" | "Run" = Math.abs(st.speed) < 0.3 ? "Idle" : Math.abs(st.speed) < 3.6 ? "Walk" : "Run";
      if (want !== current.current) {
        const from = actions[current.current];
        const to = actions[want];
        if (to) {
          to.reset().setEffectiveWeight(1).play();
          if (from) to.crossFadeFrom(from, 0.25, true);
        }
        current.current = want;
      }
      const a = actions[want];
      if (a) a.timeScale = want === "Walk" ? Math.max(0.6, Math.abs(st.speed) / 1.9) * Math.sign(st.speed || 1) : want === "Run" ? Math.abs(st.speed) / 6 : 1;
    }

    const hg = heroGroup.current;
    if (hg) {
      hg.visible = !car;
      hg.position.set(heroT.x, heroT.y - 0.85, heroT.z);
      hg.rotation.y = st.heading;
    }

    /* camera */
    const started = ui0.started;
    if (!started) {
      const t = clock.elapsedTime * 0.04 + 1.2;
      _cam.set(Math.sin(t) * 230, 95, Math.cos(t) * 230);
      camera.position.lerp(_cam, 1 - Math.exp(-dt * 2));
      camera.lookAt(0, 0, 10);
    } else {
      if (moving > 0.5) input.look *= Math.exp(-dt * 1.6);
      const desiredYaw = st.heading + Math.PI + input.look;
      st.camYaw = angleLerp(st.camYaw, desiredYaw, 1 - Math.exp(-dt * (car ? 4.5 : 3.2)));
      if (st.snap) st.camYaw = desiredYaw;
      const pitch = car ? 0.2 : input.pitch;
      const want = car ? 7.5 + Math.abs(carSpeed) * 0.06 : input.zoom;
      const lookH0 = car ? 1.3 : 1.6;
      // physical camera: cast from the player's head toward the lens and stop short of anything solid
      const dir = {
        x: Math.sin(st.camYaw) * Math.cos(pitch),
        y: Math.sin(pitch),
        z: Math.cos(st.camYaw) * Math.cos(pitch),
      };
      const origin = { x: px, y: py + lookH0, z: pz };
      const ray = new rapier.Ray(origin, dir);
      const hitRay = world.castRay(ray, want, true, undefined, undefined, undefined, car ? car.body : hb);
      const blockedFar = occlusion(px, pz, st.camYaw, want * Math.cos(pitch));
      let target = want;
      if (hitRay) target = Math.min(target, Math.max(1.6, hitRay.timeOfImpact - 0.35));
      if (blockedFar !== null) target = Math.min(target, Math.max(2.4, blockedFar / Math.cos(pitch) - 0.6));
      st.camDist += (target - st.camDist) * (1 - Math.exp(-dt * (target < st.camDist ? 14 : 2.5)));
      const d = st.camDist;
      const lookH = car ? 1.3 : 1.6;
      _cam.set(
        px + Math.sin(st.camYaw) * Math.cos(pitch) * d,
        py + lookH + Math.sin(pitch) * d,
        pz + Math.cos(st.camYaw) * Math.cos(pitch) * d,
      );
      _cam.y = Math.max(_cam.y, groundHeight(_cam.x, _cam.z) + 0.7);
      st.intro = Math.min(1, st.intro + dt * 0.45);
      let k = st.intro < 1 ? 1 - Math.exp(-dt * (1 + st.intro * 5)) : 1 - Math.exp(-dt * 12);
      if (st.snap) {
        k = 1;
        st.snap = false;
      }
      camera.position.lerp(_cam, k);
      _look.set(px + Math.sin(st.heading) * 1.4, py + lookH, pz + Math.cos(st.heading) * 1.4);
      camera.lookAt(_look);
    }
    const fov = car ? Math.min(72, 52 + Math.abs(carSpeed) * 0.45) : 52;
    if (Math.abs(camera.fov - fov) > 0.05) {
      camera.fov += (fov - camera.fov) * (1 - Math.exp(-dt * 3));
      camera.updateProjectionMatrix();
    }

    const fog = scene.fog as Fog | null;
    if (fog) {
      const far = started ? 900 : 1300;
      fog.far += (far - fog.far) * (1 - Math.exp(-dt * 1.5));
      fog.near = fog.far * 0.18;
    }

    const sl = sun.current;
    if (sl) {
      const cx = started ? px : 0;
      const cz = started ? pz : 0;
      const cy = started ? py : 0;
      sl.position.set(cx + SUN_DIR.x * 160, cy + SUN_DIR.y * 160, cz + SUN_DIR.z * 160);
      sl.target.position.set(cx, cy, cz);
      sl.target.updateMatrixWorld();
      const span = started ? 40 : 200;
      const sc = sl.shadow.camera;
      if (sc.right !== span) {
        sc.left = sc.bottom = -span;
        sc.right = sc.top = span;
        sc.updateProjectionMatrix();
      }
    }

    player.x = px;
    player.z = pz;
    player.heading = st.heading;
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __player: unknown }).__player = { x: px, y: py, z: pz, heading: st.heading, speed: car ? carSpeed : st.speed, grounded: st.grounded, car: car?.id ?? null, up: st.up };
    }

    /* HUD bookkeeping, a few times a second */
    if (clock.elapsedTime - st.lastUi > 0.15) {
      st.lastUi = clock.elapsedTime;
      let nearest: string | null = null;
      if (!car) {
        let best = Infinity;
        for (const pl of places) {
          const dd = Math.hypot(px - pl.x, pz - pl.z) - pl.radius;
          if (dd < 2.6 && dd < best) {
            best = dd;
            nearest = pl.id;
          }
        }
      }
      const nearCar = !car && nearestCar(px, pz, 3.8) !== null;
      const distances: Partial<Record<DistrictId, number>> = {};
      let cur: DistrictId | null = null;
      for (const di of districts) {
        const m = Math.hypot(px - di.x, pz - di.z);
        distances[di.id] = m;
        if (m < di.radius + 1) cur = di.id;
      }

      const have = ui.get().collected;
      const bodyY = py + 1;
      for (const pc of postcards) {
        if (have.includes(pc.id)) continue;
        const cardY = groundHeight(pc.x, pc.z) + pc.y;
        if (Math.hypot(px - pc.x, pz - pc.z) < (car ? 2.8 : 1.9) && Math.abs(cardY - bodyY) < 1.9) {
          const next = [...have, pc.id];
          saveCollected(next);
          const done = next.length === postcards.length;
          ui.set({
            collected: next,
            toast: {
              key: clock.elapsedTime,
              title: done ? `All ${postcards.length} postcards found` : `Postcard ${next.length} of ${postcards.length} · ${pc.title}`,
              body: done ? "Look up over the harbour. Thanks for exploring" : pc.fact,
            },
          });
          break;
        }
      }

      const kmh = Math.round(Math.abs(carSpeed) * 3.6);
      const now = ui.get();
      if (now.nearby !== nearest || now.current !== cur || now.nearCar !== nearCar || (car && now.speed !== kmh))
        ui.set({ nearby: nearest, current: cur, distances, nearCar, speed: kmh });
      else if (clock.elapsedTime % 1 < 0.16) ui.set({ distances });
    }
  });

  return (
    <>
      <RigidBody
        ref={heroBody}
        type="kinematicPosition"
        colliders={false}
        position={[start.x, groundHeight(start.x, start.z) + 0.95, start.z]}
        enabledRotations={[false, false, false]}
      >
        <CapsuleCollider ref={heroCollider} args={[0.5, 0.35]} />
      </RigidBody>
      <group ref={heroGroup}>
        <primitive object={hero} />
      </group>
      <spotLight ref={headlight} angle={0.5} penumbra={0.55} distance={60} decay={1.5} intensity={0} color="#fff3dc" />
      <object3D ref={headTarget} />
    </>
  );
}
