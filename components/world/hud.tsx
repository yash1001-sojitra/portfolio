"use client";

import { useProgress } from "@react-three/drei";
import { ArrowLeft, ArrowUpRight, Car, Map as MapIcon, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/lib/data";
import { groundHeight, island } from "./island";
import { districtById, districts, ferris, placeById, postcards, ramp, type Link } from "./places";
import { input, openLink, player, ui, useUI } from "./store";

/* ───────────────────────── tokens ───────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;
const enter = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.18, ease: EASE } },
};
/** Paper card: the one surface every HUD element is made of. */
const CARD = "rounded-[14px] bg-[#fdfbf7] text-[#1f1b16] shadow-[0_8px_24px_rgba(20,16,10,0.16)] ring-1 ring-[#1f1b16]/8";
const ICON = { size: 16, strokeWidth: 1.5 } as const;

const domainOf = (l: Link) => {
  if (l.url.startsWith("mailto:")) return l.url.slice(7);
  if (l.url.startsWith("tel:")) return l.label;
  try {
    return new URL(l.url).hostname.replace(/^www\./, "");
  } catch {
    return l.label;
  }
};

/* ───────────────────────── input ───────────────────────── */

function useKeyboard() {
  useEffect(() => {
    const held = new Set<string>();
    const sync = () => {
      const f = (held.has("KeyW") || held.has("ArrowUp") ? 1 : 0) - (held.has("KeyS") || held.has("ArrowDown") ? 1 : 0);
      const t = (held.has("KeyD") || held.has("ArrowRight") ? 1 : 0) - (held.has("KeyA") || held.has("ArrowLeft") ? 1 : 0);
      input.forward = f;
      input.turn = t;
      input.run = held.has("ShiftLeft") || held.has("ShiftRight");
      input.brake = held.has("Space");
    };
    const down = (e: KeyboardEvent) => {
      const s = ui.get();
      if (e.code === "Escape") {
        if (s.mapOpen) ui.set({ mapOpen: false });
        return;
      }
      if (!s.started) {
        if (e.code === "Enter" || e.code === "Space") {
          e.preventDefault();
          ui.set({ started: true });
        }
        return;
      }
      if (e.code === "KeyM" || e.code === "Tab") {
        e.preventDefault();
        ui.set({ mapOpen: !s.mapOpen });
        return;
      }
      if (e.code === "KeyN") {
        ui.set({ night: !s.night });
        return;
      }
      if (s.mapOpen) return;
      if (e.code === "KeyF") {
        input.toggleCar = true;
        return;
      }
      if (e.code === "KeyE" && !s.driving && s.nearby) {
        const link = placeById[s.nearby]?.links?.[0];
        if (link) openLink(link.url);
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        input.jump = true;
      }
      if (e.code.startsWith("Arrow")) e.preventDefault();
      held.add(e.code);
      sync();
    };
    const up = (e: KeyboardEvent) => {
      held.delete(e.code);
      sync();
    };
    const blur = () => {
      held.clear();
      sync();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);
}

/** Drags on the canvas orbit the camera around the player; the wheel zooms. */
export function useDragLook(target: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    let last: { x: number; y: number } | null = null;
    let id = -1;
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-hud]")) return;
      last = { x: e.clientX, y: e.clientY };
      id = e.pointerId;
    };
    const move = (e: PointerEvent) => {
      if (!last || e.pointerId !== id) return;
      input.look -= (e.clientX - last.x) * 0.006;
      input.pitch = Math.min(1.2, Math.max(0.06, input.pitch + (e.clientY - last.y) * 0.004));
      last = { x: e.clientX, y: e.clientY };
    };
    const end = (e: PointerEvent) => {
      if (e.pointerId === id) last = null;
    };
    const wheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).closest("[data-hud]")) return;
      input.zoom = Math.min(22, Math.max(3.5, input.zoom * (1 + e.deltaY * 0.001)));
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("wheel", wheel);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [target]);
}

/* ───────────────────────── pieces ───────────────────────── */

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-grid h-6 min-w-6 place-items-center rounded-[6px] bg-[#efe9df] px-1.5 font-mono text-[12px] text-[#1f1b16] shadow-[inset_0_-1px_0_rgba(31,27,22,0.16)]">
      {children}
    </kbd>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`${CARD} pointer-events-auto grid size-10 place-items-center transition-[background-color,transform] duration-150 hover:bg-[#f4efe6] active:scale-[0.97]`}
    >
      {children}
    </button>
  );
}

const CONTROLS: [React.ReactNode, string][] = [
  [
    <>
      <Key>W</Key>
      <Key>S</Key>
    </>,
    "Walk",
  ],
  [
    <>
      <Key>A</Key>
      <Key>D</Key>
    </>,
    "Turn",
  ],
  [<Key key="f">F</Key>, "Car"],
  [<Key key="m">M</Key>, "Map"],
  [<Key key="n">N</Key>, "Night"],
  [<Key key="e">E</Key>, "Open link"],
];

function Intro() {
  const started = useUI((s) => s.started);
  const { progress, active } = useProgress();
  const ready = !active && progress >= 100;
  return (
    <AnimatePresence>
      {!started && (
        <motion.div data-hud {...enter} className="absolute inset-x-4 bottom-4 z-30 md:inset-x-auto md:bottom-8 md:left-8 md:w-[440px]">
          <div className={`${CARD} p-6`}>
            <p className="flex items-center gap-2 text-[13px] text-[#7b7266]">
              <span className="size-2 rounded-full bg-[#c8ff2e] ring-1 ring-[#1f1b16]/20" />
              {profile.name} · {profile.role}
            </p>
            <h1 className="mt-4 text-[36px] leading-[1.05] font-medium tracking-[-0.02em] text-balance md:text-[44px]">
              An island built from my work
            </h1>
            <p className="mt-4 text-[15px] leading-[22px] text-pretty text-[#5e554a]">
              Every product, game, job and certificate is a place on this island, with its full story on a sign
              out front. Walk the harbour or take the Ferrari parked beside you.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <button
                disabled={!ready}
                onClick={() => ui.set({ started: true })}
                className="h-11 rounded-[10px] bg-[#1f1b16] px-5 text-[15px] font-medium text-[#f7f4ee] transition-[background-color,transform] duration-150 hover:bg-[#3a332b] active:scale-[0.98] disabled:bg-[#d9d1c3] disabled:text-[#7b7266]"
              >
                {ready ? "Step onto the island" : `Loading ${Math.round(progress)}%`}
              </button>
              <a href="/" className="text-[14px] text-[#5e554a] underline-offset-4 transition-colors hover:text-[#1f1b16] hover:underline">
                Classic site
              </a>
            </div>
            <div className="mt-6 hidden grid-cols-3 gap-x-4 gap-y-2 border-t border-[#1f1b16]/8 pt-4 md:grid">
              {CONTROLS.map(([keys, label]) => (
                <span key={label} className="flex items-center gap-2 text-[13px] text-[#5e554a]">
                  <span className="flex gap-1">{keys}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-2 px-2 text-[12px] text-[#f4f1e8]/80 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
            Ferrari 458 model by vicent091036 (CC BY) · character from Mixamo · textures and sky from Poly Haven
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TopBar() {
  const started = useUI((s) => s.started);
  const current = useUI((s) => s.current);
  const night = useUI((s) => s.night);
  const found = useUI((s) => s.collected.length);
  if (!started) return null;
  const d = current ? districtById[current] : null;
  return (
    <div data-hud className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4 md:p-6">
      <a
        href="/"
        className={`${CARD} pointer-events-auto flex h-10 items-center gap-2 pr-4 pl-3 text-[14px] font-medium transition-colors hover:bg-[#f4efe6]`}
      >
        <ArrowLeft {...ICON} className="text-[#7b7266]" />
        {profile.initials} · Classic site
      </a>

      {/* road-sign plate for the place you're standing in */}
      <AnimatePresence mode="wait">
        {d && (
          <motion.div key={d.id} {...enter} className="hidden items-center gap-3 rounded-[10px] bg-[#1f4a3a] px-4 py-2 text-[#f4f1e8] shadow-[0_8px_24px_rgba(20,16,10,0.2)] sm:flex">
            <span className="h-6 w-1 rounded-full" style={{ background: d.color }} />
            <span>
              <span className="block text-[14px] leading-5 font-medium">{d.name}</span>
              <span className="block text-[12px] leading-4 text-[#cfd8d2]">{d.blurb}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <span className={`${CARD} hidden h-10 items-center gap-2 px-3 text-[13px] text-[#5e554a] md:flex`} title="Postcards found">
          <span className="font-mono tabular-nums text-[#1f1b16]">
            {found}/{postcards.length}
          </span>
          postcards
        </span>
        <IconButton label={night ? "Switch to day (N)" : "Switch to night (N)"} onClick={() => ui.set({ night: !night })}>
          {night ? <Sun {...ICON} /> : <Moon {...ICON} />}
        </IconButton>
        <IconButton label="Map (M)" onClick={() => ui.set({ mapOpen: true })}>
          <MapIcon {...ICON} />
        </IconButton>
      </div>
    </div>
  );
}

function Prompt() {
  const nearby = useUI((s) => s.nearby);
  const nearCar = useUI((s) => s.nearCar);
  const busy = useUI((s) => s.mapOpen || !s.started || s.driving);
  const p = nearby ? placeById[nearby] : null;
  const link = p?.links?.[0];
  return (
    <div data-hud className="pointer-events-none absolute bottom-32 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-8">
      <AnimatePresence>
        {nearCar && !busy && (
          <motion.button
            key="car"
            {...enter}
            onClick={() => (input.toggleCar = true)}
            className={`${CARD} pointer-events-auto flex h-11 items-center gap-3 pr-4 pl-2 text-[14px] transition-colors hover:bg-[#f4efe6]`}
          >
            <Key>F</Key>
            <Car {...ICON} className="text-[#7b7266]" />
            Get in and drive
          </motion.button>
        )}
        {p && link && !busy && (
          <motion.button
            key={p.id}
            {...enter}
            onClick={() => openLink(link.url)}
            className={`${CARD} pointer-events-auto flex h-11 max-w-[86vw] items-center gap-3 pr-4 pl-2 text-[14px] transition-colors hover:bg-[#f4efe6]`}
          >
            <Key>E</Key>
            <span className="truncate">
              {p.title} <span className="text-[#7b7266]">· {domainOf(link)}</span>
            </span>
            <ArrowUpRight {...ICON} className="shrink-0 text-[#7b7266]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Speedometer while driving. */
function Dashboard() {
  const driving = useUI((s) => s.driving);
  const speed = useUI((s) => s.speed);
  const busy = useUI((s) => s.mapOpen);
  const pct = Math.min(1, speed / 200);
  return (
    <AnimatePresence>
      {driving && !busy && (
        <motion.div data-hud {...enter} className="pointer-events-none absolute bottom-32 left-1/2 z-20 -translate-x-1/2 md:bottom-8">
          <div className={`${CARD} flex items-center gap-4 py-3 pr-5 pl-3`}>
            <div className="relative grid size-16 place-items-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-[225deg]">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#efe9df" strokeWidth="8" strokeDasharray="198 300" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#1f1b16"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${198 * pct} 300`}
                  className="transition-[stroke-dasharray] duration-150"
                />
              </svg>
              <span className="font-mono text-[18px] font-medium tabular-nums">{speed}</span>
            </div>
            <div className="grid gap-1 text-[13px] text-[#5e554a]">
              <span className="text-[12px] text-[#7b7266]">km/h</span>
              <span className="hidden items-center gap-2 md:flex">
                <Key>⇧</Key> boost <Key>␣</Key> handbrake <Key>F</Key> get out
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Toast() {
  const toast = useUI((s) => s.toast);
  const [shown, setShown] = useState<typeof toast>(null);
  useEffect(() => {
    if (!toast) return;
    setShown(toast);
    const id = setTimeout(() => setShown(null), 5200);
    return () => clearTimeout(id);
  }, [toast]);
  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          key={shown.key}
          data-hud
          {...enter}
          className="pointer-events-none absolute top-20 left-1/2 z-30 w-[min(420px,calc(100vw-32px))] -translate-x-1/2 md:top-24"
        >
          <div className={`${CARD} flex gap-4 p-4`}>
            {/* tiny stamp, the postcard's own mark */}
            <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-[4px] bg-[#ff6a3d] p-1">
              <span className="block size-full rounded-[2px] border border-dashed border-[#fdfbf7]/80" />
            </span>
            <span>
              <span className="block text-[13px] text-[#7b7266]">{shown.title}</span>
              <span className="mt-1 block text-[15px] leading-[22px] text-pretty">{shown.body}</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── maps ───────────────────────── */

const SPAN = 200;

function useShorePath() {
  return useMemo(() => {
    // trace the coastline from the height grid: sample rays from the centre
    const pts: string[] = [];
    for (let i = 0; i < 180; i++) {
      const a = (i / 180) * Math.PI * 2;
      let r = 40;
      for (; r < 200; r += 2) {
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        if (!landAt(x, z)) break;
      }
      pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
    }
    return `M${pts.join("L")}Z`;
  }, []);
}

const landAt = (x: number, z: number) => groundHeight(x, z) > 0.3;

function TownMap({ size, interactive = false, marker }: { size: number | string; interactive?: boolean; marker: React.RefObject<SVGGElement | null> }) {
  const collected = useUI((s) => s.collected);
  const shore = useShorePath();
  const roadPath = useMemo(() => {
    const { road } = island();
    return `M${road.filter((_, i) => i % 4 === 0).map((r) => `${r.x.toFixed(1)},${r.z.toFixed(1)}`).join("L")}Z`;
  }, []);
  return (
    <svg viewBox={`${-SPAN} ${-SPAN} ${SPAN * 2} ${SPAN * 2}`} width={size} height={size} className="block" aria-label="Island map">
      <rect x={-SPAN} y={-SPAN} width={SPAN * 2} height={SPAN * 2} fill="#b9d3d6" />
      <path d={shore} fill="#efe6cf" />
      <path d={shore} fill="#dfe6c8" transform="scale(0.93)" />
      <path d={roadPath} fill="none" stroke="#fdfbf7" strokeWidth={7} strokeLinejoin="round" />
      <path d={roadPath} fill="none" stroke="#d9d1c3" strokeWidth={1} strokeDasharray="4 5" />
      <circle cx={ferris.x} cy={ferris.z} r={9} fill="none" stroke="#7b7266" strokeWidth={1.6} />
      <rect x={ramp.x - 4} y={ramp.z - 4} width={8} height={8} rx={1.5} fill="#d9d1c3" />
      {districts.map((d) => {
        const body = (
          <>
            <circle cx={d.x} cy={d.z} r={d.radius} fill="#fdfbf7" stroke={d.color} strokeWidth={3} />
            {interactive && (
              <text x={d.x} y={d.z + d.radius + 12} textAnchor="middle" fontSize={10} fill="#1f1b16" fontWeight={500}>
                {d.name}
              </text>
            )}
          </>
        );
        return interactive ? (
          <g
            key={d.id}
            role="button"
            tabIndex={0}
            aria-label={`Travel to ${d.name}`}
            className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-[#1f1b16] [&:hover>circle]:fill-[#f4efe6]"
            onClick={() => {
              input.teleport = d.id;
              ui.set({ mapOpen: false });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                input.teleport = d.id;
                ui.set({ mapOpen: false });
              }
            }}
          >
            {body}
          </g>
        ) : (
          <g key={d.id}>{body}</g>
        );
      })}
      {/* postcards: outlines until found */}
      {postcards.map((p) => {
        const got = collected.includes(p.id);
        return (
          <rect
            key={p.id}
            x={p.x - 4}
            y={p.z - 2.7}
            width={8}
            height={5.4}
            rx={1}
            fill={got ? "#ff6a3d" : "none"}
            stroke={got ? "none" : "#7b7266"}
            strokeWidth={1.2}
            strokeDasharray={got ? undefined : "2 1.6"}
            pointerEvents="none"
          />
        );
      })}
      <g ref={marker} pointerEvents="none">
        <path d="M0 -10 L7.5 8 L0 4 L-7.5 8 Z" fill="#1f1b16" stroke="#c8ff2e" strokeWidth={2} strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** Moves a map marker every frame without re-rendering React. */
function useMarker(marker: React.RefObject<SVGGElement | null>, on: boolean) {
  useEffect(() => {
    if (!on) return;
    let raf = 0;
    const tick = () => {
      const x = Math.max(-SPAN, Math.min(SPAN, player.x));
      const y = Math.max(-SPAN, Math.min(SPAN, player.z));
      marker.current?.setAttribute("transform", `translate(${x} ${y}) rotate(${180 - (player.heading * 180) / Math.PI})`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [marker, on]);
}

function Minimap() {
  const started = useUI((s) => s.started);
  const mapOpen = useUI((s) => s.mapOpen);
  const marker = useRef<SVGGElement>(null);
  useMarker(marker, started && !mapOpen);
  if (!started) return null;
  return (
    <button
      data-hud
      onClick={() => ui.set({ mapOpen: true })}
      aria-label="Open map"
      className={`${CARD} absolute top-20 right-4 z-20 hidden overflow-hidden p-0 transition-transform duration-150 active:scale-[0.98] md:right-6 md:block`}
    >
      <TownMap size={168} marker={marker} />
    </button>
  );
}

function MapOverlay() {
  const mapOpen = useUI((s) => s.mapOpen);
  const found = useUI((s) => s.collected.length);
  const marker = useRef<SVGGElement>(null);
  useMarker(marker, mapOpen);
  return (
    <AnimatePresence>
      {mapOpen && (
        <motion.div
          data-hud
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.18, ease: EASE } }}
          className="absolute inset-0 z-40 grid place-items-center bg-[#1f1b16]/30 p-4"
          onClick={() => ui.set({ mapOpen: false })}
        >
          <motion.div
            initial={{ y: 12 }}
            animate={{ y: 0, transition: { duration: 0.36, ease: EASE } }}
            className={`${CARD} w-full max-w-[min(640px,80vh)] overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <h2 className="text-[18px] font-medium">Island map</h2>
                <p className="text-[13px] text-[#7b7266]">
                  Pick a place to travel there · {found} of {postcards.length} postcards found
                </p>
              </div>
              <button
                onClick={() => ui.set({ mapOpen: false })}
                aria-label="Close map"
                className="grid size-9 place-items-center rounded-[10px] text-[#5e554a] transition-colors hover:bg-[#efe9df] hover:text-[#1f1b16]"
              >
                <X {...ICON} />
              </button>
            </div>
            <div className="border-t border-[#1f1b16]/8">
              <TownMap size="100%" interactive marker={marker} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Thumb stick for touch screens. Pushes into the same input object as the keyboard. */
function Joystick() {
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const base = useRef<HTMLDivElement>(null);
  const id = useRef<number | null>(null);
  const started = useUI((s) => s.started);

  const update = (e: React.PointerEvent) => {
    const r = base.current!.getBoundingClientRect();
    let x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    let y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    setKnob({ x, y });
    input.forward = Math.abs(y) > 0.15 ? -y : 0;
    input.turn = Math.abs(x) > 0.15 ? x : 0;
    input.run = len > 0.92;
  };
  const end = () => {
    id.current = null;
    setKnob({ x: 0, y: 0 });
    input.forward = input.turn = 0;
    input.run = false;
  };

  if (!started) return null;
  return (
    <div data-hud className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-6 [@media(pointer:fine)]:hidden">
      <div
        ref={base}
        className="relative size-32 touch-none rounded-full bg-[#fdfbf7]/80 ring-1 ring-[#1f1b16]/10"
        onPointerDown={(e) => {
          id.current = e.pointerId;
          e.currentTarget.setPointerCapture(e.pointerId);
          update(e);
        }}
        onPointerMove={(e) => e.pointerId === id.current && update(e)}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <div
          className="absolute top-1/2 left-1/2 size-12 rounded-full bg-[#1f1b16]"
          style={{ transform: `translate(calc(-50% + ${knob.x * 40}px), calc(-50% + ${knob.y * 40}px))` }}
        />
      </div>
      <div className="flex flex-col gap-3">
        <button
          onPointerDown={() => (input.toggleCar = true)}
          aria-label="Get in or out of the car"
          className={`${CARD} grid size-14 touch-none place-items-center rounded-full`}
        >
          <Car {...ICON} />
        </button>
        <button onPointerDown={() => (input.jump = true)} className={`${CARD} grid size-14 touch-none place-items-center rounded-full text-[13px] font-medium`}>
          Jump
        </button>
      </div>
    </div>
  );
}

export function HUD() {
  useKeyboard();
  return (
    <>
      <Intro />
      <TopBar />
      <Minimap />
      <Toast />
      <Prompt />
      <Dashboard />
      <MapOverlay />
      <Joystick />
    </>
  );
}
