"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Terminal as TerminalIcon } from "lucide-react";
import { TerminalWidget } from "@/components/terminal/TerminalWidget";

const commands = [
  { name: "help", description: "List all commands" },
  { name: "about", description: "Who am I?" },
  { name: "projects", description: "My shipped work" },
  { name: "skills", description: "Tech stack breakdown" },
  { name: "contact", description: "Get in touch" },
  { name: "secret-code", description: "???" },
  { name: "hire", description: "Download my CV" },
  { name: "clear", description: "Clear the terminal" },
];

export function TerminalSection({
  onSecretCode,
}: {
  onSecretCode?: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-24 lg:py-32 px-6 lg:px-16"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-2">
            (Terminal)
          </p>
          <h2
            className="font-display font-black text-ink-primary leading-[0.95] mb-4"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
            }}
          >
            CLI Sandbox
          </h2>
          <p className="text-lg text-ink-secondary max-w-xl">
            An interactive terminal. Type{" "}
            <code className="font-mono text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-lg text-sm">
              help
            </code>{" "}
            for available commands.
          </p>
        </motion.div>

        {/* Terminal widget */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 40, scale: 0.98 }
          }
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="rounded-2.5xl bg-bg-surface border border-border overflow-hidden shadow-card min-h-[500px]"
        >
          <TerminalWidget onSecretCode={onSecretCode} />
        </motion.div>

        {/* Commands reference grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <TerminalIcon size={16} className="text-ink-muted" />
            <p className="text-xs font-mono text-ink-muted uppercase tracking-widest">
              Available Commands
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {commands.map((cmd, i) => (
              <motion.div
                key={cmd.name}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{
                  duration: 0.4,
                  delay: 0.4 + i * 0.05,
                  ease: "easeOut",
                }}
                className="group rounded-xl bg-bg-surface border border-border px-4 py-3
                           transition-all duration-200 hover:border-border-hover hover:bg-bg-elevated
                           cursor-default"
              >
                <p className="font-mono text-sm text-accent-green font-semibold mb-1 group-hover:text-accent-green/90">
                  {cmd.name}
                </p>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {cmd.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
