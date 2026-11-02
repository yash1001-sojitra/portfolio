"use client";

import { AnimatePresence, motion, useScroll } from "motion/react";
import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { education, experience, posts, profile, quote, skillGroups } from "@/lib/data";
import { copyEmail } from "./chrome";
import { Magnetic, Reveal, Scramble, SectionHeader } from "./ui";

const Section = ({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`relative border-t border-line py-28 md:py-36 ${className}`}>
    <div className="mx-auto max-w-7xl px-4 md:px-8">{children}</div>
  </section>
);

export function About() {
  return (
    <Section id="about">
      <SectionHeader index="01" label="Story" title="Engineer, architect, team lead." />
      <div className="grid gap-12 md:grid-cols-[minmax(0,340px)_1fr] md:gap-20">
        <Reveal>
          <figure className="hud group relative aspect-[4/5] overflow-hidden border border-line bg-surface">
            <Image
              src="/images/profile_image.png"
              alt="Portrait of Yashkumar Rank"
              fill
              sizes="340px"
              className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_2px,rgb(0_0_0/0.18)_2px_3px)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-signal/10 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 flex justify-between bg-bg/80 px-3 py-2 font-mono text-[10px] text-muted backdrop-blur">
              <span>ID · YR-1001</span>
              <span className="text-signal">VERIFIED</span>
            </figcaption>
          </figure>
        </Reveal>
        <div>
          <Reveal delay={0.1}>
            <p className="text-2xl leading-relaxed text-balance text-ink md:text-3xl">
              Four years building mobile, web and backend products with Flutter, Node.js and Firebase.
              Today I lead a <span className="text-signal">15-engineer team</span> from architecture to
              production on Google Cloud.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl leading-relaxed text-muted">{profile.about}</p>
          </Reveal>
          <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-3">
            {["Google Cloud Associate Engineer", "Professional Cloud Architect", "Clean architecture", "Code review"].map(
              (t) => (
                <span key={t} className="border border-line-strong px-3 py-1.5 font-mono text-xs text-muted">
                  {t}
                </span>
              ),
            )}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export function Stack() {
  const [active, setActive] = useState(skillGroups[0].id);
  const group = skillGroups.find((g) => g.id === active)!;
  const all = skillGroups.flatMap((g) => g.items);

  return (
    <section id="stack" className="relative border-t border-line py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader index="02" label="Technology" title="What I build with.">
          <p className="max-w-xs text-muted">
            {all.length} tools across {skillGroups.length} domains. Pick a domain to inspect it.
          </p>
        </SectionHeader>

        <div className="grid border border-line md:grid-cols-[280px_1fr]">
          <div role="tablist" aria-label="Skill domains" className="flex overflow-x-auto border-b border-line md:flex-col md:border-r md:border-b-0">
            {skillGroups.map((g, i) => (
              <button
                key={g.id}
                role="tab"
                aria-selected={g.id === active}
                onClick={() => setActive(g.id)}
                onMouseEnter={() => setActive(g.id)}
                className={`relative flex shrink-0 items-center justify-between gap-6 px-5 py-4 text-left transition-colors md:border-b md:border-line md:last:border-b-0 ${
                  g.id === active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {g.id === active && (
                  <motion.span layoutId="stack-active" className="absolute inset-0 bg-signal-dim" />
                )}
                <span className="relative flex items-center gap-3">
                  <span className="font-mono text-[11px] text-faint">0{i + 1}</span>
                  {g.name}
                </span>
                <span className={`relative font-mono text-xs ${g.id === active ? "text-signal" : "text-faint"}`}>
                  {g.items.length}
                </span>
              </button>
            ))}
          </div>

          <div className="relative min-h-[360px] overflow-hidden p-6 md:p-10">
            <div className="grid-bg absolute inset-0 opacity-60" />
            <AnimatePresence mode="wait">
              <motion.ul
                key={active}
                className="relative grid gap-3 sm:grid-cols-2"
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{ show: { transition: { staggerChildren: 0.05 } } }}
              >
                {group.items.map((item, i) => (
                  <motion.li
                    key={item}
                    variants={{
                      hidden: { opacity: 0, x: -12 },
                      show: { opacity: 1, x: 0 },
                    }}
                    className="group flex items-center justify-between border border-line bg-bg/80 px-5 py-5 backdrop-blur transition-colors hover:border-signal"
                  >
                    <span className="flex items-center gap-4">
                      <span className="font-mono text-[11px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                      <Scramble text={item} trigger="hover" className="text-lg" />
                    </span>
                    <span className="size-1.5 bg-faint transition-colors group-hover:bg-signal" />
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-16 overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-10 font-mono text-sm text-faint hover:[animation-play-state:paused]">
          {[...all, ...all].map((s, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap transition-colors hover:text-signal">
              {s}
              <span className="text-signal">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });

  return (
    <Section id="experience">
      <SectionHeader index="03" label="Experience" title="Where I've shipped." />
      <div ref={ref} className="relative">
        <div className="absolute top-0 bottom-0 left-[7px] w-px bg-line md:left-[calc(30%+7px)]" />
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute top-0 bottom-0 left-[7px] w-px origin-top bg-signal md:left-[calc(30%+7px)]"
        />
        <div className="space-y-20">
          {experience.map((job) => (
            <Reveal key={job.company}>
              <article className="grid gap-6 md:grid-cols-[30%_1fr]">
                <div className="pl-10 md:pl-0 md:pr-12 md:text-right">
                  <p className="font-mono text-xs text-muted">{job.period}</p>
                  <h3 className="mt-2 text-3xl font-medium tracking-tight">{job.company}</h3>
                  <p className="mt-1 text-muted">{job.role}</p>
                  {job.current && (
                    <span className="mt-4 inline-flex items-center gap-2 border border-signal/40 px-2 py-1 font-mono text-[10px] text-signal">
                      <span className="size-1.5 animate-pulse bg-signal" /> CURRENT
                    </span>
                  )}
                </div>
                <div className="relative pl-10 md:pl-12">
                  <span className="absolute top-1 left-0 grid size-[15px] place-items-center border border-signal bg-bg md:-left-6">
                    <span className="size-[5px] bg-signal" />
                  </span>
                  <ul className="space-y-4">
                    {job.points.map((p) => (
                      <li key={p} className="group flex gap-4 leading-relaxed text-muted">
                        <span className="mt-2.5 h-px w-4 shrink-0 bg-faint transition-all group-hover:w-6 group-hover:bg-signal" />
                        <span className="transition-colors group-hover:text-ink">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Writing() {
  return (
    <Section id="writing">
      <SectionHeader index="08" label="Writing" title="Notes from the field.">
        <a
          href={profile.socials.medium}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-muted transition-colors hover:text-signal"
        >
          All articles on Medium ↗
        </a>
      </SectionHeader>
      <ul className="border-t border-line">
        {posts.map((post, i) => (
          <Reveal key={post.url} delay={i * 0.05}>
            <li className="border-b border-line">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative grid gap-4 overflow-hidden py-10 md:grid-cols-[80px_1fr_auto] md:items-center"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-signal transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100" />
                <span className="relative font-mono text-sm text-faint transition-colors group-hover:text-bg md:pl-4">
                  0{i + 1}
                </span>
                <span className="relative">
                  <span className="font-mono text-xs text-muted transition-colors group-hover:text-bg/70">
                    {post.topic}
                  </span>
                  <span className="mt-2 block text-2xl font-medium tracking-tight text-balance transition-colors group-hover:text-bg md:text-3xl">
                    {post.title}
                  </span>
                  <span className="mt-3 block max-w-2xl text-muted transition-colors group-hover:text-bg/80">
                    {post.description}
                  </span>
                </span>
                <span className="relative grid size-14 place-items-center border border-line-strong text-xl transition-colors group-hover:border-bg group-hover:text-bg md:mr-4">
                  <span className="transition-transform duration-300 group-hover:-rotate-45">→</span>
                </span>
              </a>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

export function Education() {
  return (
    <div className="mb-24 grid gap-px border border-line bg-line md:grid-cols-2">
      {education.map((e, i) => (
        <Reveal key={e.title} delay={i * 0.05} className="bg-bg">
          <div className="group h-full p-8 transition-colors hover:bg-surface">
            <p className="flex justify-between font-mono text-xs text-muted">
              {e.period}
              <span className="text-faint transition-colors group-hover:text-signal">EDU.0{i + 1}</span>
            </p>
            <h3 className="mt-6 text-xl font-medium">{e.title}</h3>
            <p className="mt-1 text-muted">{e.school}</p>
            <p className="mt-4 text-sm text-faint">{e.note}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = String(data.get("subject") || "Hello from your portfolio");
    const body = `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field =
    "peer w-full border-b border-line-strong bg-transparent pt-6 pb-3 text-lg outline-none transition-colors placeholder:text-transparent focus:border-signal";
  const label =
    "pointer-events-none absolute top-6 left-0 font-mono text-xs text-muted transition-all peer-focus:top-0 peer-focus:text-signal peer-[:not(:placeholder-shown)]:top-0";

  return (
    <Section id="contact">
      <div className="grid gap-16 md:grid-cols-2">
        <div>
          <p className="mb-5 flex items-center gap-3 font-mono text-xs text-muted">
            <span className="text-signal">09</span>
            <span className="h-px w-10 bg-line-strong" />
            Contact
          </p>
          <h2 className="text-5xl font-medium tracking-tight text-balance md:text-7xl">
            Let&apos;s build something <span className="text-signal">real.</span>
          </h2>
          <p className="mt-6 max-w-md text-muted">
            Available for consultancy and freelance: Flutter apps, GCP architecture, and AI agent systems.
          </p>

          <div className="mt-12 space-y-4">
            <button
              onClick={copyEmail}
              className="group flex w-full items-center justify-between border border-line p-5 text-left transition-colors hover:border-signal"
            >
              <span>
                <span className="block font-mono text-[11px] text-muted">Email — click to copy</span>
                <span className="mt-1 block text-lg">{profile.email}</span>
              </span>
              <span className="font-mono text-xs text-faint group-hover:text-signal">COPY</span>
            </button>
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              className="group flex items-center justify-between border border-line p-5 transition-colors hover:border-signal"
            >
              <span>
                <span className="block font-mono text-[11px] text-muted">Phone</span>
                <span className="mt-1 block text-lg">{profile.phone}</span>
              </span>
              <span className="font-mono text-xs text-faint group-hover:text-signal">CALL</span>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {Object.entries(profile.socials).map(([name, url]) => (
              <Magnetic key={name}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-line-strong px-4 py-2 font-mono text-xs capitalize transition-colors hover:border-signal hover:text-signal"
                >
                  {name} ↗
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="hud self-start border border-line bg-surface p-8 md:p-10">
          <p className="mb-8 flex justify-between font-mono text-[11px] text-muted">
            <span>TRANSMISSION</span>
            <span className={sent ? "text-signal" : ""}>{sent ? "● OPENED IN MAIL" : "○ READY"}</span>
          </p>
          <div className="space-y-6">
            {[
              { name: "name", label: "Your name", type: "text" },
              { name: "email", label: "Your email", type: "email" },
              { name: "subject", label: "Subject", type: "text" },
            ].map((f) => (
              <div key={f.name} className="relative">
                <input id={f.name} name={f.name} type={f.type} placeholder=" " required={f.name !== "subject"} className={field} />
                <label htmlFor={f.name} className={label}>
                  {f.label}
                </label>
              </div>
            ))}
            <div className="relative">
              <textarea id="message" name="message" rows={4} placeholder=" " required className={`${field} resize-none`} />
              <label htmlFor="message" className={label}>
                Message
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="group mt-10 flex w-full items-center justify-between bg-signal px-6 py-4 font-mono text-sm font-medium text-bg"
          >
            Send message
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </form>
      </div>

      <Reveal className="mt-32 border-t border-line pt-16 text-center">
        <blockquote className="mx-auto max-w-3xl text-3xl font-medium tracking-tight text-balance md:text-4xl">
          “{quote.text}”
        </blockquote>
        <p className="mt-4 font-mono text-xs text-muted">— {quote.author}</p>
      </Reveal>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 font-mono text-xs text-muted md:flex-row md:items-center md:justify-between md:px-8">
        <p>© {new Date().getFullYear()} Yashkumar Rank · Built with Next.js</p>
        <p className="flex items-center gap-2">
          <span className="size-1.5 bg-signal" /> All systems nominal
          <a href="#top" className="ml-4 transition-colors hover:text-signal">
            Back to top ↑
          </a>
        </p>
      </div>
    </footer>
  );
}
