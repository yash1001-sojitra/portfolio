import { CatmullRomCurve3, Vector3 } from "three";

/**
 * The island: one height function shared by the terrain mesh, the physics collider and everything
 * that needs to stand on the ground. Distances are metres, +z is south (the harbour side).
 */

export const SEA = 0;
export const GRID = { size: 560, res: 256 };
export const ROAD_HALF = 3.6;

/* ───────────────────────── noise ───────────────────────── */

function hash(x: number, z: number) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x: number, z: number) {
  const xi = Math.floor(x);
  const zi = Math.floor(z);
  const xf = x - xi;
  const zf = z - zi;
  const u = xf * xf * (3 - 2 * xf);
  const v = zf * zf * (3 - 2 * zf);
  const a = hash(xi, zi);
  const b = hash(xi + 1, zi);
  const c = hash(xi, zi + 1);
  const d = hash(xi + 1, zi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, z: number) {
  let f = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 4; i++) {
    f += amp * vnoise(x * freq, z * freq);
    amp *= 0.5;
    freq *= 2.03;
  }
  return f;
}
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/* ───────────────────────── base shape ───────────────────────── */

export function shoreRadius(theta: number) {
  return 166 + 13 * Math.sin(3 * theta + 0.7) + 8 * Math.sin(5 * theta + 2.1) + 5 * Math.sin(8 * theta + 4.2);
}

const HILLS = [
  { x: 25, z: -112, h: 42, r: 40 },
  { x: -98, z: -62, h: 18, r: 30 },
  { x: 128, z: -20, h: 9, r: 26 },
  { x: -20, z: -40, h: 8, r: 45 },
];

function baseHeight(x: number, z: number) {
  const r = Math.hypot(x, z);
  const k = r / shoreRadius(Math.atan2(z, x));
  if (k > 1) return Math.max(-26, 0.4 - (k - 1) * 60 - (k - 1) * (k - 1) * 200);
  const inland = smooth(1, 0.8, k);
  let h = 0.4 + inland * (3.5 + fbm(x * 0.018, z * 0.018) * 4);
  for (const hl of HILLS) {
    const d2 = (x - hl.x) ** 2 + (z - hl.z) ** 2;
    h += hl.h * Math.exp(-d2 / (2 * hl.r * hl.r)) * inland;
  }
  // rocky texture on the slopes
  h += (fbm(x * 0.07 + 9, z * 0.07 - 3) - 0.5) * 2.2 * inland;
  return h;
}

/* ───────────────────────── road ───────────────────────── */

const ROAD_POINTS: [number, number][] = [
  [0, 96],
  [52, 100],
  [98, 74],
  [120, 24],
  [104, -34],
  [62, -62],
  [8, -66],
  [-50, -40],
  [-98, -12],
  [-114, 40],
  [-82, 84],
  [-38, 100],
];

export type RoadSample = { x: number; z: number; y: number; t: number; tx: number; tz: number; nx: number; nz: number; s: number };

function buildRoad(): RoadSample[] {
  const curve = new CatmullRomCurve3(
    ROAD_POINTS.map(([x, z]) => new Vector3(x, 0, z)),
    true,
    "centripetal",
  );
  const N = 720;
  const pts = curve.getSpacedPoints(N).slice(0, N);
  const raw = pts.map((p) => Math.max(1.4, baseHeight(p.x, p.z)));
  // smooth the grade so driving feels like a real road
  const smoothY = raw.map((_, i) => {
    let sum = 0;
    let n = 0;
    for (let k = -24; k <= 24; k++) {
      sum += raw[(i + k + N) % N];
      n++;
    }
    return sum / n;
  });
  let s = 0;
  return pts.map((p, i) => {
    const q = pts[(i + 1) % N];
    const tx = q.x - p.x;
    const tz = q.z - p.z;
    const len = Math.hypot(tx, tz) || 1;
    // outward normal: away from the island centre
    let nx = -tz / len;
    let nz = tx / len;
    if (nx * p.x + nz * p.z < 0) {
      nx = -nx;
      nz = -nz;
    }
    const sample = { x: p.x, z: p.z, y: smoothY[i], t: i / N, tx: tx / len, tz: tz / len, nx, nz, s };
    s += len;
    return sample;
  });
}

/* ───────────────────────── pads ───────────────────────── */

export type PadSpec = { id: string; t: number; side: "in" | "out"; radius: number; gap?: number };

/** Every district sits on a level pad beside the loop road, entrance facing the road. */
export const PAD_SPECS: PadSpec[] = [
  { id: "plaza", t: 0.0, side: "out", radius: 14, gap: 4 },
  { id: "studio", t: 0.075, side: "out", radius: 15 },
  { id: "career", t: 0.165, side: "in", radius: 15 },
  { id: "signal", t: 0.235, side: "out", radius: 11 },
  { id: "gallery", t: 0.33, side: "in", radius: 15 },
  { id: "campus", t: 0.46, side: "in", radius: 14 },
  { id: "stack", t: 0.6, side: "out", radius: 12 },
  { id: "press", t: 0.71, side: "out", radius: 12 },
  { id: "work", t: 0.85, side: "in", radius: 16 },
  // attractions
  { id: "ferris", t: 0.945, side: "out", radius: 14 },
  { id: "ramp", t: 0.05, side: "in", radius: 16 },
];

export type Pad = { id: string; x: number; z: number; y: number; radius: number; ux: number; uz: number };

/* ───────────────────────── build ───────────────────────── */

type Island = {
  road: RoadSample[];
  pads: Pad[];
  heights: Float32Array;
};

let cache: Island | null = null;

function roadAt(road: RoadSample[], t: number) {
  return road[Math.round(((t % 1) + 1) % 1 * road.length) % road.length];
}

function nearestRoad(road: RoadSample[], x: number, z: number) {
  let best = Infinity;
  let bi = 0;
  for (let i = 0; i < road.length; i += 3) {
    const r = road[i];
    const d = (r.x - x) ** 2 + (r.z - z) ** 2;
    if (d < best) {
      best = d;
      bi = i;
    }
  }
  // refine around the coarse hit
  for (let k = -3; k <= 3; k++) {
    const i = (bi + k + road.length) % road.length;
    const r = road[i];
    const d = (r.x - x) ** 2 + (r.z - z) ** 2;
    if (d < best) {
      best = d;
      bi = i;
    }
  }
  return { i: bi, d: Math.sqrt(best) };
}

export function island(): Island {
  if (cache) return cache;
  const road = buildRoad();

  const pads: Pad[] = PAD_SPECS.map((p) => {
    const r = roadAt(road, p.t);
    const sign = p.side === "out" ? 1 : -1;
    const off = p.radius + ROAD_HALF + (p.gap ?? 3);
    return {
      id: p.id,
      x: r.x + r.nx * sign * off,
      z: r.z + r.nz * sign * off,
      y: r.y,
      radius: p.radius,
      // "deeper" direction: away from the road
      ux: r.nx * sign,
      uz: r.nz * sign,
    };
  });

  const { size, res } = GRID;
  const n = res + 1;
  const heights = new Float32Array(n * n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const x = -size / 2 + (i / res) * size;
      const z = -size / 2 + (j / res) * size;
      let h = baseHeight(x, z);
      // level the ground under pads
      for (const p of pads) {
        const d = Math.hypot(x - p.x, z - p.z);
        const w = 1 - smooth(p.radius + 0.5, p.radius + 9, d);
        if (w > 0) h += (p.y - h) * w;
      }
      // cut and fill along the road
      if (Math.hypot(x, z) < 160) {
        const nr = nearestRoad(road, x, z);
        const w = 1 - smooth(ROAD_HALF + 1.5, ROAD_HALF + 10, nr.d);
        if (w > 0) h += (road[nr.i].y - 0.05 - h) * w;
      }
      heights[j * n + i] = h;
    }
  }
  cache = { road, pads, heights };
  return cache;
}

/** Bilinear ground height at a world point. */
export function groundHeight(x: number, z: number) {
  const { heights } = island();
  const { size, res } = GRID;
  const fx = ((x + size / 2) / size) * res;
  const fz = ((z + size / 2) / size) * res;
  const i = Math.max(0, Math.min(res - 1, Math.floor(fx)));
  const j = Math.max(0, Math.min(res - 1, Math.floor(fz)));
  const u = Math.min(1, Math.max(0, fx - i));
  const v = Math.min(1, Math.max(0, fz - j));
  const n = res + 1;
  const a = heights[j * n + i];
  const b = heights[j * n + i + 1];
  const c = heights[(j + 1) * n + i];
  const d = heights[(j + 1) * n + i + 1];
  // match the triangle split used by PlaneGeometry (a-c-b / c-d-b)
  if (u + v <= 1) return a + (b - a) * u + (c - a) * v;
  return d + (c - d) * (1 - u) + (b - d) * (1 - v);
}

export function distanceToRoad(x: number, z: number) {
  return nearestRoad(island().road, x, z).d;
}

export function padById(id: string) {
  return island().pads.find((p) => p.id === id)!;
}

export const isLand = (x: number, z: number) => groundHeight(x, z) > 0.6;
