"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChefHat, Flame, Star } from "lucide-react";
import type { Dish } from "@/types";
import dishesData from "@/data/dishes.json";

const dishes = dishesData as unknown as Dish[];

const difficultyConfig: Record<string, { color: string; label: string }> = {
  easy: { color: "text-accent-green bg-accent-green/10 border-accent-green/20", label: "Easy" },
  medium: { color: "text-accent-amber bg-accent-amber/10 border-accent-amber/20", label: "Medium" },
  hard: { color: "text-accent-red bg-accent-red/10 border-accent-red/20", label: "Hard" },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating
              ? "fill-accent-amber text-accent-amber"
              : "text-ink-muted/30"
          }
        />
      ))}
    </div>
  );
}

function DishCard({ dish, index }: { dish: Dish; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px" });

  const diff = difficultyConfig[dish.difficulty] ?? difficultyConfig.medium;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group rounded-2.5xl bg-bg-surface border border-border overflow-hidden
                 transition-all duration-300 hover:scale-[1.02] hover:border-border-hover hover:shadow-card-hover"
    >
      {/* Top colored section */}
      <div
        className="relative flex items-center justify-center h-40"
        style={{ backgroundColor: `${dish.color}26` }}
      >
        <span className="text-5xl drop-shadow-sm">{dish.emoji}</span>
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-sm font-mono text-ink-muted truncate">{dish.cuisine}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        {/* Name + badges */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-ink-primary leading-tight">
            {dish.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-full bg-bg-elevated text-ink-secondary border border-border">
              <ChefHat size={12} />
              {dish.cuisine}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-full border ${diff.color}`}
            >
              <Flame size={12} />
              {diff.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-ink-secondary leading-relaxed line-clamp-2">
          {dish.description}
        </p>

        {/* Tags */}
        {dish.tags && dish.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dish.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-bg-elevated text-ink-muted border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Rating + date */}
        <div className="flex items-center justify-between pt-1">
          <StarRating rating={dish.rating} />
          <span className="text-xs font-mono text-ink-muted">{dish.date}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function DishesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Stats
  const totalDishes = dishes.length;
  const cuisines = Array.from(new Set(dishes.map((d) => d.cuisine)));
  const cuisineCount = cuisines.length;

  // Favorite cuisine = most frequent
  const cuisineFreq: Record<string, number> = {};
  dishes.forEach((d) => {
    cuisineFreq[d.cuisine] = (cuisineFreq[d.cuisine] || 0) + 1;
  });
  const favoriteCuisine = Object.entries(cuisineFreq).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] ?? "—";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-24 lg:py-32 px-6 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mb-2">
            (Cooking)
          </p>
          <h2
            className="font-display font-black text-ink-primary leading-[0.95] mb-6"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
            }}
          >
            Dishes I&apos;ve Cooked
          </h2>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 lg:gap-10">
            {[
              { label: "Total Dishes", value: totalDishes, icon: "🍽️" },
              { label: "Cuisines", value: cuisineCount, icon: "🌍" },
              { label: "Favorite", value: favoriteCuisine, icon: "❤️" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-3 rounded-2xl bg-bg-surface border border-border px-5 py-3"
              >
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-xs font-mono text-ink-muted uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold text-ink-primary">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish, i) => (
            <DishCard key={dish.name} dish={dish} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
