import { education, experience, projects, skillGroups, studioApps, type ProjectKind } from "@/lib/data";

/**
 * Canvas renderers for the in-world data boards. Everything is drawn on the paper sign surface,
 * text in ink tokens, colour only on marks. Palette validated on #f4efe5 (scripts/validate_palette.js):
 * all hard checks pass; three slots sit under 3:1 so every coloured mark carries a direct label.
 */

export const INK = { primary: "#1f1b16", secondary: "#5e554a", muted: "#7b7266", grid: "rgba(31,27,22,0.10)", surface: "#f4efe5" };
export const SERIES = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100"] as const;
/** De-emphasis for "context" marks, e.g. past jobs next to the current one. */
const QUIET = "#b9b1a4";

/** Fixed kind → hue order; the towers on Main Street use the same mapping. */
export const KIND_HUE: Record<ProjectKind, string> = { AI: SERIES[0], Web: SERIES[1], Mobile: SERIES[2], Desktop: SERIES[3] };
const KIND_ORDER: ProjectKind[] = ["AI", "Web", "Mobile", "Desktop"];

/** Canvas pixels per metre of board. */
export const PX = 240;

export type Draw = { width: number; height: number; draw: (g: CanvasRenderingContext2D, family: string) => void };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "Mar 2024" → fractional year; "Present" → now. */
function toYear(s: string) {
  const t = s.trim();
  if (/present/i.test(t)) {
    const d = new Date();
    return d.getFullYear() + d.getMonth() / 12;
  }
  const [m, y] = t.split(" ");
  return Number(y) + Math.max(0, MONTHS.indexOf(m)) / 12;
}
const span = (period: string) => period.split("—").map(toYear) as [number, number];

function duration(years: number) {
  const months = Math.round(years * 12);
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr` : "", m ? `${m} mo` : ""].filter(Boolean).join(" ");
}

function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.roundRect(x, y, Math.max(w, 1), h, Math.min(r, w / 2, h / 2));
  g.fill();
}

function text(g: CanvasRenderingContext2D, family: string, s: string, x: number, y: number, size: number, color: string, weight = 400, align: CanvasTextAlign = "left") {
  g.font = `${weight} ${size}px ${family}`;
  g.fillStyle = color;
  g.textAlign = align;
  g.textBaseline = "alphabetic";
  g.fillText(s, x, y);
}

/** Direct label for a bar: inside when it fits (white on the accent), otherwise just past the bar end in ink. */
function barLabel(g: CanvasRenderingContext2D, family: string, s: string, a: number, b: number, y: number, size: number, lead: boolean, maxX: number) {
  g.font = `500 ${size}px ${family}`;
  const w = g.measureText(s).width;
  if (w + 32 <= b - a) text(g, family, s, a + 16, y, size, lead ? "#ffffff" : INK.primary, 500);
  else if (b + 14 + w <= maxX) text(g, family, s, b + 14, y, size, INK.primary, 500);
  else text(g, family, s, a - 14, y, size, INK.primary, 500, "right");
}

function header(g: CanvasRenderingContext2D, family: string, W: number, title: string, sub: string, accent: string) {
  g.fillStyle = accent;
  g.fillRect(0, 0, W, 8);
  text(g, family, sub, 48, 72, 26, INK.muted);
  text(g, family, title, 48, 122, 46, INK.primary, 500);
}

/** Year axis: ticks + gridlines on a recessive grid, labels in muted ink. */
function yearAxis(g: CanvasRenderingContext2D, family: string, x0: number, x1: number, top: number, bottom: number, from: number, to: number, step = 1) {
  const X = (y: number) => x0 + ((y - from) / (to - from)) * (x1 - x0);
  for (let y = Math.ceil(from); y <= to; y += step) {
    const x = X(y);
    g.fillStyle = INK.grid;
    g.fillRect(x, top, 2, bottom - top);
    text(g, family, String(y), x, bottom + 34, 24, INK.muted, 400, "center");
  }
  return X;
}

/* ───────────────────────── career ───────────────────────── */

/** Timeline of roles on a shared year axis; the current role carries the accent, past roles stay quiet. */
export function careerChart(): Draw {
  const jobs = [...experience].map((j) => ({ ...j, span: span(j.period) })).sort((a, b) => a.span[0] - b.span[0]);
  const from = Math.floor(jobs[0].span[0]);
  const to = Math.ceil(Math.max(...jobs.map((j) => j.span[1])) + 0.05);
  const total = jobs.reduce((s, j) => s + (j.span[1] - j.span[0]), 0);
  const W = 1320;
  const rowH = 120;
  const top = 200;
  const H = top + jobs.length * rowH + 140;
  return {
    width: W / PX,
    height: H / PX,
    draw: (g, family) => {
      header(g, family, W, `${duration(total)} of professional work`, "Career timeline", SERIES[0]);
      const x0 = 420;
      const x1 = W - 70;
      const X = yearAxis(g, family, x0, x1, top - 20, top + jobs.length * rowH, from, to);
      jobs.forEach((j, i) => {
        const y = top + i * rowH + 26;
        text(g, family, j.company, 48, y + 22, 32, INK.primary, 500);
        text(g, family, j.role.split(" · ")[0], 48, y + 58, 22, INK.secondary);
        const a = X(j.span[0]);
        const b = X(j.span[1]);
        g.fillStyle = j.current ? SERIES[0] : QUIET;
        rr(g, a, y - 6, b - a, 44, 8);
        barLabel(g, family, `${duration(j.span[1] - j.span[0])}${j.current ? " · current" : ""}`, a, b, y + 24, 24, j.current, W - 24);
      });
      // today marker
      const now = X(toYear("Present"));
      g.fillStyle = INK.primary;
      for (let y = top - 24; y < top + jobs.length * rowH; y += 14) g.fillRect(now - 1, y, 2, 8);
      text(g, family, "Today", now, top - 34, 22, INK.primary, 500, "center");
    },
  };
}

/* ───────────────────────── education ───────────────────────── */

const shortTitle = (t: string) => t.split(",")[0].replace(/\s*\(.*\)/, "");
const result = (note: string) => (/percentile|CGPA/i.test(note) ? note.replace(/^Graduated with an? /, "").replace(/\.$/, "") : "");

/** Ten years of study as consecutive bars on one axis, each labelled with its school and result. */
export function educationChart(): Draw {
  const rows = [...education]
    .map((e) => ({ ...e, span: e.period.match(/\d{4}/g)!.map(Number) as [number, number] }))
    .sort((a, b) => a.span[0] - b.span[0]);
  const years = education.flatMap((e) => e.period.match(/\d{4}/g)!.map(Number));
  const from = Math.min(...years);
  const to = Math.max(...years);
  const W = 1320;
  const rowH = 112;
  const top = 200;
  const H = top + rows.length * rowH + 130;
  return {
    width: W / PX,
    height: H / PX,
    draw: (g, family) => {
      header(g, family, W, `${to - from} years of study, ${from}–${to}`, "Education timeline", SERIES[0]);
      const x0 = 470;
      const x1 = W - 60;
      const X = yearAxis(g, family, x0, x1, top - 20, top + rows.length * rowH, from, to, 2);
      rows.forEach((r, i) => {
        const y = top + i * rowH + 24;
        text(g, family, shortTitle(r.title), 48, y + 20, 30, INK.primary, 500);
        text(g, family, r.school.length > 30 ? `${r.school.slice(0, 29)}…` : r.school, 48, y + 54, 21, INK.secondary);
        // 4px surface gap where one stage ends and the next begins
        const a = X(r.span[0]) + 2;
        const b = X(r.span[1]) - 2;
        // the latest degree leads; earlier schooling is context
        const lead = i === rows.length - 1;
        g.fillStyle = lead ? SERIES[0] : QUIET;
        rr(g, a, y - 6, b - a, 42, 8);
        const label = result(r.note) || (lead ? "Latest degree" : r.period.replace(" — ", "–"));
        barLabel(g, family, label, a, b, y + 23, 22, lead, W - 24);
      });
    },
  };
}

/* ───────────────────────── projects ───────────────────────── */

/** One whole split by kind (tall segmented bar with counts), then every project listed under its kind. */
export function projectsChart(): Draw {
  const counts = KIND_ORDER.map((k) => ({ kind: k, n: projects.filter((p) => p.kind === k).length })).filter((c) => c.n);
  const W = 1200;
  const listTop = 330;
  const rowH = 62;
  const H = listTop + projects.length * rowH + counts.length * 30 + 60;
  return {
    width: W / PX,
    height: H / PX,
    draw: (g, family) => {
      header(g, family, W, `${projects.length} shipped products`, "Main Street · by kind", SERIES[0]);
      // tall segmented bar: widths proportional to counts, 4px surface gap between blocks
      const x0 = 48;
      const x1 = W - 48;
      const gap = 4;
      const unit = (x1 - x0 - gap * (counts.length - 1)) / projects.length;
      let x = x0;
      for (const c of counts) {
        const w = unit * c.n;
        g.fillStyle = KIND_HUE[c.kind];
        rr(g, x, 170, w, 64, 8);
        // a block too narrow for "Kind n" prints just the count, or nothing; the list below names every kind
        g.font = `500 26px ${family}`;
        const full = `${c.kind} ${c.n}`;
        const label = g.measureText(full).width + 28 <= w ? full : g.measureText(String(c.n)).width + 28 <= w ? String(c.n) : "";
        if (label) text(g, family, label, x + 14, 213, 26, c.kind === "AI" ? "#ffffff" : INK.primary, 500);
        x += w + gap;
      }
      text(g, family, "Tower colour on Main Street matches its kind", 48, 280, 22, INK.muted);
      // grouped list with swatches
      let y = listTop;
      for (const c of counts) {
        text(g, family, c.kind, 48, y + 8, 22, INK.muted, 500);
        y += 30;
        for (const p of projects.filter((q) => q.kind === c.kind)) {
          g.fillStyle = KIND_HUE[c.kind];
          rr(g, 48, y - 2, 14, 30, 4);
          text(g, family, p.title, 80, y + 22, 28, INK.primary, 500);
          const status = p.url ? (p.urlLabel ?? "Live") : "Private";
          text(g, family, status, W - 48, y + 22, 22, p.url ? INK.secondary : INK.muted, 400, "right");
          y += rowH;
        }
      }
    },
  };
}

/* ───────────────────────── studio ───────────────────────── */

/** Games vs apps split, then an availability table: one row per title, one column per store. */
export function studioChart(): Draw {
  const games = studioApps.filter((a) => a.kind === "Game");
  const apps = studioApps.filter((a) => a.kind === "App");
  const W = 1200;
  const top = 320;
  const rowH = 50;
  const H = top + 60 + studioApps.length * rowH + 50;
  return {
    width: W / PX,
    height: H / PX,
    draw: (g, family) => {
      header(g, family, W, `${studioApps.length} titles from IYGroup Studio`, "Boardwalk Arcade · catalogue", SERIES[0]);
      const x0 = 48;
      const x1 = W - 48;
      const gap = 4;
      const unit = (x1 - x0 - gap) / studioApps.length;
      const parts = [
        { label: `Games ${games.length}`, n: games.length, color: SERIES[0], ink: "#ffffff" },
        { label: `Apps ${apps.length}`, n: apps.length, color: SERIES[1], ink: INK.primary },
      ];
      let x = x0;
      for (const p of parts) {
        g.fillStyle = p.color;
        rr(g, x, 170, unit * p.n, 64, 8);
        text(g, family, p.label, x + 16, 213, 26, p.ink, 500);
        x += unit * p.n + gap;
      }
      // availability table
      const colPlay = W - 300;
      const colApple = W - 120;
      text(g, family, "Title", 48, top, 22, INK.muted, 500);
      text(g, family, "Google Play", colPlay, top, 22, INK.muted, 500, "center");
      text(g, family, "App Store", colApple, top, 22, INK.muted, 500, "center");
      g.fillStyle = INK.grid;
      g.fillRect(48, top + 16, W - 96, 2);
      const sorted = [...games, ...apps];
      sorted.forEach((a, i) => {
        const y = top + 60 + i * rowH;
        g.fillStyle = a.kind === "Game" ? SERIES[0] : SERIES[1];
        rr(g, 48, y - 22, 10, 28, 3);
        text(g, family, a.title, 74, y, 25, INK.primary);
        const dot = (cx: number, on: boolean) => {
          g.beginPath();
          g.arc(cx, y - 8, 11, 0, Math.PI * 2);
          if (on) {
            g.fillStyle = INK.primary;
            g.fill();
          } else {
            g.strokeStyle = INK.grid;
            g.lineWidth = 3;
            g.stroke();
          }
        };
        dot(colPlay, !!a.play);
        dot(colApple, !!a.appStore);
      });
      const onPlay = studioApps.filter((a) => a.play).length;
      const onApple = studioApps.filter((a) => a.appStore).length;
      text(g, family, `${onPlay} on Google Play · ${onApple} on the App Store · filled dot = available`, 48, H - 24, 21, INK.muted);
    },
  };
}

/* ───────────────────────── stack ───────────────────────── */

/** The stack as a table: one column per skill group, items listed beneath. */
export function stackChart(): Draw {
  const cols = 3;
  const W = 1320;
  const cellW = (W - 96) / cols;
  const rows = Math.ceil(skillGroups.length / cols);
  const cellH = 300;
  const H = 190 + rows * cellH + 30;
  const total = skillGroups.reduce((s, gp) => s + gp.items.length, 0);
  return {
    width: W / PX,
    height: H / PX,
    draw: (g, family) => {
      header(g, family, W, `${total} tools across ${skillGroups.length} areas`, "Botanic Garden · the stack", SERIES[0]);
      skillGroups.forEach((gp, i) => {
        const cx = 48 + (i % cols) * cellW;
        const cy = 190 + Math.floor(i / cols) * cellH;
        g.fillStyle = INK.grid;
        g.fillRect(cx, cy, cellW - 24, 2);
        text(g, family, gp.name, cx, cy + 44, 30, INK.primary, 500);
        gp.items.forEach((it, k) => text(g, family, it, cx, cy + 92 + k * 40, 23, INK.secondary));
      });
    },
  };
}

/* ───────────────────────── stat tile ───────────────────────── */

/** Label + value, nothing else: four headline numbers with different units stay separate tiles. */
export function statTile(value: string, label: string): Draw {
  const W = 300;
  const H = 230;
  return {
    width: W / PX,
    height: H / PX,
    draw: (g, family) => {
      text(g, family, label, 24, 52, 26, INK.secondary);
      text(g, family, value, 24, 168, 96, INK.primary, 500);
    },
  };
}
