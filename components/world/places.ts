import {
  certificates,
  education,
  experience,
  posts,
  profile,
  quote,
  projects,
  skillGroups,
  stats,
  studio,
  studioApps,
  type ProjectKind,
} from "@/lib/data";
import { KIND_HUE } from "./charts";
import { padById } from "./island";

export const COLORS = {
  signal: "#c8ff2e",
  flare: "#ff6a3d",
  cyan: "#4fd8ff",
  violet: "#b58cff",
  pink: "#ff5fa2",
  gold: "#ffc94d",
};

/** Same fixed kind → hue mapping as the Main Street chart, so a tower's colour means its kind. */
export const KIND_COLOR: Record<ProjectKind, string> = KIND_HUE;

/** Players can't wander past this radius (the sea does the rest). */
export const WORLD_EDGE = 200;

/* ───────────────────────── districts ───────────────────────── */

export type DistrictId =
  | "plaza"
  | "work"
  | "studio"
  | "stack"
  | "career"
  | "gallery"
  | "press"
  | "campus"
  | "signal";

export type District = {
  id: DistrictId;
  name: string;
  blurb: string;
  color: string;
  x: number;
  z: number;
  /** pad height above sea level */
  y: number;
  /** paved area; also keeps decoration out */
  radius: number;
  /** unit vector pointing from the plaza into the district ("deeper") */
  ux: number;
  uz: number;
};

const d = (id: DistrictId, name: string, blurb: string, color: string): District => {
  const p = padById(id);
  return { id, name, blurb, color, x: p.x, z: p.z, y: p.y, radius: p.radius, ux: p.ux, uz: p.uz };
};

export const districts: District[] = [
  d("plaza", "Harbour Square", "Who I am, in numbers", COLORS.signal),
  d("work", "Main Street", `${projects.length} shipped products`, COLORS.cyan),
  d("studio", "Boardwalk Arcade", `${studioApps.length} games & apps`, COLORS.pink),
  d("career", "Business Park", "Where I've worked", COLORS.flare),
  d("gallery", "Cert Gallery", `${certificates.length} certificates`, COLORS.gold),
  d("signal", "Lighthouse Point", "Say hello", COLORS.flare),
  d("campus", "University Hill", "Education", COLORS.signal),
  d("press", "Press Row", "Things I've written", COLORS.cyan),
  d("stack", "Botanic Garden", "The tech stack", COLORS.violet),
];

export const districtById = Object.fromEntries(districts.map((x) => [x.id, x])) as Record<
  DistrictId,
  District
>;

/** District-local (dx right, dz deeper) → world xz. */
export function toWorld(id: DistrictId, dx: number, dz: number) {
  const c = districtById[id];
  // "right" when facing into the district
  const rx = -c.uz;
  const rz = c.ux;
  return { x: c.x + rx * dx + c.ux * dz, z: c.z + rz * dx + c.uz * dz };
}

/** Y rotation that points a model's +Z along (dx, dz). */
export const yawTo = (dx: number, dz: number) => Math.atan2(dx, dz);

/* ───────────────────────── places ───────────────────────── */

export type PlaceKind =
  | "monolith"
  | "stat"
  | "tower"
  | "cabinet"
  | "kiosk"
  | "crystal"
  | "hq"
  | "frame"
  | "billboard"
  | "hall"
  | "radio";

export type Link = { label: string; url: string };

export type Place = {
  id: string;
  kind: PlaceKind;
  district: DistrictId;
  title: string;
  eyebrow: string;
  mark?: string;
  body?: string;
  bullets?: string[];
  tags?: string[];
  links?: Link[];
  image?: string;
  color: string;
  /** collision + interaction radius in metres */
  radius: number;
  /** size hint used by meshes (e.g. tower height) */
  size: number;
  x: number;
  z: number;
  /** ground height of the place's pad */
  y: number;
  rotY: number;
};

type Facing = [number, number] | { dx: number; dz: number };

/** Place at a district-local offset, facing a local point or a world direction. */
function at(districtId: DistrictId, dx: number, dz: number, face: Facing = [0, 0]) {
  const p = toWorld(districtId, dx, dz);
  let fx: number;
  let fz: number;
  if (Array.isArray(face)) {
    const t = toWorld(districtId, face[0], face[1]);
    fx = t.x - p.x;
    fz = t.z - p.z;
  } else {
    fx = face.dx;
    fz = face.dz;
  }
  const c = districtById[districtId];
  // something sitting on its own focus point faces the plaza
  if (fx * fx + fz * fz < 1e-8) {
    fx = -c.ux;
    fz = -c.uz;
  }
  return { x: p.x, z: p.z, y: c.y, rotY: yawTo(fx, fz) };
}

/** Direction pointing back out of a district, toward the plaza. */
const south = (id: DistrictId) => ({ dx: -districtById[id].ux, dz: -districtById[id].uz });

function ring(count: number, radius: number, start = 0, sweep = Math.PI * 2) {
  return Array.from({ length: count }, (_, i) => {
    const a = start + (sweep * (i + (sweep === Math.PI * 2 ? 0 : 0.5))) / count;
    return [Math.cos(a) * radius, Math.sin(a) * radius] as const;
  });
}

const places: Place[] = [];

// Origin Plaza — profile monolith with stat pillars around it
places.push({
  id: "profile",
  kind: "monolith",
  district: "plaza",
  title: profile.name,
  eyebrow: `${profile.role} · ${profile.location}`,
  body: profile.about,
  links: [
    { label: "Resume", url: profile.resume },
    { label: "GitHub", url: profile.socials.github },
    { label: "LinkedIn", url: profile.socials.linkedin },
  ],
  image: "/images/profile_image.png",
  color: COLORS.signal,
  radius: 2.6,
  size: 7,
  ...at("plaza", 0, 4, south("plaza")),
});
ring(stats.length, 9.5, Math.PI * 1.05, Math.PI * 0.9).forEach(([x, z], i) => {
  const s = stats[i];
  places.push({
    id: `stat-${i}`,
    kind: "stat",
    district: "plaza",
    title: `${s.value}${s.suffix}`,
    eyebrow: s.label,
    body: `${s.label}: ${s.value}${s.suffix}.`,
    color: [COLORS.signal, COLORS.cyan, COLORS.flare, COLORS.violet][i % 4],
    radius: 1.1,
    size: 2.2 + i * 0.5,
    ...at("plaza", x, z + 4, [0, -14]),
  });
});

// Work District — a 3×3 grid of towers
projects.forEach((p, i) => {
  const gx = (i % 3) - 1;
  const gz = Math.floor(i / 3) - 1;
  places.push({
    id: `project-${i}`,
    kind: "tower",
    district: "work",
    title: p.title,
    eyebrow: `${p.kind} project`,
    mark: p.mark,
    body: p.description,
    tags: [p.kind],
    links: p.url ? [{ label: p.urlLabel ?? "Visit live site", url: p.url }] : undefined,
    color: KIND_COLOR[p.kind],
    radius: 2.1,
    size: 5 + ((i * 7) % 9) * 0.9,
    ...at("work", gx * 8, gz * 8, gx === 0 && gz === 0 ? south("work") : [0, 0]),
  });
});

// IYGroup Arcade — a studio kiosk ringed by cabinets
places.push({
  id: "studio",
  kind: "kiosk",
  district: "studio",
  title: studio.name,
  eyebrow: "Indie studio",
  body: `${studio.tagline} ${studioApps.length} games and apps published on Google Play and the App Store.`,
  links: [
    { label: "Studio site", url: studio.site },
    { label: "Google Play", url: studio.playStore },
    { label: "App Store", url: studio.appStore },
  ],
  color: COLORS.pink,
  radius: 2.6,
  size: 3,
  ...at("studio", 0, 0),
});
const arcadeHues = [COLORS.pink, COLORS.cyan, COLORS.signal, COLORS.flare, COLORS.violet, COLORS.gold];
// leave a gap in the ring facing the entrance
ring(studioApps.length, 9.5, -Math.PI / 2 + Math.PI / studioApps.length).forEach(([x, z], i) => {
  const a = studioApps[i];
  const links: Link[] = [];
  if (a.play) links.push({ label: "Google Play", url: a.play });
  if (a.appStore) links.push({ label: "App Store", url: a.appStore });
  if (a.page) links.push({ label: "Details", url: a.page });
  places.push({
    id: `app-${i}`,
    kind: "cabinet",
    district: "studio",
    title: a.title,
    eyebrow: a.kind === "Game" ? "Mobile game" : "Mobile app",
    mark: a.mark,
    body: a.description,
    tags: [a.kind],
    links,
    color: arcadeHues[i % arcadeHues.length],
    radius: 1.1,
    size: a.kind === "Game" ? 1 : 0,
    ...at("studio", x, z),
  });
});

// Crystal Garden — one floating crystal per skill group
const crystalHues = [COLORS.flare, COLORS.cyan, COLORS.signal, COLORS.violet, COLORS.gold, COLORS.pink];
ring(skillGroups.length, 6, 0).forEach(([x, z], i) => {
  const g = skillGroups[i];
  places.push({
    id: `skill-${g.id}`,
    kind: "crystal",
    district: "stack",
    title: g.name,
    eyebrow: "Skill group",
    bullets: g.items,
    color: crystalHues[i],
    radius: 1.3,
    size: 1.2 + (g.items.length - 4) * 0.15,
    ...at("stack", x, z),
  });
});

// Career Road — one HQ per job, newest first
experience.forEach((job, i) => {
  places.push({
    id: `job-${i}`,
    kind: "hq",
    district: "career",
    title: job.company,
    eyebrow: `${job.role} · ${job.period}`,
    bullets: job.points,
    tags: job.current ? ["Current"] : undefined,
    color: job.current ? COLORS.flare : COLORS.cyan,
    radius: 3.4,
    size: job.current ? 11 : 8,
    ...at("career", i === 0 ? -6 : 6, 0, south("career")),
  });
});

// Cert Gallery — two arcs of framed certificates
certificates.forEach((c, i) => {
  const row = i < 9 ? 0 : 1;
  const inRow = row === 0 ? 9 : certificates.length - 9;
  const k = row === 0 ? i : i - 9;
  const radius = row === 0 ? 8 : 12;
  const a = Math.PI * 0.15 + (Math.PI * 0.7 * (k + 0.5)) / inRow;
  places.push({
    id: `cert-${i}`,
    kind: "frame",
    district: "gallery",
    title: c.title,
    eyebrow: "Certificate",
    image: c.src,
    color: COLORS.gold,
    radius: 1,
    size: 1,
    ...at("gallery", Math.cos(a) * radius, Math.sin(a) * radius - 5, [0, -5]),
  });
});

// Press Row — billboards for each Medium post
posts.forEach((p, i) => {
  places.push({
    id: `post-${i}`,
    kind: "billboard",
    district: "press",
    title: p.title,
    eyebrow: p.topic,
    body: p.description,
    links: [{ label: "Read on Medium", url: p.url }],
    color: [COLORS.cyan, COLORS.signal, COLORS.flare][i],
    radius: 1.8,
    size: 1,
    ...at("press", (i - 1) * 6.5, -2, south("press")),
  });
});

// Campus — halls that grow with each degree
education.forEach((e, i) => {
  const [x, z] = ring(education.length, 7, Math.PI / 4)[i];
  places.push({
    id: `edu-${i}`,
    kind: "hall",
    district: "campus",
    title: e.title,
    eyebrow: `${e.school} · ${e.period}`,
    body: e.note,
    color: [COLORS.signal, COLORS.cyan, COLORS.violet, COLORS.gold][i],
    radius: 2.6,
    size: 4 - i * 0.6,
    ...at("campus", x, z),
  });
});

// Signal Tower — contact
places.push({
  id: "contact",
  kind: "radio",
  district: "signal",
  title: "Let's build something",
  eyebrow: `${profile.location} · ${profile.coords}`,
  body: "Open to senior engineering roles, technical leadership and interesting freelance builds across mobile, web, cloud and AI.",
  links: [
    { label: profile.email, url: `mailto:${profile.email}` },
    { label: profile.phone, url: `tel:${profile.phone.replace(/\s/g, "")}` },
    { label: "LinkedIn", url: profile.socials.linkedin },
    { label: "GitHub", url: profile.socials.github },
    { label: "Medium", url: profile.socials.medium },
    { label: "Resume", url: profile.resume },
  ],
  color: COLORS.flare,
  radius: 3.4,
  size: 14,
  ...at("signal", 0, 0, south("signal")),
});

export { places };
export const placeById = Object.fromEntries(places.map((p) => [p.id, p])) as Record<string, Place>;

/** Where the player stands when arriving at a district, and the camera yaw that looks into it. */
export function arrival(id: DistrictId) {
  const c = districtById[id];
  const back = id === "plaza" ? -5 : -(c.radius - 5);
  const p = toWorld(id, 0, back);
  // camera sits behind the player, looking along the district's "deeper" axis
  return { x: p.x, z: p.z, yaw: Math.atan2(-c.ux, -c.uz) };
}

/* ───────────────────────── attractions ───────────────────────── */

const rampPad = padById("ramp");
const ferrisPad = padById("ferris");

/** A jump ramp on its own pad, run-up from the road side; physics does the rest. */
export const ramp = {
  x: rampPad.x + rampPad.ux * 2,
  z: rampPad.z + rampPad.uz * 2,
  y: rampPad.y,
  yaw: Math.atan2(rampPad.ux, rampPad.uz),
  length: 10,
  width: 5.5,
  height: 2.2,
};

export const ferris = {
  x: ferrisPad.x,
  z: ferrisPad.z,
  y: ferrisPad.y,
  radius: 15,
  // wheel face toward the road
  yaw: Math.atan2(ferrisPad.ux, ferrisPad.uz) + Math.PI / 2,
};

const attr = (pad: typeof rampPad, dx: number, dz: number) => ({
  x: pad.x - pad.uz * dx + pad.ux * dz,
  z: pad.z + pad.ux * dx + pad.uz * dz,
});

export type Postcard = { id: string; x: number; z: number; y: number; title: string; fact: string };

/** Collectibles, each carrying a fact taken from the portfolio data. */
export const postcards: Postcard[] = [
  { id: "pc-plaza", ...toWorld("plaza", -9, 6), y: 1.4, title: "Harbour Square", fact: `${stats[0].value}${stats[0].suffix} years shipping mobile, web and backend apps` },
  { id: "pc-work", ...toWorld("work", 12, 4), y: 1.4, title: "Main Street", fact: `${projects.length} products live, from ${projects[0].title} to ${projects[1].title}` },
  { id: "pc-studio", ...toWorld("studio", 0, -5), y: 1.4, title: "Boardwalk Arcade", fact: `Runs ${studio.name}: ${studioApps.length} games and apps on the stores` },
  { id: "pc-career", ...toWorld("career", -10, 6), y: 1.4, title: "Business Park", fact: `Leads a ${stats[3].value}-member engineering team at ${experience[0].company}` },
  { id: "pc-gallery", ...toWorld("gallery", 0, -4), y: 1.4, title: "Cert Gallery", fact: "Google Cloud certified: Associate Cloud Engineer and Professional Cloud Architect" },
  { id: "pc-signal", ...toWorld("signal", 6, 3), y: 1.4, title: "Lighthouse Point", fact: `Say hello at ${profile.email}` },
  { id: "pc-campus", ...toWorld("campus", 0, 2), y: 1.4, title: "University Hill", fact: `${education[0].title} from ${education[0].school}` },
  { id: "pc-press", ...toWorld("press", 0, 4), y: 1.4, title: "Press Row", fact: `${posts.length} deep dives on Flutter, Shorebird and Firestore on Medium` },
  { id: "pc-stack", ...toWorld("stack", 0, 0), y: 1.6, title: "Botanic Garden", fact: "Builds agents with Google ADK, Gemini Flash and MCP" },
  { id: "pc-beach", ...attr(padById("studio"), 0, 22), y: 1.4, title: "The beach", fact: `Based in ${profile.location} · ${profile.coords}` },
  { id: "pc-ramp", ...attr(rampPad, 0, 13), y: 4.4, title: "Airtime", fact: `Flagship apps passed ${stats[2].value}${stats[2].suffix} downloads` },
  { id: "pc-wheel", ...attr(ferrisPad, 0, -10), y: 1.4, title: "Ferris wheel", fact: `“${quote.text}” — ${quote.author}` },
];
