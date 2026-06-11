"use client";
// ============================================================
//  components/layout/Navbar.tsx
//  NAKULA-inspired sticky navbar.
//  Left: Logo   |   Centre: Live clock + availability
//  Right: "LET'S TALK" pill + hamburger
// ============================================================
import { useState } from "react";
import Link          from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLiveTime }  from "@/hooks/useLiveTime";

const NAV_LINKS = [
  { label: "Work",      href: "#work"      },
  { label: "About",     href: "#about"     },
  { label: "Lifestyle", href: "/lifestyle" },
  { label: "Terminal",  href: "#terminal"  },
  { label: "Contact",   href: "#contact"   },
];

export function Navbar() {
  const { timeString }  = useLiveTime("Asia/Kolkata");
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  // Shrink logo when user scrolls
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setScrolled(window.scrollY > 60);
    }, { passive: true });
  }

  return (
    <>
      {/* ── Main bar ────────────────────────────────────────── */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          flex items-center justify-center
          px-6 lg:px-10
          transition-all duration-500
          ${scrolled
            ? "h-14 bg-bg-primary/95 backdrop-blur-md border-b border-border"
            : "h-[70px] bg-transparent"
          }
        `}
      >
        {/* ── Centre: Live India Time ──────────────────── */}
        <span className="text-xs text-ink-secondary font-mono tabular-nums">
          {timeString}
        </span>

        {/* ── Right: Hamburger ─────────────────────────── */}
        <div className="absolute right-6 lg:right-10 flex items-center">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="
              w-10 h-10 rounded-full
              border border-border hover:border-border-hover
              flex items-center justify-center
              text-ink-secondary hover:text-ink-primary
              transition-all
            "
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* ── Full-screen overlay menu ───────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1,  y: 0   }}
            exit={{    opacity: 0,  y: -20  }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="
              fixed inset-0 z-40
              bg-bg-primary/98 backdrop-blur-xl
              flex flex-col items-center justify-center
              gap-2
            "
          >
            {NAV_LINKS.map(({ label, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y:  0 }}
                transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="
                    block text-display-lg font-display font-black
                    text-ink-secondary hover:text-ink-primary
                    transition-colors duration-200
                    py-1
                  "
                >
                  {label}
                </Link>
              </motion.div>
            ))}

            {/* Social links at the bottom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-10 flex items-center gap-6 text-xs font-mono text-ink-muted"
            >
              <a href="https://github.com/yourusername" target="_blank" rel="noopener" className="hover:text-ink-primary transition-colors">GitHub</a>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener" className="hover:text-ink-primary transition-colors">LinkedIn</a>
              <a href="https://twitter.com/yourusername" target="_blank" rel="noopener" className="hover:text-ink-primary transition-colors">Twitter</a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
