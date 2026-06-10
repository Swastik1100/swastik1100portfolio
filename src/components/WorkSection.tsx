"use client";
// ============================================================
//  components/sections/WorkSection.tsx
//  NAKULA-style "LATEST WORK" section with:
//  - Giant gradient section header
//  - Numbered project list (left)
//  - Active project mockup (right) that swaps on hover
// ============================================================
import { useState, useRef } from "react";
import Image                 from "next/image";
import Link                  from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github }                from "lucide-react";
import type { Project }      from "@/types";
import projects              from "@/data/projects.json";

// ─── Colour chips for tech tags ──────────────────────────────
const TAG_COLORS: Record<string, string> = {
  "Full-Stack": "bg-blue-500/10 text-blue-400",
  "Real-time":  "bg-accent-green/10 text-accent-green",
  "AI/ML":      "bg-purple-500/10 text-purple-400",
  "Maps":       "bg-accent-amber/10 text-accent-amber",
  "default":    "bg-white/5 text-ink-secondary",
};

function tagClass(tag: string) {
  return TAG_COLORS[tag] ?? TAG_COLORS["default"];
}

export function WorkSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  const activeProject = (projects as Project[])[activeIdx];

  return (
    <section
      id="work"
      ref={ref}
      className="relative bg-bg-primary py-16 overflow-hidden"
    >
      {/* ── Section title: "LATEST WORK" gradient text ─────── */}
      <div className="px-6 lg:px-10 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="
            font-display font-black leading-none
            text-transparent bg-clip-text
            bg-gradient-to-b from-ink-primary/90 to-ink-muted/30
            select-none
          "
          style={{ fontSize: "clamp(60px, 11vw, 160px)" }}
        >
          LATEST WORK
        </motion.h2>
      </div>

      {/* ── Two-column layout ──────────────────────────────── */}
      <div className="px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-start">

        {/* ── LEFT: numbered project list ────────────────────── */}
        <ol className="space-y-0">
          {(projects as Project[]).map((project, i) => (
            <motion.li
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={() => setActiveIdx(i)}
              className={`
                group relative border-b border-border
                py-8 cursor-pointer
                transition-all duration-300
                ${activeIdx === i ? "opacity-100" : "opacity-40 hover:opacity-70"}
              `}
            >
              {/* Active accent line */}
              {activeIdx === i && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent-red"
                />
              )}

              <div className="pl-4">
                {/* Index */}
                <span className="text-ink-muted font-mono text-sm">
                  {project.index}.
                </span>

                {/* Title */}
                <h3 className="text-display-md font-display font-black text-ink-primary mt-1 leading-tight">
                  {project.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`
                        text-[10px] font-mono uppercase tracking-widest
                        px-2.5 py-1 rounded-full
                        ${tagClass(tag)}
                      `}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA links (visible when active) */}
                <AnimatePresence>
                  {activeIdx === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{    opacity: 0, height: 0      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-4 mt-4">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener"
                            className="
                              inline-flex items-center gap-1.5
                              text-xs font-mono text-ink-primary
                              hover:text-accent-red transition-colors
                            "
                          >
                            Live Demo <ArrowUpRight size={12} />
                          </a>
                        )}
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener"
                            className="
                              inline-flex items-center gap-1.5
                              text-xs font-mono text-ink-secondary
                              hover:text-ink-primary transition-colors
                            "
                          >
                            GitHub <Github size={12} />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* ── RIGHT: active project card ──────────────────────── */}
        <div className="lg:sticky lg:top-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y:  0, scale: 1.00 }}
              exit={{    opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="
                rounded-3xl overflow-hidden
                border border-border
                bg-bg-surface
              "
            >
              {/* Mockup image */}
              <div className="relative aspect-[16/10] bg-bg-elevated">
                <Image
                  src={activeProject.image}
                  alt={activeProject.title}
                  fill
                  className="object-cover"
                  // Graceful fallback placeholder
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.style.display = "none";
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-surface/80 to-transparent" />
              </div>

              {/* Card body */}
              <div className="p-6">
                <p className="text-ink-secondary text-sm leading-relaxed mb-4">
                  {activeProject.description}
                </p>

                {/* Stack chips */}
                <div className="flex flex-wrap gap-2">
                  {activeProject.stack.map((s) => (
                    <span
                      key={s}
                      className="
                        text-[10px] font-mono text-ink-muted
                        px-2 py-0.5 rounded border border-border
                      "
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
