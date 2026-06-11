"use client";
// ============================================================
//  components/sections/AboutSection.tsx
//  NAKULA-inspired About: "(ABOUT)" sidebar label + giant
//  statement that prints word-by-word on scroll (all white).
// ============================================================
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type MotionValue,
} from "framer-motion";

// ─── Statement words (breakAfter keeps the original line rhythm) ──
const STATEMENT_WORDS: { word: string; breakAfter?: boolean }[] = [
  { word: "I" },
  { word: "combine" },
  { word: "deep" },
  { word: "systems" },
  { word: "knowledge", breakAfter: true },
  { word: "with" },
  { word: "a" },
  { word: "craftsman's" },
  { word: "care", breakAfter: true },
  { word: "for" },
  { word: "product" },
  { word: "experience", breakAfter: true },
  { word: "to" },
  { word: "build" },
  { word: "things" },
  { word: "that" },
  { word: "actually", breakAfter: true },
  { word: "matter." },
];

// ─── Stat counters ─────────────────────────────────────────
const STATS = [
  { value: "10+",  label: "Months building" },
  { value: "8+", label: " Projects" },
  { value: "10k+", label: "Lines of Codes" },
  { value: "∞",   label: "Tokens used" },
];

function ScrollRevealWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const revealEnd = 1.00;
  const start = (index / total) * revealEnd;
  const end = ((index + 1) / total) * revealEnd;
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className="text-white inline-block mr-[0.22em]"
    >
      {word}
    </motion.span>
  );
}

export function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const wordTotal = STATEMENT_WORDS.length;

  return (
    <section id="about" ref={ref} className="relative bg-bg-primary">
      {/* Pinned viewport: locks screen until every word is shown */}
      <div ref={pinRef} className="relative h-[350vh]">
        <div className="sticky top-0 h-screen bg-bg-primary px-6 lg:px-10">
          <div className="max-w-[1400px] mx-auto h-full grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-y-12 gap-x-16 items-center">
            <motion.aside
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="lg:pt-3"
            >
              <span className="text-sm font-mono text-ink-secondary tracking-widest uppercase">
                1100
              </span>
            </motion.aside>

            <h2
              className="font-display font-black leading-[1.08] text-white antialiased"
              style={{ fontSize: "clamp(28px, 4.5vw, 72px)" }}
            >
              {STATEMENT_WORDS.map(({ word, breakAfter }, i) => (
                <span key={`${word}-${i}`}>
                  <ScrollRevealWord
                    word={word}
                    index={i}
                    total={wordTotal}
                    progress={scrollYProgress}
                  />
                  {breakAfter && <br />}
                </span>
              ))}
            </h2>
          </div>
        </div>
      </div>

      {/* Rest of section (scrolls in after pin releases) */}
      <div className="px-6 lg:px-10 pb-28 lg:pb-40">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-y-12 gap-x-16">
          <div className="hidden lg:block" aria-hidden="true" />
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-ink-secondary leading-relaxed mb-16"
            >
              <p>
                I&apos;m a second-year IT student at NIT-Jalandhar building
                distributed systems, AI-powered tools, and the occasional
                side-project that gets too big to be a side-project.
                Currently working on ML and DL.
              </p>
              <p>
                Outside the terminal: I hit the gym 5 days a week, chase
                what can&apos;t be achieved, and beat video games at 2am. I believe the
                same curiosity that makes a good engineer makes a good life enjoyer too.
                Both require tolerating being thoroughly lost.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
              {STATS.map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-bg-primary px-6 py-6 flex flex-col gap-1"
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
      </div>
    </section>
  );
}
