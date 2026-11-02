"use client";

import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { certificates, projects, type Project, type ProjectKind } from "@/lib/data";
import { Education } from "./sections";
import { SectionHeader } from "./ui";

const FILTERS: ("All" | ProjectKind)[] = ["All", ...new Set(projects.map((p) => p.kind))];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgb(200 255 46 / 0.14), transparent 60%)`;

  const Tag = project.url ? motion.a : motion.div;
  const linkProps = project.url ? { href: project.url, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      style={{ perspective: 1000 }}
      className={index === 0 ? "md:col-span-2 md:row-span-2" : ""}
    >
      <Tag
        {...linkProps}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          mx.set(px * 100);
          my.set(py * 100);
          rx.set((0.5 - py) * 8);
          ry.set((px - 0.5) * 8);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        className="hud group relative flex h-full min-h-[300px] flex-col overflow-hidden border border-line bg-surface p-6 md:p-8"
      >
        <motion.div style={{ background: spotlight }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex items-start justify-between font-mono text-[11px] text-muted">
          <span>
            {String(index + 1).padStart(2, "0")} / {project.kind}
          </span>
          <span className={project.url ? "text-faint transition-colors group-hover:text-signal" : "text-faint"}>
            {project.url ? (project.urlLabel ?? "Live") + " ↗" : "Private"}
          </span>
        </div>

        <div
          className="relative my-8 flex flex-1 items-center justify-center"
          style={{ transform: "translateZ(40px)" }}
        >
          <Glyph mark={project.mark} size={index === 0 ? "lg" : "md"} />
        </div>

        <div className="relative" style={{ transform: "translateZ(24px)" }}>
          <h3 className={`font-medium tracking-tight ${index === 0 ? "text-4xl md:text-5xl" : "text-2xl"}`}>
            {project.title}
          </h3>
          <p className="mt-2 text-muted">{project.description}</p>
        </div>
      </Tag>
    </motion.div>
  );
}

/** Project badge: monogram inside a rotating reticle. */
const GLYPH_SIZES = {
  sm: ["size-14", "text-sm"],
  md: ["size-24", "text-2xl"],
  lg: ["size-48", "text-5xl"],
} as const;

export function Glyph({ mark, size = "md" }: { mark: string; size?: keyof typeof GLYPH_SIZES }) {
  const [box, text] = GLYPH_SIZES[size];
  return (
    <div className={`relative grid shrink-0 place-items-center ${box}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-[spin_24s_linear_infinite] text-line-strong transition-colors group-hover:text-signal">
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeDasharray="2 6" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeDasharray="20 10" opacity=".6" />
      </svg>
      <span className={`font-mono font-medium ${text}`}>{mark}</span>
    </div>
  );
}

export function Work() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = projects.filter((p) => filter === "All" || p.kind === filter);

  return (
    <section id="work" className="relative border-t border-line py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader index="04" label="Selected work" title="Products in the wild.">
          <div className="flex border border-line" role="tablist" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`relative px-4 py-2 font-mono text-xs transition-colors ${
                  filter === f ? "text-bg" : "text-muted hover:text-ink"
                }`}
              >
                {filter === f && <motion.span layoutId="work-filter" className="absolute inset-0 bg-signal" />}
                <span className="relative">
                  {f}
                  <span className="ml-1.5 opacity-60">
                    {f === "All" ? projects.length : projects.filter((p) => p.kind === f).length}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </SectionHeader>

        <motion.div layout className="grid auto-rows-fr gap-4 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export function Credentials() {
  const [open, setOpen] = useState<number | null>(null);

  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + certificates.length) % certificates.length)),
    [],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const row = [...certificates, ...certificates];

  return (
    <section id="credentials" className="relative border-t border-line py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader index="06" label="Credentials" title="Education & certifications.">
          <p className="max-w-xs text-muted">
            {certificates.length} certificates. Hover to pause, click to inspect.
          </p>
        </SectionHeader>
        <Education />
      </div>

      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]" style={{ animationDuration: "90s" }}>
          {row.map((c, i) => (
            <button
              key={i}
              onClick={() => setOpen(i % certificates.length)}
              className="group relative h-48 w-64 shrink-0 overflow-hidden border border-line bg-surface md:h-56 md:w-80"
              aria-label={`View ${c.title}`}
            >
              <Image src={c.src} alt="" fill sizes="320px" className="object-cover opacity-60 grayscale transition duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0" />
              <span className="absolute inset-x-0 bottom-0 bg-bg/85 px-3 py-2 text-left font-mono text-[10px] text-muted backdrop-blur">
                {c.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6 bg-bg/90 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-label={certificates[open].title}
          >
            <motion.div
              key={open}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="hud relative h-[70vh] w-full max-w-5xl border border-line-strong bg-surface"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={certificates[open].src} alt={certificates[open].title} fill sizes="90vw" className="object-contain p-2" />
            </motion.div>
            <div className="flex items-center gap-6 font-mono text-xs text-muted" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => step(-1)} className="border border-line-strong px-3 py-2 hover:border-signal">← Prev</button>
              <span>
                {certificates[open].title} · {open + 1}/{certificates.length}
              </span>
              <button onClick={() => step(1)} className="border border-line-strong px-3 py-2 hover:border-signal">Next →</button>
            </div>
            <button onClick={() => setOpen(null)} className="absolute top-6 right-6 font-mono text-xs text-muted hover:text-signal">
              ESC ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
