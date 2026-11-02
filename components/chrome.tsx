"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile, studio } from "@/lib/data";

export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "studio", label: "Studio" },
  { id: "credentials", label: "Credentials" },
  { id: "terminal", label: "Terminal" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

export const openPalette = () => window.dispatchEvent(new Event("palette:open"));
export const toast = (message: string) =>
  window.dispatchEvent(new CustomEvent("toast", { detail: message }));

export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email);
    toast("Email copied to clipboard");
  } catch {
    window.location.href = `mailto:${profile.email}`;
  }
}

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

export function Nav() {
  const time = useClock();
  const active = useActiveSection();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:px-8">
        <a href="#top" className="flex items-center gap-2 font-mono text-sm font-medium">
          <span className="grid size-7 place-items-center bg-signal text-bg">{profile.initials}</span>
          <span className="hidden sm:inline">yash.rank</span>
          <span className="h-4 w-2 animate-blink bg-signal" />
        </a>

        <nav className="hidden items-center gap-1 xl:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`relative px-3 py-2 font-mono text-xs transition-colors ${
                active === s.id ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {active === s.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 border border-line-strong bg-raised"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{s.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-xs text-muted tabular-nums md:inline">
            IST {time}
          </span>
          <a
            href="/world"
            className="flex items-center gap-2 border border-signal bg-signal-dim px-3 py-1.5 font-mono text-xs text-signal transition-colors hover:bg-signal hover:text-bg"
          >
            <span className="size-1.5 bg-current" />
            3D World
          </a>
          <button
            onClick={openPalette}
            className="flex items-center gap-2 border border-line-strong px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-signal hover:text-ink"
          >
            <span className="hidden sm:inline">Command</span>
            <kbd className="bg-raised px-1.5 text-[10px] text-ink">⌘K</kbd>
          </button>
          <button
            className="grid size-9 place-items-center border border-line-strong xl:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="flex w-4 flex-col gap-1">
              <span className={`h-px bg-ink transition ${open ? "translate-y-[2.5px] rotate-45" : ""}`} />
              <span className={`h-px bg-ink transition ${open ? "-translate-y-[2.5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-line xl:hidden"
          >
            <div className="grid gap-1 px-4 py-4">
              {SECTIONS.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 py-2 text-2xl font-medium"
                >
                  <span className="font-mono text-xs text-signal">0{i + 1}</span>
                  {s.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-signal"
    />
  );
}

/** Crosshair cursor with a trailing ring that locks onto interactive elements. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let target: HTMLElement | null = null;
    let raf = 0;

    const SELECTOR = "a, button, input, textarea, [data-cursor]";
    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      target = (e.target as HTMLElement).closest(SELECTOR);
    };
    // content moves under a still pointer while scrolling, so re-pick the target
    const onScroll = () => {
      target = document.elementFromPoint(pos.x, pos.y)?.closest<HTMLElement>(SELECTOR) ?? null;
    };

    const loop = () => {
      let tx = pos.x;
      let ty = pos.y;
      let size = 32;
      if (target) {
        const r = target.getBoundingClientRect();
        if (r.width < 260 && r.height < 80) {
          tx = r.left + r.width / 2;
          ty = r.top + r.height / 2;
          size = Math.max(r.width, r.height) + 14;
        } else size = 56;
      }
      ringPos.x += (tx - ringPos.x) * 0.2;
      ringPos.y += (ty - ringPos.y) * 0.2;
      if (dot.current) dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
        ring.current.style.width = ring.current.style.height = `${size}px`;
        ring.current.style.borderColor = target ? "var(--color-signal)" : "rgb(255 255 255 / 0.3)";
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed top-0 left-0 z-[70] border transition-[width,height,border-color] duration-200"
        style={{ translate: "-50% -50%" }}
      />
      <div
        ref={dot}
        className="pointer-events-none fixed top-0 left-0 z-[70] size-1.5 bg-signal"
        style={{ translate: "-50% -50%" }}
      />
    </>
  );
}

export function Toaster() {
  const [msg, setMsg] = useState<{ id: number; text: string } | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      setMsg({ id: Date.now(), text: (e as CustomEvent<string>).detail });
      clearTimeout(timer);
      timer = setTimeout(() => setMsg(null), 2400);
    };
    window.addEventListener("toast", on);
    return () => window.removeEventListener("toast", on);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2" role="status">
      <AnimatePresence>
        {msg && (
          <motion.div
            key={msg.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="flex items-center gap-3 border border-signal bg-surface px-4 py-3 font-mono text-xs"
          >
            <span className="size-1.5 bg-signal" />
            {msg.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type Command = { group: string; label: string; hint?: string; run: () => void };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const go = (id: string) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    const open = (url: string) => () => window.open(url, "_blank", "noopener");
    return [
      ...SECTIONS.map((s) => ({ group: "Navigate", label: s.label, hint: `#${s.id}`, run: go(s.id) })),
      { group: "Navigate", label: "Back to top", hint: "#top", run: go("top") },
      { group: "Navigate", label: "Explore the 3D world", hint: "/world", run: () => (location.href = "/world") },
      { group: "Actions", label: "Copy email address", hint: profile.email, run: copyEmail },
      { group: "Actions", label: "Open resume", hint: "Google Drive", run: open(profile.resume) },
      { group: "Actions", label: "Send an email", hint: "mailto", run: () => (location.href = `mailto:${profile.email}`) },
      { group: "Links", label: "GitHub", hint: "yash1001-sojitra", run: open(profile.socials.github) },
      { group: "Links", label: "LinkedIn", hint: "yashkumar-rank", run: open(profile.socials.linkedin) },
      { group: "Links", label: "Medium", hint: "@yashsojitra0", run: open(profile.socials.medium) },
      { group: "Studio", label: "IYGroup website", hint: "iygroup.vascario.com", run: open(studio.site) },
      { group: "Studio", label: "Developer on Google Play", hint: "Play Store", run: open(studio.playStore) },
      { group: "Studio", label: "Developer on App Store", hint: "App Store", run: open(studio.appStore) },
    ];
  }, []);

  const results = commands.filter((c) =>
    `${c.group} ${c.label} ${c.hint}`.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      requestAnimationFrame(() => input.current?.focus());
    }
  }, [open]);

  const execute = (c?: Command) => {
    if (!c) return;
    setOpen(false);
    c.run();
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center bg-bg/70 px-4 pt-[15vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-label="Command palette"
            className="hud w-full max-w-xl border border-line-strong bg-surface shadow-2xl"
            initial={{ y: -12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -12, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span className="font-mono text-sm text-signal">&gt;</span>
              <input
                ref={input}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setIndex((i) => Math.min(i + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setIndex((i) => Math.max(i - 1, 0));
                  } else if (e.key === "Enter") execute(results[index]);
                }}
                placeholder="Jump to a section, copy email, open links…"
                className="h-14 w-full bg-transparent font-mono text-sm outline-none placeholder:text-faint"
              />
              <kbd className="font-mono text-[10px] text-faint">ESC</kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center font-mono text-xs text-muted">No matches</li>
              )}
              {results.map((c, i) => {
                const header = c.group !== lastGroup;
                lastGroup = c.group;
                return (
                  <li key={c.group + c.label}>
                    {header && (
                      <p className="px-3 pt-3 pb-1 font-mono text-[10px] text-faint">{c.group}</p>
                    )}
                    <button
                      onMouseEnter={() => setIndex(i)}
                      onClick={() => execute(c)}
                      className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm ${
                        i === index ? "bg-signal-dim text-ink" : "text-muted"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`size-1.5 ${i === index ? "bg-signal" : "bg-faint"}`} />
                        {c.label}
                      </span>
                      <span className="font-mono text-xs text-faint">{c.hint}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
