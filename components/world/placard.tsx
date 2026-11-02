"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { CuboidCollider } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import { CanvasTexture, SRGBColorSpace, type Group } from "three";
import { PX, type Draw } from "./charts";
import type { Link, Place } from "./places";
import { openLink, player } from "./store";

/** Paper-and-ink palette shared with the HUD. */
export const PAPER = {
  board: "#f4efe5",
  edge: "#d9d1c3",
  ink: "#1f1b16",
  secondary: "#5e554a",
  muted: "#7b7266",
  chip: "#1f1b16",
  post: "#2b2824",
};


type Chip = { link: Link; x: number; y: number; w: number; h: number };

function fontFamily() {
  // next/font gives Geist a hashed family name; read it from the page
  const f = getComputedStyle(document.body).fontFamily;
  return f || "Geist, system-ui, sans-serif";
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(" ")) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > maxW && line) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    lines.push(line);
  }
  return lines;
}

/**
 * Lays the sign out with real text metrics and paints it into one canvas.
 * Returns the canvas, its size in metres and the link chips' pixel rects for hit testing.
 */
function paint(place: Place, widthM: number, sizeM: number) {
  const family = fontFamily();
  const W = Math.round(widthM * PX);
  const s = sizeM * PX;
  const pad = s * 1.3;
  const inner = W - pad * 2;
  const measure = document.createElement("canvas").getContext("2d")!;

  type Op = (g: CanvasRenderingContext2D) => void;
  const ops: Op[] = [];
  const chips: Chip[] = [];
  let y = pad + s * 0.3;

  const text = (t: string, size: number, color: string, weight: number, lh: number, gap: number, x = 0, maxW = inner) => {
    measure.font = `${weight} ${size}px ${family}`;
    const lines = wrap(measure, t, maxW);
    const top = y;
    ops.push((g) => {
      g.font = `${weight} ${size}px ${family}`;
      g.fillStyle = color;
      g.textBaseline = "top";
      lines.forEach((l, i) => g.fillText(l, pad + x, top + i * size * lh));
    });
    y += lines.length * size * lh + gap;
  };

  text(place.eyebrow, s * 0.82, PAPER.muted, 400, 1.3, s * 0.45);
  text(place.title, s * 1.5, PAPER.ink, 500, 1.15, s * 0.7);
  if (place.body) text(place.body, s, PAPER.secondary, 400, 1.42, s * 0.7);
  if (place.bullets) {
    for (const b of place.bullets) {
      const dotY = y + s * 0.62;
      ops.push((g) => {
        g.fillStyle = place.color;
        g.beginPath();
        g.arc(pad + s * 0.28, dotY, s * 0.2, 0, Math.PI * 2);
        g.fill();
      });
      text(b, s * 0.95, PAPER.ink, 400, 1.38, s * 0.45, s * 0.9, inner - s * 0.9);
    }
    y += s * 0.3;
  }
  if (place.links?.length) {
    const h = s * 2.1;
    const fs = s * 0.92;
    measure.font = `500 ${fs}px ${family}`;
    let x = 0;
    y += s * 0.2;
    for (const link of place.links) {
      const label = `${link.label}  ↗`;
      const w = measure.measureText(label).width + s * 1.6;
      if (x > 0 && x + w > inner) {
        x = 0;
        y += h + s * 0.5;
      }
      const chip = { link, x: pad + x, y, w, h };
      chips.push(chip);
      ops.push((g) => {
        g.fillStyle = PAPER.chip;
        g.beginPath();
        g.roundRect(chip.x, chip.y, chip.w, chip.h, Math.min(h / 2, s * 0.5));
        g.fill();
        g.font = `500 ${fs}px ${family}`;
        g.fillStyle = PAPER.board;
        g.textBaseline = "middle";
        g.fillText(label, chip.x + s * 0.8, chip.y + h / 2 + 1);
      });
      x += w + s * 0.5;
    }
    y += h;
  }
  const H = Math.ceil(y + pad);

  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = PAPER.board;
  g.fillRect(0, 0, W, H);
  // district colour band along the top: the road-sign plate detail
  g.fillStyle = place.color;
  g.fillRect(0, 0, W, Math.max(6, s * 0.28));
  for (const op of ops) op(g);
  return { canvas: c, widthM: W / PX, heightM: H / PX, chips, W, H };
}

/**
 * A freestanding sign that prints a place's full content: eyebrow, title, body, bullets and clickable links,
 * painted into one texture. `stand` is a tall two-post board, `lectern` a low tilted reading desk.
 */
export function Placard({
  place,
  width,
  size = 0.12,
  variant = "stand",
  position,
  rotationY = 0,
}: {
  place: Place;
  width: number;
  size?: number;
  variant?: "stand" | "lectern";
  position: [number, number, number];
  rotationY?: number;
}) {
  // paint with Geist once the web font is ready (usually already true by the time signs mount)
  const [fontsOk, setFontsOk] = useState(() => document.fonts?.status === "loaded");
  useEffect(() => {
    if (fontsOk) return;
    let live = true;
    document.fonts?.ready.then(() => live && setFontsOk(true));
    return () => {
      live = false;
    };
  }, [fontsOk]);
  const sign = useMemo(() => paint(place, width, size), [place, width, size, fontsOk]); // eslint-disable-line react-hooks/exhaustive-deps
  const tex = useMemo(() => {
    const t = new CanvasTexture(sign.canvas);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [sign]);
  useEffect(() => () => tex.dispose(), [tex]);

  const ref = useRef<Group>(null);
  const world = useMemo(() => {
    const c = Math.cos(place.rotY);
    const sn = Math.sin(place.rotY);
    return { x: place.x + position[0] * c + position[2] * sn, z: place.z - position[0] * sn + position[2] * c };
  }, [place, position]);
  useFrame(() => {
    if (ref.current) ref.current.visible = Math.hypot(player.x - world.x, player.z - world.z) < 70;
  });

  const hit = (e: ThreeEvent<PointerEvent | MouseEvent>) => {
    if (!e.uv) return null;
    const x = e.uv.x * sign.W;
    const y = (1 - e.uv.y) * sign.H;
    return sign.chips.find((c) => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) ?? null;
  };

  const height = sign.heightM;
  const lectern = variant === "lectern";
  const boardY = lectern ? 1.05 : 0.75 + height;
  const tilt = lectern ? -0.6 : 0;
  const colH = lectern ? 1.4 : 0.75 + height;

  return (
    <group ref={ref} position={position} rotation-y={rotationY}>
      <CuboidCollider args={[width / 2, colH / 2, 0.12]} position-y={colH / 2} />
      {lectern ? (
        <mesh position-y={0.5} castShadow>
          <boxGeometry args={[0.12, 1.0, 0.12]} />
          <meshStandardMaterial color={PAPER.post} metalness={0.4} roughness={0.5} />
        </mesh>
      ) : (
        [-1, 1].map((sd) => (
          <mesh key={sd} position={[sd * (width / 2 - 0.12), colH / 2, -0.04]} castShadow>
            <boxGeometry args={[0.07, colH, 0.07]} />
            <meshStandardMaterial color={PAPER.post} metalness={0.4} roughness={0.5} />
          </mesh>
        ))
      )}
      <group position-y={boardY} rotation-x={tilt}>
        {/* lectern pivots on the board's bottom edge, stand hangs from its top edge */}
        <group position-y={lectern ? height / 2 : -height / 2}>
          <RoundedBox args={[width + 0.06, height + 0.06, 0.05]} radius={0.03} smoothness={2} castShadow>
            <meshStandardMaterial color={PAPER.edge} roughness={0.9} />
          </RoundedBox>
          <mesh
            position-z={0.027}
            onClick={(e) => {
              const c = hit(e);
              if (!c || e.delta > 6) return;
              e.stopPropagation();
              openLink(c.link.url);
            }}
            onPointerMove={(e) => {
              document.body.style.cursor = hit(e) ? "pointer" : "";
            }}
            onPointerOut={() => (document.body.style.cursor = "")}
          >
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial map={tex} roughness={0.85} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/** Where each kind of landmark puts its sign, in the landmark's local frame. */
export function signFor(p: Place): {
  position: [number, number, number];
  rotationY?: number;
  width: number;
  size?: number;
  variant?: "stand" | "lectern";
} | null {
  switch (p.kind) {
    case "monolith":
      return { position: [-6.4, 0, -2.2], rotationY: 0.45, width: 4.6, size: 0.13 };
    case "tower":
      return { position: [0, 0, 3.1], width: 3.1, size: 0.12 };
    case "cabinet":
      return { position: [0, 0, 1.45], width: 1.8, size: 0.085, variant: "lectern" };
    case "kiosk":
      return { position: [0, 0, 4.3], width: 3.8, size: 0.13 };
    case "crystal":
      return { position: [0, 0, 1.75], width: 2.1, size: 0.1, variant: "lectern" };
    case "hq":
      return { position: [0, 0, 4.5], width: 5.2, size: 0.13 };
    case "billboard":
      return { position: [0, 0, 1.4], width: 3.4, size: 0.11, variant: "lectern" };
    case "hall":
      return { position: [0, 0, 3.3], width: 3.0, size: 0.11 };
    case "radio":
      return { position: [0, 0, 5.6], width: 4.4, size: 0.13 };
    default:
      return null;
  }
}

/* ───────────────────────── chart boards ───────────────────────── */

/** A standing board that shows one chart from ./charts. `scale` shrinks big charts physically. */
export function ChartBoard({
  chart,
  position,
  rotationY = 0,
  scale = 1,
}: {
  chart: Draw;
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
}) {
  const [fontsOk, setFontsOk] = useState(() => document.fonts?.status === "loaded");
  useEffect(() => {
    if (fontsOk) return;
    let live = true;
    document.fonts?.ready.then(() => live && setFontsOk(true));
    return () => {
      live = false;
    };
  }, [fontsOk]);
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    // draw at 1.5× for crisp text up close
    const k = 1.5;
    c.width = Math.round(chart.width * PX * k);
    c.height = Math.round(chart.height * PX * k);
    const g = c.getContext("2d")!;
    g.scale(k, k);
    g.fillStyle = PAPER.board;
    g.fillRect(0, 0, c.width, c.height);
    chart.draw(g, fontFamily());
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [chart, fontsOk]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => tex.dispose(), [tex]);

  const w = chart.width * scale;
  const h = chart.height * scale;
  const legs = 0.8;
  return (
    <group position={position} rotation-y={rotationY}>
      <CuboidCollider args={[w / 2, (legs + h) / 2, 0.15]} position-y={(legs + h) / 2} />
      {[-1, 1].map((sd) => (
        <mesh key={sd} position={[sd * (w / 2 - 0.15), (legs + h) / 2, -0.05]} castShadow>
          <boxGeometry args={[0.09, legs + h, 0.09]} />
          <meshStandardMaterial color={PAPER.post} metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
      <group position-y={legs + h / 2}>
        <RoundedBox args={[w + 0.08, h + 0.08, 0.06]} radius={0.03} smoothness={2} castShadow>
          <meshStandardMaterial color={PAPER.edge} roughness={0.9} />
        </RoundedBox>
        <mesh position-z={0.032}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial map={tex} roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

/** A flat plaque (no posts) for mounting a small chart, like a stat tile, on a surface. */
export function ChartPlaque({ chart, scale = 1 }: { chart: Draw; scale?: number }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    const k = 1.5;
    c.width = Math.round(chart.width * PX * k);
    c.height = Math.round(chart.height * PX * k);
    const g = c.getContext("2d")!;
    g.scale(k, k);
    g.fillStyle = PAPER.board;
    g.fillRect(0, 0, c.width, c.height);
    chart.draw(g, fontFamily());
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [chart]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh>
      <planeGeometry args={[chart.width * scale, chart.height * scale]} />
      <meshStandardMaterial map={tex} roughness={0.85} />
    </mesh>
  );
}
