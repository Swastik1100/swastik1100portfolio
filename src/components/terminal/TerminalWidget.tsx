"use client";
// ============================================================
//  components/widgets/TerminalWidget.tsx
//  A fully functional in-page terminal that responds to
//  commands and reveals easter eggs. Opens as a floating modal
//  triggered by pressing ` (backtick) or the terminal button.
// ============================================================
import {
  useState, useEffect, useRef, useCallback, KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Square, Terminal as TerminalIcon } from "lucide-react";
import type { TerminalLine }          from "@/types";

// ─── ASCII art banner (shown on open) ────────────────────────
const BANNER = `
  ██╗   ██╗███╗   ██╗
  ╚██╗ ██╔╝████╗  ██║
   ╚████╔╝ ██╔██╗ ██║
    ╚██╔╝  ██║╚██╗██║
     ██║   ██║ ╚████║
     ╚═╝   ╚═╝  ╚═══╝

  Type 'help' to see available commands.
  Try 'secret-code' if you're feeling lucky. 🎮
`.trim();

// ─── Command responses ────────────────────────────────────────
const COMMAND_MAP: Record<string, string | string[]> = {
  help: [
    "┌─────────────────────────────────────────────┐",
    "│           AVAILABLE COMMANDS                 │",
    "├──────────────┬──────────────────────────────┤",
    "│ about        │ Who am I?                    │",
    "│ projects     │ Things I've built            │",
    "│ skills       │ My tech arsenal              │",
    "│ contact      │ How to reach me              │",
    "│ hire         │ Why you should hire me       │",
    "│ clear        │ Clear the terminal           │",
    "│ secret-code  │ 👀                           │",
    "└──────────────┴──────────────────────────────┘",
  ],
  about: [
    "NAME     : Your Name",
    "ROLE     : Full-Stack Engineer",
    "LOCATION : New Delhi, India 🇮🇳",
    "STATUS   : Available for opportunities",
    "",
    "I build distributed systems and AI tools by day,",
    "lift heavy things and climb mountains by weekend.",
    "Somewhere in between, I play too many video games.",
  ],
  skills: [
    "LANGUAGES   : TypeScript, Go, Python, Rust (learning)",
    "FRONTEND    : Next.js, React, Tailwind, Framer Motion",
    "BACKEND     : Node.js, Go, FastAPI, gRPC",
    "DATA        : PostgreSQL, Redis, ClickHouse, Kafka",
    "CLOUD       : AWS, Vercel, Docker, Kubernetes",
    "AI/ML       : LangChain, OpenAI, HuggingFace",
    "",
    "Currently obsessing over: Rust + WebAssembly",
  ],
  projects: [
    "01 ❯ VELOX        — Real-time chat (Go + Redis + React)",
    "     github.com/yourusername/velox",
    "",
    "02 ❯ CEREBRO      — AI study companion (LangChain + RAG)",
    "     github.com/yourusername/cerebro",
    "",
    "03 ❯ TRAILKIT     — Trip planner PWA (React + Node.js)",
    "     github.com/yourusername/trailkit",
    "",
    "Type 'project [name]' for details. (coming soon)",
  ],
  contact: [
    "📧  hello@yourname.dev",
    "🐙  github.com/yourusername",
    "💼  linkedin.com/in/yourname",
    "🐦  twitter.com/yourhandle",
    "",
    "Response time: Usually < 24h on weekdays.",
  ],
  hire: [
    "WHY HIRE ME?",
    "────────────",
    "✓ I ship. Not just prototype — production code.",
    "✓ I read the RFC before touching the codebase.",
    "✓ I write docs (yes, really).",
    "✓ I benchmark before optimising.",
    "✓ I ask dumb questions early, not expensive ones late.",
    "",
    "CURRENTLY OPEN TO:",
    "  → Full-time SWE roles (backend/full-stack)",
    "  → Founding engineer positions",
    "  → Interesting contract work",
    "",
    "Email: hello@yourname.dev",
  ],
  "secret-code": [
    "⚡ KONAMI CODE DETECTED ⚡",
    "",
    "    ↑ ↑ ↓ ↓ ← → ← → B A",
    "",
    "🎮 You've activated CYBERPUNK MODE.",
    "",
    "Achievement unlocked: 💻 The Hacker",
    "",
    "P.S. The secret project is at:",
    "     github.com/yourusername/???",
    "     (if you know, you know)",
  ],
};

// ─── Prompt string ────────────────────────────────────────────
const PROMPT = "visitor@yourname.dev:~$";

// ─── Props ───────────────────────────────────────────────────
interface Props {
  onSecretCode?: () => void;  // callback to trigger hacker achievement
}

export function TerminalWidget({ onSecretCode }: Props) {
  const [isOpen,   setIsOpen]   = useState(false);
  const [lines,    setLines]    = useState<TerminalLine[]>([
    { type: "system", content: BANNER, ts: "" },
    { type: "system", content: "",     ts: "" },
  ]);
  const [input,    setInput]    = useState("");
  const [history,  setHistory]  = useState<string[]>([]);
  const [histIdx,  setHistIdx]  = useState(-1);
  const inputRef  = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom on new line
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  // Global keyboard shortcut: backtick ` opens/closes terminal
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "`" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Don't open if user is typing in a different input
        if (document.activeElement?.tagName === "INPUT" && !isOpen) return;
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  // ── Process a command ─────────────────────────────────────
  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();

      // Echo the input
      const inputLine: TerminalLine = {
        type:    "input",
        content: `${PROMPT} ${raw}`,
        ts:      new Date().toLocaleTimeString(),
      };

      if (cmd === "clear") {
        setLines([{ type: "system", content: BANNER, ts: "" }]);
        return;
      }

      let response: TerminalLine[];

      if (cmd === "") {
        response = [];
      } else if (COMMAND_MAP[cmd]) {
        const outputs = Array.isArray(COMMAND_MAP[cmd])
          ? (COMMAND_MAP[cmd] as string[])
          : [COMMAND_MAP[cmd] as string];

        response = outputs.map((line): TerminalLine => ({
          type:    "output",
          content: line,
          ts:      "",
        }));

        // Trigger secret achievement
        if (cmd === "secret-code") {
          setTimeout(() => onSecretCode?.(), 500);
        }
      } else {
        response = [
          {
            type:    "error",
            content: `command not found: ${cmd}. Type 'help' for available commands.`,
            ts:      "",
          },
        ];
      }

      setLines((prev) => [
        ...prev,
        inputLine,
        ...response,
        { type: "output", content: "", ts: "" }, // blank spacer
      ]);

      // Save to history
      if (cmd !== "") {
        setHistory((h) => [raw, ...h].slice(0, 50));
      }
      setHistIdx(-1);
    },
    [onSecretCode]
  );

  // ── Handle key presses in the input ──────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        runCommand(input);
        setInput("");
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = Math.min(histIdx + 1, history.length - 1);
        setHistIdx(next);
        setInput(history[next] ?? "");
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.max(histIdx - 1, -1);
        setHistIdx(next);
        setInput(next === -1 ? "" : (history[next] ?? ""));
      }
      if (e.key === "Tab") {
        e.preventDefault();
        // Simple autocomplete
        const partial = input.trim().toLowerCase();
        const match = Object.keys(COMMAND_MAP).find((k) =>
          k.startsWith(partial)
        );
        if (match) setInput(match);
      }
    },
    [input, history, histIdx, runCommand]
  );

  // ── Line colouring ────────────────────────────────────────
  function lineClass(type: TerminalLine["type"]) {
    switch (type) {
      case "input":  return "text-accent-green font-bold";
      case "error":  return "text-accent-red";
      case "system": return "text-ink-secondary";
      default:       return "text-ink-primary";
    }
  }

  return (
    <>
      {/* ── Trigger button ─────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          inline-flex items-center gap-2
          px-4 py-2.5 rounded-xl
          bg-bg-surface border border-border
          hover:border-border-hover
          text-xs font-mono text-ink-secondary
          hover:text-ink-primary
          transition-all duration-300
          group
        "
        aria-label="Open terminal"
      >
        <TerminalIcon size={14} className="group-hover:text-accent-green transition-colors" />
        <span className="hidden sm:inline">terminal</span>
        <span className="text-[10px] text-ink-muted hidden sm:inline">[`]</span>
      </button>

      {/* ── Modal overlay ──────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{    opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Terminal window */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y:  0, scale: 1.00 }}
              exit={{    opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="
                fixed inset-x-4 bottom-4 md:inset-x-auto
                md:left-1/2 md:-translate-x-1/2
                md:w-[720px]
                z-50
                rounded-2xl overflow-hidden
                border border-border
                bg-bg-overlay
                shadow-[0_32px_80px_rgba(0,0,0,0.8)]
                flex flex-col
                max-h-[70vh]
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Window chrome bar ─────────────────────── */}
              <div className="
                flex items-center justify-between
                px-4 py-3
                border-b border-border
                bg-bg-surface/50
              ">
                {/* Traffic lights */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-110"
                    aria-label="Close terminal"
                  />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>

                {/* Title */}
                <span className="text-[11px] font-mono text-ink-muted">
                  yourname.dev — bash
                </span>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-ink-muted hover:text-ink-primary transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* ── Output area ──────────────────────────── */}
              <div
                className="
                  flex-1 overflow-y-auto
                  p-4 font-mono text-xs leading-relaxed
                  text-ink-primary
                "
                onClick={() => inputRef.current?.focus()}
              >
                {lines.map((line, i) => (
                  <div
                    key={i}
                    className={`whitespace-pre-wrap ${lineClass(line.type)}`}
                  >
                    {line.content}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* ── Input row ────────────────────────────── */}
              <div className="
                flex items-center gap-2
                px-4 py-3
                border-t border-border
                bg-bg-surface/30
              ">
                <span className="text-accent-green text-xs font-mono whitespace-nowrap select-none">
                  {PROMPT}
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="
                    flex-1 bg-transparent
                    text-xs font-mono text-ink-primary
                    outline-none border-none
                    caret-accent-green
                  "
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="type a command…"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
