"use client";
// ============================================================
//  components/sections/AboutSection.tsx
//  NAKULA-inspired About: "(ABOUT)" sidebar label + giant
//  statement text that transitions from white to muted mid-line.
// ============================================================
import { useRef }  from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

// ─── Stat counters ─────────────────────────────────────────
const STATS = [
  { value: "3+",  label: "Years building" },
  { value: "12+", label: "Shipped projects" },
  { value: "50k+",label: "Lines of Go & TypeScript" },
  { value: "∞",   label: "Cups of chai" },
];

export function AboutSection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Gradual colour shift driven by scroll
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0.2, 1]);

  return (
    <section
      id="about"
      ref={ref}
      className="
        relative bg-bg-primary
        px-6 lg:px-10
        py-28 lg:py-40
        overflow-hidden
      "
    >
      {/* ── Layout grid ─────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-y-12 gap-x-16">

        {/* ── Left column: "(ABOUT)" label ──────────────────── */}
        <motion.aside
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="lg:pt-3"
        >
          <span className="text-sm font-mono text-ink-secondary tracking-widest uppercase">
            (About)
          </span>
        </motion.aside>

        {/* ── Right column: statement + stats ───────────────── */}
        <div>
          {/* Big statement text */}
          <motion.h2
            style={{ opacity: inView ? 1 : 0 }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="
              font-display font-black leading-none
              text-ink-primary
              mb-16
            "
            style={{ fontSize: "clamp(28px, 4.5vw, 72px)" }}
          >
            I combine deep systems knowledge
            with a craftsman&apos;s care
            for product experience
            <span className="text-ink-secondary">
              {" "}to build things that actually<br />
              matter.
            </span>
          </motion.h2>

          {/* Two-column body text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="
              grid grid-cols-1 md:grid-cols-2 gap-8
              text-sm text-ink-secondary leading-relaxed
              mb-16
            "
          >
            <p>
              I&apos;m a final-year CS student at [Your University] building
              distributed systems, AI-powered tools, and the occasional
              side-project that gets too big to be a side-project.
              Currently interning at [Company] — working on [interesting thing].
            </p>
            <p>
              Outside the terminal: I hit the gym 5 days a week, chase
              Himalayan trails, and beat video games at 2am. I believe the
              same curiosity that makes a good engineer makes a good traveller.
              Both require tolerating being thoroughly lost.
            </p>
          </motion.div>

          {/* ── Stats row ─────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="
                  bg-bg-primary
                  px-6 py-6
                  flex flex-col gap-1
                "
              >
                <span className="text-3xl font-display font-black text-ink-primary leading-none">
                  {value}
                </span>
                <span className="text-xs text-ink-secondary font-mono">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
