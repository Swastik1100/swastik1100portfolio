"use client";
// ============================================================
//  BookshelfSection.tsx — Full-screen reading / bookshelf section
// ============================================================
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Star } from "lucide-react";
import booksData from "@/data/books.json";
import type { Book } from "@/types";

const books = booksData as unknown as Book[];

// ─── Helpers ─────────────────────────────────────────────────
const currentlyReading = books.find((b) => b.status === "reading");
const finishedBooks = books.filter((b) => b.status === "read");
const totalRead = finishedBooks.length;
const avgRating =
  finishedBooks.length > 0
    ? (finishedBooks.reduce((s, b) => s + b.rating, 0) / finishedBooks.length).toFixed(1)
    : "—";

const categoryColors: Record<string, string> = {
  tech: "text-accent-blue bg-accent-blue/10 border-accent-blue/20",
  philosophy: "text-accent-amber bg-accent-amber/10 border-accent-amber/20",
  fiction: "text-accent-green bg-accent-green/10 border-accent-green/20",
  "self-help": "text-accent-red bg-accent-red/10 border-accent-red/20",
  business: "text-ink-secondary bg-bg-elevated border-border",
};

// ─── Stagger helpers ─────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ─── Stars ───────────────────────────────────────────────────
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < rating
              ? "text-accent-amber fill-accent-amber"
              : "text-ink-muted/30"
          }
        />
      ))}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────
export function BookshelfSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-bg-primary px-6 py-24 md:px-12 lg:px-20 xl:px-28"
    >
      {/* ── Header row ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
      >
        <div>
          <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-2">
            (Reading)
          </p>
          <h2
            className="font-display font-black text-ink-primary leading-[0.95]"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
            }}
          >
            Bookshelf
          </h2>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-3xl font-display font-black text-ink-primary">
              {totalRead}
            </p>
            <p className="text-xs font-mono text-ink-muted uppercase tracking-wider">
              Books Read
            </p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <Star size={16} className="text-accent-amber fill-accent-amber" />
              <p className="text-3xl font-display font-black text-ink-primary">
                {avgRating}
              </p>
            </div>
            <p className="text-xs font-mono text-ink-muted uppercase tracking-wider">
              Avg Rating
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Currently Reading — Hero Card ─────────────────────── */}
      {currentlyReading && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-16"
        >
          <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <BookOpen size={14} className="text-accent-green" />
            Currently Reading
          </p>

          <div
            className="
              relative overflow-hidden rounded-2.5xl
              bg-bg-surface border border-border
              p-8 md:p-10 lg:p-12
              transition-all duration-300
              hover:border-border-hover hover:shadow-card-hover
            "
            style={{ borderLeftWidth: 4, borderLeftColor: currentlyReading.coverColor }}
          >
            {/* Subtle gradient glow from cover colour */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 0% 50%, ${currentlyReading.coverColor}, transparent 60%)`,
              }}
            />

            <div className="relative flex flex-col md:flex-row md:items-center gap-8">
              {/* Book info */}
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-ink-primary">
                  {currentlyReading.title}
                </h3>
                <p className="text-sm text-ink-secondary">
                  by {currentlyReading.author}
                </p>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-ink-muted">
                      Progress
                    </span>
                    <span className="text-xs font-mono text-ink-primary font-bold">
                      {currentlyReading.progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-bg-elevated rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: currentlyReading.coverColor }}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${currentlyReading.progress}%` } : {}}
                      transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <Stars rating={currentlyReading.rating} size={18} />
              </div>

              {/* Takeaway quote */}
              <div className="md:max-w-xs lg:max-w-sm">
                <p className="text-sm italic text-ink-secondary leading-relaxed border-l-2 border-border pl-4">
                  &ldquo;{currentlyReading.takeaway}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Finished Books Grid ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-6 flex items-center gap-2">
          <Star size={14} className="text-accent-amber" />
          Finished
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {finishedBooks.map((book) => (
            <motion.div
              key={book.id}
              variants={itemVariants}
              className="
                group rounded-2.5xl bg-bg-surface border border-border
                p-6 transition-all duration-300
                hover:border-border-hover hover:shadow-card-hover
              "
              style={{ borderLeftWidth: 4, borderLeftColor: book.coverColor }}
            >
              {/* Title & Author */}
              <h4 className="text-base font-bold text-ink-primary mb-1 group-hover:text-accent-blue transition-colors duration-200">
                {book.title}
              </h4>
              <p className="text-xs text-ink-secondary mb-3">
                by {book.author}
              </p>

              {/* Category badge + rating */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`
                    text-[10px] font-mono uppercase tracking-wider
                    px-2 py-0.5 rounded-full border
                    ${categoryColors[book.category] ?? "text-ink-muted bg-bg-elevated border-border"}
                  `}
                >
                  {book.category}
                </span>
                <Stars rating={book.rating} size={12} />
              </div>

              {/* Takeaway */}
              <p className="text-xs italic text-ink-muted leading-relaxed line-clamp-3">
                &ldquo;{book.takeaway}&rdquo;
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
