"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { studio, studioApps, type StudioApp } from "@/lib/data";
import { Magnetic, Reveal, SectionHeader } from "./ui";
import { Glyph } from "./work";

const FILTERS = ["All", "Game", "App"] as const;
const LABELS: Record<(typeof FILTERS)[number], string> = { All: "All", Game: "Games", App: "Apps" };

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
    <path d="M4 2.5v19l10-9.5L4 2.5Zm11.5 10.9-2.2 2.1 6.7 3.9c.7.4 1.4-.4 1-1l-5.5-5Zm0-2.8 5.5-5c.4-.6-.3-1.4-1-1l-6.7 3.9 2.2 2.1Z" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
    <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.6-1.9-1.5-.2-3 .9-3.7.9-.8 0-2-.9-3.2-.8-1.7 0-3.2 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8 2.1-1.2 2.9-2.4c.9-1.3 1.3-2.6 1.3-2.7 0 0-2.4-1-2.4-4ZM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4Z" />
  </svg>
);

function StoreLink({ href, store }: { href: string; store: "play" | "apple" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative z-10 flex items-center gap-1.5 border border-line-strong px-2.5 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-signal hover:text-signal"
    >
      {store === "play" ? <PlayIcon /> : <AppleIcon />}
      {store === "play" ? "Google Play" : "App Store"}
    </a>
  );
}

function AppRow({ app }: { app: StudioApp }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="group relative flex gap-5 border-b border-line p-5 transition-colors hover:bg-surface md:p-6"
    >
      {/* whole row opens the studio page; store buttons sit above it */}
      {app.page && (
        <a href={app.page} target="_blank" rel="noopener noreferrer" className="absolute inset-0" aria-label={`${app.title} on IYGroup`} />
      )}
      <Glyph mark={app.mark} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="truncate text-lg font-medium">{app.title}</h3>
          <span className="shrink-0 font-mono text-[10px] text-faint uppercase">{app.kind}</span>
        </div>
        <p className="mt-1 text-sm text-muted">{app.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {app.play && <StoreLink href={app.play} store="play" />}
          {app.appStore && <StoreLink href={app.appStore} store="apple" />}
        </div>
      </div>
    </motion.li>
  );
}

export function Studio() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = studioApps.filter((a) => filter === "All" || a.kind === filter);
  const onIos = studioApps.filter((a) => a.appStore).length;
  const onPlay = studioApps.filter((a) => a.play).length;

  return (
    <section id="studio" className="relative border-t border-line py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader index="05" label="IYGroup Studio" title="My own studio, shipping games & apps.">
          <p className="max-w-xs text-muted">
            {studio.tagline} Co-founded studio publishing on Google Play, the App Store and the web.
          </p>
        </SectionHeader>

        <Reveal className="hud mb-12 grid gap-8 border border-line bg-surface p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {[
              [studioApps.length, "games & apps"],
              [studioApps.filter((a) => a.kind === "Game").length, "games"],
              [onPlay, "on Google Play"],
              [onIos, "on the App Store"],
            ].map(([n, label]) => (
              <div key={label}>
                <p className="text-3xl font-medium tabular-nums">{n}</p>
                <p className="font-mono text-[11px] text-muted">{label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <a
                href={studio.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-signal px-4 py-3 font-mono text-xs font-medium text-bg"
              >
                <PlayIcon /> Developer on Google Play
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={studio.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-line-strong px-4 py-3 font-mono text-xs transition-colors hover:border-signal"
              >
                <AppleIcon /> Developer on App Store
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={studio.site}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-line-strong px-4 py-3 font-mono text-xs transition-colors hover:border-signal"
              >
                iygroup.vascario.com ↗
              </a>
            </Magnetic>
          </div>
        </Reveal>

        <div className="mb-6 flex border border-line md:w-max" role="tablist" aria-label="Filter studio titles">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`relative flex-1 px-4 py-2 font-mono text-xs transition-colors ${
                filter === f ? "text-bg" : "text-muted hover:text-ink"
              }`}
            >
              {filter === f && <motion.span layoutId="studio-filter" className="absolute inset-0 bg-signal" />}
              <span className="relative">
                {LABELS[f]}
                <span className="ml-1.5 opacity-60">
                  {f === "All" ? studioApps.length : studioApps.filter((a) => a.kind === f).length}
                </span>
              </span>
            </button>
          ))}
        </div>

        <motion.ul layout className="grid border-t border-line md:grid-cols-2 md:[&>li:nth-child(odd)]:border-r">
          <AnimatePresence mode="popLayout">
            {shown.map((a) => (
              <AppRow key={a.title} app={a} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
