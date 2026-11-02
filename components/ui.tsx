"use client";

import { animate, motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01";

/** Text that decodes from random glyphs into its final value. */
export function Scramble({
  text,
  className,
  delay = 0,
  trigger = "mount",
}: {
  text: string;
  className?: string;
  delay?: number;
  trigger?: "mount" | "hover";
}) {
  const [out, setOut] = useState(trigger === "mount" ? "" : text);
  const frame = useRef<number>(0);

  const run = () => {
    cancelAnimationFrame(frame.current);
    const start = performance.now() + delay;
    const duration = 40 * text.length + 300;
    const tick = (now: number) => {
      const p = Math.max(0, (now - start) / duration);
      const revealed = Math.floor(p * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " " || i < revealed) s += text[i];
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(p < 0 ? "" : s);
      if (p < 1) frame.current = requestAnimationFrame(tick);
      else setOut(text);
    };
    frame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (trigger === "mount") run();
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span
      className={className}
      aria-label={text}
      onMouseEnter={trigger === "hover" ? run : undefined}
    >
      <span aria-hidden>{out || " "}</span>
    </span>
  );
}

/** Pulls its child toward the pointer while hovered. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 });

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className="inline-block"
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function SectionHeader({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Reveal className="mb-14 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p className="mb-5 flex items-center gap-3 font-mono text-xs text-muted">
          <span className="text-signal">{index}</span>
          <span className="h-px w-10 bg-line-strong" />
          <Scramble text={label} trigger="hover" />
        </p>
        <h2 className="max-w-3xl text-4xl font-medium tracking-tight text-balance md:text-6xl">
          {title}
        </h2>
      </div>
      {children}
    </Reveal>
  );
}
