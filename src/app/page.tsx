"use client";
// ============================================================
//  app/page.tsx  —  Home page (expanded)
//  Composes: Hero → About → Work → Tech Stack →
//            Lifestyle Teaser → Contact/Footer
// ============================================================
import Link                   from "next/link";
import { motion, useInView }  from "framer-motion";
import { useRef }             from "react";
import {
  ArrowRight, Music2, Dumbbell, MapPin, Terminal,
  Github, Linkedin, Mail, Twitter, ExternalLink,
  Code2, Database, Globe, Cpu, Cloud, Smartphone,
  ChefHat, BookOpen, Gamepad2
} from "lucide-react";
import { Navbar }             from "@/components/layout/Navigation";
import { HeroSection }        from "@/components/HeroSection";
import { AboutSection }       from "@/components/AboutSection";
import { WorkSection }        from "@/components/WorkSection";
import { AchievementToast }   from "@/components/achievements/AchievementToast";
import { useAchievements }    from "@/hooks/useAchievements";

// ─── Tech Stack Data ────────────────────────────────────────
const STACK_CATEGORIES = [
  {
    title: "Languages",
    icon: Code2,
    color: "text-accent-blue",
    items: ["TypeScript", "Go", "Python", "JavaScript", "C++", "SQL"],
  },
  {
    title: "Frontend",
    icon: Globe,
    color: "text-accent-green",
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "HTML/CSS"],
  },
  {
    title: "Backend",
    icon: Database,
    color: "text-accent-red",
    items: ["Node.js", "Express", "Go Fiber", "REST APIs", "GraphQL"],
  },
  {
    title: "DevOps & Cloud",
    icon: Cloud,
    color: "text-accent-amber",
    items: ["Docker", "AWS", "Vercel", "GitHub Actions", "Linux"],
  },
  {
    title: "Databases",
    icon: Cpu,
    color: "text-accent-blue",
    items: ["PostgreSQL", "MongoDB", "Redis", "Firebase"],
  },
  {
    title: "Tools & More",
    icon: Smartphone,
    color: "text-accent-green",
    items: ["Git", "Figma", "VS Code", "Postman", "Notion"],
  },
];

// ─── Social links ────────────────────────────────────────────
const SOCIALS = [
  { icon: Github,   label: "GitHub",    href: "https://github.com/swastik1100" },
  { icon: Linkedin, label: "LinkedIn",  href: "https://linkedin.com/in/swastik1100" },
  { icon: Twitter,  label: "Twitter/X", href: "https://twitter.com/swastik1100" },
  { icon: Mail,     label: "Email",     href: "mailto:your@email.com" },
];

// ─── Tech Stack Section ─────────────────────────────────────
function TechStackSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id="stack"
      ref={ref}
      className="relative bg-bg-primary px-6 lg:px-10 py-28 lg:py-40"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-y-6 gap-x-16 mb-16"
        >
          <span className="text-sm font-mono text-ink-secondary tracking-widest uppercase lg:pt-2">
            (Stack)
          </span>
          <div>
            <h2
              className="font-display font-black text-ink-primary leading-none mb-4"
              style={{ fontSize: "clamp(28px, 4.5vw, 64px)" }}
            >
              Tools of the trade
            </h2>
            <p className="text-sm text-ink-secondary max-w-lg">
              The technologies I use daily to build fast, scalable, and beautiful things.
            </p>
          </div>
        </motion.div>

        {/* Grid of categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STACK_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="
                  rounded-2xl bg-bg-surface border border-border
                  p-6 lg:p-8
                  hover:border-border-hover hover:shadow-card-hover
                  transition-all duration-300
                "
              >
                <div className="flex items-center gap-3 mb-5">
                  <Icon size={20} className={cat.color} />
                  <h3 className="text-sm font-bold text-ink-primary uppercase tracking-wide">
                    {cat.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span
                      key={item}
                      className="
                        text-xs font-mono
                        px-3 py-1.5 rounded-lg
                        bg-bg-elevated text-ink-secondary
                        border border-border/50
                      "
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Lifestyle Teaser (expanded) ────────────────────────────
function LifestyleTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const categories = [
    { icon: Music2,   label: "Spotify Now Playing",     color: "text-accent-green",  desc: "What I'm listening to right now" },
    { icon: Dumbbell, label: "Gym PRs & Fitness",        color: "text-accent-red",    desc: "Squat, bench, deadlift progress" },
    { icon: MapPin,   label: "India Travel Map",         color: "text-accent-amber",  desc: "Interactive map with photos" },
    { icon: Terminal, label: "CLI Sandbox",               color: "text-accent-blue",   desc: "Try typing 'help' in the terminal" },
    { icon: BookOpen, label: "Bookshelf",                 color: "text-accent-blue",   desc: "What I'm reading & takeaways" },
    { icon: Gamepad2, label: "Gaming",                    color: "text-accent-red",    desc: "Currently playing & reviews" },
    { icon: ChefHat,  label: "Dishes I've Cooked",       color: "text-accent-amber",  desc: "From butter chicken to ramen" },
    { icon: Code2,    label: "Coding Stats",              color: "text-accent-green",  desc: "WakaTime hours & languages" },
  ];

  return (
    <section
      id="lifestyle"
      ref={ref}
      className="relative bg-bg-primary px-6 lg:px-10 py-28 lg:py-40"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-y-6 gap-x-16 mb-16"
        >
          <span className="text-sm font-mono text-ink-secondary tracking-widest uppercase lg:pt-2">
            (Lifestyle)
          </span>
          <div>
            <h2
              className="font-display font-black text-ink-primary leading-none mb-4"
              style={{ fontSize: "clamp(28px, 4.5vw, 64px)" }}
            >
              Beyond Code
            </h2>
            <p className="text-sm sm:text-base text-ink-secondary max-w-xl leading-relaxed">
              The things that keep me sharp outside the terminal — fitness PRs,
              travel stories, what I&apos;m reading, cooking, and building next.
            </p>
          </div>
        </motion.div>

        {/* Category preview grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="
                  rounded-2xl bg-bg-surface border border-border
                  p-5
                  hover:border-border-hover hover:shadow-card-hover
                  transition-all duration-300
                "
              >
                <Icon size={20} className={`${cat.color} mb-3`} />
                <h3 className="text-sm font-bold text-ink-primary mb-1">{cat.label}</h3>
                <p className="text-xs text-ink-muted leading-relaxed">{cat.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Big CTA card */}
        <Link href="/lifestyle" className="group block">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="
              relative overflow-hidden rounded-3xl
              border border-border bg-bg-surface
              p-8 sm:p-10 lg:p-14
              hover:border-border-hover hover:shadow-card-hover
              transition-all duration-500
            "
          >
            {/* Background */}
            <span
              className="
                absolute -bottom-6 -right-4
                font-display font-black leading-none
                text-ink-primary/[0.03] select-none pointer-events-none
              "
              style={{ fontSize: "clamp(100px, 15vw, 220px)" }}
            >
              LIFE
            </span>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-2">
                  9 immersive sections • long-scroll experience
                </p>
                <p className="text-lg font-display font-bold text-ink-primary">
                  Explore the full lifestyle hub →
                </p>
              </div>
              <span
                className="
                  inline-flex items-center gap-2
                  px-6 py-3 rounded-full
                  bg-accent-red text-white
                  text-sm font-bold tracking-wide
                  group-hover:bg-accent-red/90
                  transition-colors shrink-0
                "
              >
                EXPLORE
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}

// ─── Contact & Footer ────────────────────────────────────────
function ContactFooter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <footer
      id="contact"
      ref={ref}
      className="relative bg-bg-primary px-6 lg:px-10 pt-28 lg:pt-40 pb-12"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-y-6 gap-x-16 mb-16"
        >
          <span className="text-sm font-mono text-ink-secondary tracking-widest uppercase lg:pt-2">
            (Contact)
          </span>
          <div>
            <h2
              className="font-display font-black text-ink-primary leading-none mb-6"
              style={{ fontSize: "clamp(32px, 5vw, 80px)" }}
            >
              Let&apos;s build<br />
              something{" "}
              <span className="text-accent-red">together.</span>
            </h2>
            <p className="text-base text-ink-secondary max-w-lg leading-relaxed mb-10">
              I&apos;m open to freelance work, full-time roles, and interesting
              conversations. If you have a project or just want to say hi — reach out.
            </p>

            {/* Email CTA */}
            <motion.a
              href="mailto:your@email.com"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="
                inline-flex items-center gap-3
                px-8 py-4 rounded-full
                bg-accent-red text-white
                text-base font-bold tracking-wide
                hover:bg-accent-red/90
                transition-colors mb-8
              "
            >
              <Mail size={18} />
              Say Hello
            </motion.a>
          </div>
        </motion.div>

        {/* Social links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {SOCIALS.map((social, i) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                className="
                  flex items-center gap-3
                  rounded-2xl bg-bg-surface border border-border
                  p-5
                  hover:border-border-hover hover:shadow-card-hover
                  transition-all duration-300 group
                "
              >
                <Icon size={20} className="text-ink-secondary group-hover:text-ink-primary transition-colors" />
                <span className="text-sm font-bold text-ink-primary">{social.label}</span>
                <ExternalLink size={12} className="text-ink-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-ink-muted">
            © {new Date().getFullYear()} Swastik. Built with Next.js, Tailwind & too much chai.
          </p>
          <p className="text-xs font-mono text-ink-muted">
            Designed & coded with ♥
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Home Page ───────────────────────────────────────────────
export default function HomePage() {
  const { activeToast, dismissToast } = useAchievements();

  return (
    <>
      <Navbar />

      <main>
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <TechStackSection />
        <LifestyleTeaser />
      </main>

      <ContactFooter />

      <AchievementToast
        achievement={activeToast}
        onDismiss={dismissToast}
      />
    </>
  );
}
