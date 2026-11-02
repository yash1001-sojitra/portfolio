"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { experience, posts, profile, projects, skillGroups, studio, studioApps } from "@/lib/data";
import { copyEmail } from "./chrome";
import { SectionHeader } from "./ui";

type Line = { id: number; node: ReactNode };

const HELP: [string, string][] = [
  ["whoami", "who is this person"],
  ["skills", "stack by domain"],
  ["experience", "work history"],
  ["projects", "selected work"],
  ["open <n>", "open project n in a new tab"],
  ["studio", "IYGroup games & apps"],
  ["blog", "latest articles"],
  ["contact", "ways to reach me"],
  ["email", "copy email to clipboard"],
  ["resume", "open resume"],
  ["goto <section>", "scroll to a section"],
  ["clear", "clear the screen"],
];

const COMMANDS = [...HELP.map(([c]) => c.split(" ")[0]), "help", "sudo", "ls", "date", "echo", "hire"];

const Accent = ({ children }: { children: ReactNode }) => <span className="text-signal">{children}</span>;

function run(raw: string): ReactNode | "clear" {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  const arg = args.join(" ");

  switch (cmd?.toLowerCase()) {
    case "":
      return null;
    case "help":
      return (
        <div className="grid grid-cols-[150px_1fr] gap-x-4">
          {HELP.map(([c, d]) => (
            <div key={c} className="contents">
              <Accent>{c}</Accent>
              <span className="text-muted">{d}</span>
            </div>
          ))}
        </div>
      );
    case "whoami":
      return (
        <p>
          <Accent>{profile.name}</Accent> — {profile.role}. {profile.tagline}.
          <br />
          <span className="text-muted">Based in {profile.location}. Leads a 15-member engineering team.</span>
        </p>
      );
    case "skills":
      return skillGroups.map((g) => (
        <p key={g.id}>
          <Accent>{g.name.padEnd(16, " ")}</Accent>
          <span className="text-muted">{g.items.join(" · ")}</span>
        </p>
      ));
    case "experience":
      return experience.map((j) => (
        <p key={j.company}>
          <Accent>{j.company}</Accent> <span className="text-muted">[{j.period}]</span> {j.role}
        </p>
      ));
    case "projects":
    case "ls":
      return (
        <>
          {projects.map((p, i) => (
            <p key={p.title}>
              <span className="text-faint">[{i + 1}]</span> <Accent>{p.title}</Accent>{" "}
              <span className="text-muted">— {p.description}</span>
            </p>
          ))}
          <p className="mt-2 text-faint">tip: open 2</p>
        </>
      );
    case "open": {
      const p = projects[Number(arg) - 1];
      if (!p) return <span className="text-flare">usage: open &lt;1-{projects.length}&gt;</span>;
      if (!p.url) return <span className="text-muted">{p.title} is private; no public link yet.</span>;
      window.open(p.url, "_blank", "noopener");
      return <span>Opening {p.title}…</span>;
    }
    case "studio":
      return (
        <>
          <p>
            <Accent>{studio.name}</Accent> <span className="text-muted">— {studio.tagline}</span>
          </p>
          {studioApps.map((a) => (
            <p key={a.title}>
              <span className="text-faint">{a.kind === "Game" ? "game" : "app "}</span> {a.title}{" "}
              <span className="text-muted">
                [{[a.play && "android", a.appStore && "ios"].filter(Boolean).join(" · ")}]
              </span>
            </p>
          ))}
          <p className="mt-2">
            <a href={studio.playStore} target="_blank" rel="noopener noreferrer" className="text-signal hover:underline">Google Play</a>
            <span className="text-muted"> · </span>
            <a href={studio.appStore} target="_blank" rel="noopener noreferrer" className="text-signal hover:underline">App Store</a>
            <span className="text-muted"> · </span>
            <a href={studio.site} target="_blank" rel="noopener noreferrer" className="text-signal hover:underline">website</a>
          </p>
        </>
      );
    case "blog":
      return posts.map((p) => (
        <p key={p.url}>
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline decoration-faint underline-offset-4 hover:text-signal">
            {p.title}
          </a>
        </p>
      ));
    case "contact":
      return (
        <>
          <p>email    <Accent>{profile.email}</Accent></p>
          <p>phone    <Accent>{profile.phone}</Accent></p>
          {Object.entries(profile.socials).map(([k, v]) => (
            <p key={k}>
              {k.padEnd(9, " ")}
              <a href={v} target="_blank" rel="noopener noreferrer" className="text-signal hover:underline">
                {v.replace("https://", "")}
              </a>
            </p>
          ))}
        </>
      );
    case "email":
      copyEmail();
      return <span>Copied {profile.email}</span>;
    case "resume":
      window.open(profile.resume, "_blank", "noopener");
      return <span>Opening resume…</span>;
    case "goto": {
      const el = document.getElementById(arg.toLowerCase());
      if (!el) return <span className="text-flare">unknown section: {arg || "(none)"}</span>;
      el.scrollIntoView({ behavior: "smooth" });
      return <span>→ #{arg}</span>;
    }
    case "date":
      return new Date().toString();
    case "echo":
      return arg;
    case "sudo":
    case "hire":
      setTimeout(() => (window.location.href = `mailto:${profile.email}?subject=Let's%20work%20together`), 600);
      return (
        <p>
          <Accent>Access granted.</Accent> Great choice. Opening a channel to {profile.email}…
        </p>
      );
    case "clear":
      return "clear";
    default:
      return (
        <span>
          <span className="text-flare">command not found: {cmd}</span>
          <span className="text-muted"> — try </span>
          <Accent>help</Accent>
        </span>
      );
  }
}

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const id = useRef(0);

  useEffect(() => {
    setLines([
      { id: id.current++, node: <span className="text-muted">yr-os v4.0 · type <Accent>help</Accent> to list commands, ↑↓ for history, tab to complete</span> },
    ]);
  }, []);

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight });
  }, [lines]);

  const submit = (cmd: string) => {
    const out = run(cmd);
    if (out === "clear") {
      setLines([]);
    } else {
      setLines((l) => [
        ...l,
        {
          id: id.current++,
          node: (
            <span>
              <Accent>visitor@yr</Accent>
              <span className="text-muted">:~$</span> {cmd}
            </span>
          ),
        },
        ...(out ? [{ id: id.current++, node: out }] : []),
      ]);
    }
    if (cmd.trim()) setHistory((h) => [cmd, ...h]);
    setCursor(-1);
    setValue("");
  };

  return (
    <section id="terminal" className="relative border-t border-line py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader index="07" label="Interactive" title="Prefer a shell? Explore here.">
          <div className="flex flex-wrap gap-2">
            {["whoami", "projects", "studio", "hire"].map((c) => (
              <button
                key={c}
                onClick={() => {
                  submit(c);
                  input.current?.focus({ preventScroll: true });
                }}
                className="border border-line-strong px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-signal hover:text-signal"
              >
                {c}
              </button>
            ))}
          </div>
        </SectionHeader>

        <div className="hud border border-line-strong bg-surface" onClick={() => input.current?.focus({ preventScroll: true })}>
          <div className="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-[11px] text-muted">
            <span className="flex gap-1.5">
              <span className="size-2.5 bg-flare" />
              <span className="size-2.5 bg-faint" />
              <span className="size-2.5 bg-signal" />
            </span>
            <span>visitor@yr: ~</span>
            <span>zsh</span>
          </div>
          <div ref={screen} className="h-[420px] overflow-y-auto p-5 font-mono text-[13px] leading-relaxed whitespace-pre-wrap md:p-6">
            {lines.map((l) => (
              <div key={l.id} className="mb-1">
                {l.node}
              </div>
            ))}
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                submit(value);
              }}
            >
              <label htmlFor="term" className="shrink-0">
                <Accent>visitor@yr</Accent>
                <span className="text-muted">:~$</span>
              </label>
              <input
                id="term"
                ref={input}
                value={value}
                autoComplete="off"
                spellCheck={false}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    const n = Math.min(cursor + 1, history.length - 1);
                    if (history[n] !== undefined) {
                      setCursor(n);
                      setValue(history[n]);
                    }
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    const n = cursor - 1;
                    setCursor(Math.max(n, -1));
                    setValue(n < 0 ? "" : history[n]);
                  } else if (e.key === "Tab") {
                    e.preventDefault();
                    const match = COMMANDS.find((c) => c.startsWith(value.toLowerCase()));
                    if (value && match) setValue(match + " ");
                  } else if (e.key === "l" && e.ctrlKey) {
                    e.preventDefault();
                    setLines([]);
                  }
                }}
                className="w-full bg-transparent caret-signal outline-none"
                aria-label="Terminal input"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
