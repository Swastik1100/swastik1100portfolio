import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Enable class-based dark mode to support multiple themes
  darkMode: "class",
  theme: {
    extend: {
      // ─── NAKULA-style editorial color palette ───────────────────
      colors: {
        bg: {
          primary:  "#0A0A0A",  // cinema black
          surface:  "#111111",  // card surfaces
          elevated: "#1A1A1A",  // hover/elevated cards
          overlay:  "#0D0D0D",  // full-screen overlays
        },
        ink: {
          primary:   "#FFFFFF",        // headings & body
          secondary: "#888888",        // muted labels
          muted:     "#444444",        // very dim text
          dim:       "rgba(255,255,255,0.06)", // border tint
        },
        accent: {
          red:   "#EF3B2D",  // CTA / interactive red (from NAKULA)
          green: "#1DB954",  // Spotify / available status
          blue:  "#3B82F6",  // secondary highlights
          amber: "#F59E0B",  // achievement toasts
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          hover:   "rgba(255,255,255,0.16)",
        },
      },

      // ─── Typography scale (editorial / display-first) ───────────
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "var(--font-inter)", "sans-serif"],
        mono:    ["var(--font-mono)", "JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(80px, 12vw, 180px)", { lineHeight: "0.9",  letterSpacing: "-0.04em" }],
        "display-xl":  ["clamp(56px, 8vw,  120px)", { lineHeight: "0.92", letterSpacing: "-0.03em" }],
        "display-lg":  ["clamp(40px, 5vw,   72px)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-md":  ["clamp(28px, 3vw,   48px)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
      },
      fontWeight: {
        black: "900",
      },

      // ─── Spacing extensions ──────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "100": "25rem",
        "112": "28rem",
        "128": "32rem",
      },

      // ─── Animation curves matching high-end design tools ────────
      transitionTimingFunction: {
        "ease-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "ease-circ": "cubic-bezier(0.85, 0, 0.15, 1)",
      },

      // ─── Border radius ───────────────────────────────────────────
      borderRadius: {
        "2.5xl": "1.25rem",
        "3xl":   "1.5rem",
        "4xl":   "2rem",
      },

      // ─── Grid / layout ───────────────────────────────────────────
      gridTemplateColumns: {
        bento: "repeat(12, minmax(0, 1fr))",
      },

      // ─── Box shadows ─────────────────────────────────────────────
      boxShadow: {
        "glow-red":   "0 0 40px rgba(239, 59, 45, 0.15)",
        "glow-green": "0 0 40px rgba(29, 185, 84, 0.15)",
        "glow-white": "0 0 60px rgba(255, 255, 255, 0.04)",
        "card":       "0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.10)",
      },

      // ─── Keyframe animations ─────────────────────────────────────
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "marquee": {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.4" },
        },
        "scanline": {
          from: { transform: "translateY(-100%)" },
          to:   { transform: "translateY(100vh)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "marquee":    "marquee 28s linear infinite",
        "pulse-dot":  "pulse-dot 2s ease-in-out infinite",
        "scanline":   "scanline 8s linear infinite",
      },

      // ─── Background utilities ────────────────────────────────────
      backgroundImage: {
        "gradient-radial":  "radial-gradient(var(--tw-gradient-stops))",
        "gradient-noise":   "url('/noise.png')",
        "grid-dark":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "60px 60px",
      },
    },
  },
  plugins: [],
};

export default config;
