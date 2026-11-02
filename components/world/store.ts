import { useSyncExternalStore } from "react";
import type { DistrictId } from "./places";

type UIState = {
  started: boolean;
  /** place the player is standing next to */
  nearby: string | null;
  mapOpen: boolean;
  /** metres from the player to each district centre, refreshed a few times a second */
  distances: Partial<Record<DistrictId, number>>;
  current: DistrictId | null;
  /** standing next to the car */
  nearCar: boolean;
  driving: boolean;
  /** km/h, for the speedometer */
  speed: number;
  /** postcard ids picked up so far */
  collected: string[];
  night: boolean;
  /** the most recent pickup, shown as a toast */
  toast: { key: number; title: string; body: string } | null;
};

let state: UIState = {
  started: false,
  nearby: null,
  mapOpen: false,
  distances: {},
  current: null,
  nearCar: false,
  driving: false,
  speed: 0,
  collected: [],
  night: false,
  toast: null,
};
const listeners = new Set<() => void>();

export const ui = {
  get: () => state,
  set(patch: Partial<UIState>) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useUI<T>(select: (s: UIState) => T) {
  return useSyncExternalStore(ui.subscribe, () => select(state), () => select(state));
}

/**
 * Per-frame input, mutated directly by keyboard/joystick handlers and read in useFrame.
 * Not reactive on purpose.
 */
export const input = {
  /** −1…1 along the character's / car's facing */
  forward: 0,
  /** −1…1, positive turns right */
  turn: 0,
  run: false,
  jump: false,
  /** extra camera orbit from dragging; eases back behind the player while moving */
  look: 0,
  pitch: 0.32,
  zoom: 8.5,
  /** get in / out of the car on the next frame */
  toggleCar: false,
  brake: false,
  teleport: null as DistrictId | null,
};

/** Live player pose for the minimap. */
export const player = { x: 0, z: 0, heading: 0, yaw: 0 };

export const isPaused = () => !state.started || state.mapOpen;

const SAVE_KEY = "yash-world:postcards";

export function loadCollected() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) ui.set({ collected: JSON.parse(raw) as string[] });
  } catch {
    // storage blocked: start fresh
  }
}

export function saveCollected(ids: string[]) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

/** Open a link the way a visitor expects: new tab for the web, same tab for mailto/tel. */
export function openLink(url: string) {
  if (url.startsWith("http")) window.open(url, "_blank", "noopener,noreferrer");
  else window.location.href = url;
}
