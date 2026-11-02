"use client";

import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; t: number };

/**
 * Dotted field that bends around the pointer like a gravity well.
 * Clicking emits a shockwave that travels through the grid.
 */
export function Field() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const GAP = 26;
    const RADIUS = 180;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    const pointer = { x: -9999, y: -9999, sx: -9999, sy: -9999 };
    const ripples: Ripple[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY - r.top > h) return;
      ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
      if (ripples.length > 6) ripples.shift();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      pointer.sx += (pointer.x - pointer.sx) * 0.12;
      pointer.sy += (pointer.y - pointer.sy) * 0.12;
      if (pointer.x < -1000) {
        pointer.sx = pointer.x;
        pointer.sy = pointer.y;
      }

      const drift = reduced ? 0 : now * 0.0004;
      const cols = Math.ceil(w / GAP) + 1;
      const rows = Math.ceil(h / GAP) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let x = i * GAP;
          let y = j * GAP;
          // slow ambient swell so the field never sits dead still
          const swell = Math.sin(i * 0.25 + drift) * Math.cos(j * 0.22 + drift * 1.3);
          let energy = Math.max(0, swell) * 0.25;

          const dx = x - pointer.sx;
          const dy = y - pointer.sy;
          const d = Math.hypot(dx, dy);
          if (d < RADIUS) {
            const f = 1 - d / RADIUS;
            x -= dx * f * 0.35;
            y -= dy * f * 0.35;
            energy = Math.max(energy, f);
          }

          for (const r of ripples) {
            const age = (now - r.t) / 1000;
            const front = age * 520;
            const rd = Math.hypot(i * GAP - r.x, j * GAP - r.y);
            const band = 1 - Math.abs(rd - front) / 40;
            if (band > 0) {
              const fade = Math.max(0, 1 - age / 1.6);
              const push = band * fade * 14;
              x += ((i * GAP - r.x) / (rd || 1)) * push;
              y += ((j * GAP - r.y) / (rd || 1)) * push;
              energy = Math.max(energy, band * fade);
            }
          }

          const size = 1 + energy * 2.2;
          ctx.fillStyle =
            energy > 0.35
              ? `rgba(200,255,46,${0.35 + energy * 0.65})`
              : `rgba(255,255,255,${0.1 + energy * 0.5})`;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }

      while (ripples.length && now - ripples[0].t > 1800) ripples.shift();
      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerleave", onLeave);

    // pause rendering while the hero is off-screen
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
