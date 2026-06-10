"use client";
// ============================================================
//  components/sections/HeroSection.tsx
//  NAKULA-inspired hero:
//  - Massive display name (viewport-filling)
//  - Dramatic portrait photo in the centre
//  - Right-side tagline in large weight
//  - Logo marquee at the bottom
// ============================================================
import { useRef }              from "react";
import Image                   from "next/image";
import Link                    from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown }           from "lucide-react";

// ─── Trusted-by logos (replace with your real clients/universities) ──
const MARQUEE_ITEMS = [
  "IIT Delhi", "Google DSC", "Hack36", "GreedyGame",
  "Headout", "Coding Ninjas", "HackerEarth", "GeeksforGeeks",
  // duplicated so CSS marquee loops seamlessly
  "IIT Delhi", "Google DSC", "Hack36", "GreedyGame",
  "Headout", "Coding Ninjas", "HackerEarth", "GeeksforGeeks",
];

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  // Parallax: name slides up slightly on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const nameY    = useTransform(scrollYProgress, [0, 1], ["0%",  "-15%"]);
  const photoY   = useTransform(scrollYProgress, [0, 1], ["0%",  "10%"]);
  const overlayO = useTransform(scrollYProgress, [0, 0.5], [0, 0.6]);

  return (
    <section
      ref={containerRef}
      className="
        relative min-h-screen bg-bg-primary overflow-hidden
        flex flex-col
      "
    >
      {/* ── Subtle grid background ─────────────────────────── */}
      <div
        className="
          absolute inset-0 opacity-[0.03]
          bg-grid-dark bg-grid
          pointer-events-none
        "
      />

      {/* ── Main content ───────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col">

        {/* Row: HUGE name + portrait + tagline */}
        <div className="relative flex-1 flex items-end pb-8 px-6 lg:px-10">

          {/* ── Big NAME (bottom-left) ──────────────────────── */}
          <motion.h1
            style={{ y: nameY }}
            className="
              absolute bottom-0 left-0
              text-display-2xl font-display font-black
              text-ink-primary leading-none
              pl-6 lg:pl-10 pb-16
              z-10 select-none
            "
          >
            YOUR<br />NAME
          </motion.h1>

          {/* ── Portrait photo (centre stage) ──────────────── */}
          <motion.div
            style={{ y: photoY }}
            className="
              absolute inset-x-0 bottom-0
              flex justify-center items-end
              pointer-events-none
            "
          >
            {/* Photo container — replace /hero-photo.jpg with your image */}
            <div
              className="
                relative w-[38vw] max-w-[520px] min-w-[260px]
                aspect-[3/4] overflow-hidden
              "
            >
              <Image
                src="/hero-photo.jpg"
                alt="Your Name — Developer & Builder"
                fill
                className="object-cover object-top"
                priority
                // Placeholder: next.js will show a blur placeholder
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              />
              {/* Gradient fade to black at the bottom */}
              <div
                className="
                  absolute inset-x-0 bottom-0 h-2/5
                  bg-gradient-to-t from-bg-primary to-transparent
                "
              />
            </div>
          </motion.div>

          {/* Scroll overlay (darkens on scroll) */}
          <motion.div
            style={{ opacity: overlayO }}
            className="absolute inset-0 bg-bg-primary pointer-events-none"
          />

          {/* ── Tagline (right side) ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x:  0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="
              absolute bottom-0 right-0
              pr-6 lg:pr-10 pb-20
              text-right z-10
            "
          >
            <p
              className="
                font-display font-black leading-none
                text-ink-secondary
              "
              style={{ fontSize: "clamp(28px, 3.5vw, 52px)" }}
            >
              Building things<br />
              <span className="text-ink-primary">at the edge of</span><br />
              code & craft.
            </p>
          </motion.div>
        </div>

        {/* ── Bottom bar: descriptor + CTA ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="
            relative z-10 border-t border-border
            px-6 lg:px-10 py-5
            flex flex-col sm:flex-row items-start sm:items-center
            justify-between gap-4
          "
        >
          <p className="text-sm text-ink-secondary font-mono max-w-sm">
            Full-stack developer. Gym rat. Explorer of mountains and compilers.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="#work"
              className="
                inline-flex items-center gap-2
                px-6 py-3 rounded-full
                bg-accent-red text-white
                text-sm font-bold tracking-wide
                hover:bg-accent-red/90
                transition-colors
              "
            >
              VIEW WORK
            </Link>
            <a
              href="/cv.pdf"
              download
              className="
                inline-flex items-center gap-2
                text-sm font-mono text-ink-secondary
                hover:text-ink-primary transition-colors
              "
            >
              ↓ Resume
            </a>
          </div>
        </motion.div>
      </div>

      {/* ── Scroll indicator (animated arrow) ─────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="
          absolute bottom-6 left-1/2 -translate-x-1/2
          flex flex-col items-center gap-1
          text-ink-muted text-xs font-mono
        "
      >
        <span>scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
