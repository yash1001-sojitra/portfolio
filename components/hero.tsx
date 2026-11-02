"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { profile, roles, stats } from "@/lib/data";
import { Field } from "./field";
import { Counter, Magnetic, Scramble } from "./ui";

function RoleTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-flex h-[1.2em] overflow-hidden align-bottom text-signal">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}
          className="whitespace-nowrap"
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16">
      <Field />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-bg)_85%)]" />

      {/* HUD readouts */}
      <div className="pointer-events-none absolute inset-x-0 top-20 mx-auto flex max-w-7xl justify-between px-4 font-mono text-[11px] text-muted md:px-8">
        <span className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping bg-signal opacity-60" />
            <span className="relative size-2 bg-signal" />
          </span>
          Available for consultancy &amp; freelance
        </span>
        <span className="hidden sm:inline">
          {profile.location} · {profile.coords}
        </span>
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-24 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 font-mono text-sm text-muted"
        >
          <span className="text-signal">//</span> {profile.role} — {profile.tagline}
        </motion.p>

        <h1 className="text-[clamp(3.2rem,11vw,10rem)] leading-[0.88] font-semibold tracking-[-0.045em]">
          <Scramble text="Yashkumar" className="block" delay={150} />
          <span className="flex items-baseline gap-4">
            <Scramble text="Rank" delay={450} />
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
              className="mb-[0.12em] hidden h-[0.08em] flex-1 origin-left bg-signal md:block"
            />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 max-w-2xl text-xl text-muted md:text-2xl"
        >
          I design and ship <RoleTicker />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <a
              href="#work"
              className="group flex items-center gap-3 bg-signal px-6 py-4 font-mono text-sm font-medium text-bg"
            >
              See my work
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-line-strong px-6 py-4 font-mono text-sm transition-colors hover:border-signal"
            >
              Resume ↗
            </a>
          </Magnetic>
          <span className="hidden font-mono text-xs text-faint md:inline">
            Click anywhere on the field to send a pulse
          </span>
        </motion.div>
      </div>

      <div className="relative border-t border-line bg-bg/60 backdrop-blur">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-4 py-6 md:px-8 ${i > 0 ? "md:border-l" : ""} ${i % 2 ? "border-l" : ""} ${
                i > 1 ? "border-t md:border-t-0" : ""
              } border-line`}
            >
              <dt className="font-mono text-[11px] text-muted">{s.label}</dt>
              <dd className="mt-1 text-3xl font-medium tabular-nums md:text-4xl">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
