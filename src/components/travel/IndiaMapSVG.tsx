"use client";
// ============================================================
//  IndiaMapSVG.tsx — Accurate India map using @svg-maps/india
//  36 states/UTs with precise SVG boundaries
//  Features: animated hover, status colouring, photo popup
// ============================================================
import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { TravelState } from "@/types";
import travelData from "@/data/travel.json";
import indiaMapData from "@/data/india-svg-map.json";

const travelStates = travelData as unknown as TravelState[];

// Map from svg-maps lowercase IDs → our IN-XX format
function toTravelId(svgId: string): string {
  return "IN-" + svgId.toUpperCase();
}

// Build a quick lookup: IN-XX → TravelState
const TRAVEL_MAP = travelStates.reduce<Record<string, TravelState>>(
  (acc, s) => { acc[s.stateId] = s; return acc; },
  {}
);

// ─── Status → colour mapping ────────────────────────────────
const STATUS_COLORS: Record<string, { fill: string; glow: string; label: string }> = {
  visited: { fill: "#22c55e", glow: "rgba(34,197,94,0.45)",  label: "Visited" },
  lived:   { fill: "#ef4444", glow: "rgba(239,68,68,0.45)",  label: "Lived" },
  want:    { fill: "#f59e0b", glow: "rgba(245,158,11,0.45)", label: "On wishlist" },
};

// ─── Types for the SVG data ─────────────────────────────────
interface SvgLocation {
  name: string;
  id:   string;
  path: string;
}

interface SvgMapData {
  label:     string;
  viewBox:   string;
  locations: SvgLocation[];
}

const mapData = indiaMapData as SvgMapData;

// ─── Component ───────────────────────────────────────────────
interface Props {
  onStateHover?: (stateId: string) => void;
}

interface HoverInfo {
  state: TravelState;
  clientX: number;
  clientY: number;
}

export function IndiaMapSVG({ onStateHover }: Props) {
  const [hovered, setHovered] = useState<HoverInfo | null>(null);
  const [popupPos, setPopupPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });

  const handleMouseEnter = useCallback(
    (svgId: string, e: React.MouseEvent) => {
      const travelId = toTravelId(svgId);
      const travelState = TRAVEL_MAP[travelId];
      if (!travelState) return;
      onStateHover?.(travelId);

      // Position popup relative to the container
      const container = (e.currentTarget as SVGElement).closest(".india-map-container");
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const goLeft = x > rect.width * 0.55;
        setPopupPos({
          left: goLeft ? x - 310 : x + 20,
          top: Math.max(10, Math.min(y - 80, rect.height - 300)),
        });
      }

      setHovered({ state: travelState, clientX: e.clientX, clientY: e.clientY });
    },
    [onStateHover]
  );

  const handleMouseMove = useCallback(
    (svgId: string, e: React.MouseEvent) => {
      const travelId = toTravelId(svgId);
      if (!TRAVEL_MAP[travelId]) return;

      const container = (e.currentTarget as SVGElement).closest(".india-map-container");
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const goLeft = x > rect.width * 0.55;
        setPopupPos({
          left: goLeft ? x - 310 : x + 20,
          top: Math.max(10, Math.min(y - 80, rect.height - 300)),
        });
      }
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
  }, []);

  // Determine fill colour for a state path
  const getFill = (svgId: string, isHovered: boolean) => {
    const travelId = toTravelId(svgId);
    const travel = TRAVEL_MAP[travelId];
    if (!travel) {
      return isHovered
        ? "hsl(var(--elevated))"
        : "hsl(var(--ink-dim))";
    }
    const color = STATUS_COLORS[travel.status];
    if (isHovered) return color.fill;
    return `${color.fill}25`; // 15% opacity
  };

  const getStroke = (svgId: string, isHovered: boolean) => {
    const travelId = toTravelId(svgId);
    const travel = TRAVEL_MAP[travelId];
    if (isHovered && travel) return STATUS_COLORS[travel.status].fill;
    return "hsl(var(--border))";
  };

  return (
    <div className="india-map-container relative w-full max-w-[600px] mx-auto">
      {/* ── SVG Map ─────────────────────────────────────────── */}
      <svg
        viewBox={mapData.viewBox}
        className="w-full h-auto"
        role="img"
        aria-label="Interactive India travel map"
        style={{ filter: "drop-shadow(0 4px 24px hsl(var(--ink-dim)))" }}
      >
        {mapData.locations.map((loc) => {
          const travelId = toTravelId(loc.id);
          const isActive = !!TRAVEL_MAP[travelId];
          const isHov = hovered?.state.stateId === travelId;

          return (
            <motion.path
              key={loc.id}
              d={loc.path}
              fill={getFill(loc.id, isHov)}
              stroke={getStroke(loc.id, isHov)}
              strokeWidth={isHov ? 1.8 : 0.5}
              strokeLinejoin="round"
              className={isActive ? "cursor-pointer" : "cursor-default"}
              initial={false}
              animate={{
                opacity: isHov ? 1 : isActive ? 0.9 : 0.5,
                scale: isHov ? 1.01 : 1,
              }}
              transition={{ type: "tween", duration: 0.15 }}
              style={{
                transformOrigin: "center",
                filter: isHov ? `drop-shadow(0 0 12px ${STATUS_COLORS[TRAVEL_MAP[travelId]?.status]?.glow ?? "transparent"})` : "none",
              }}
              onMouseEnter={(e) => handleMouseEnter(loc.id, e)}
              onMouseMove={(e) => handleMouseMove(loc.id, e)}
              onMouseLeave={handleMouseLeave}
            >
              <title>{loc.name}</title>
            </motion.path>
          );
        })}
      </svg>

      {/* ── Legend ─────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-6 mt-6">
        {Object.entries(STATUS_COLORS).map(([, val]) => (
          <div key={val.label} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: val.fill }}
            />
            <span className="text-xs font-mono text-ink-muted">{val.label}</span>
          </div>
        ))}
      </div>

      {/* ── Hover Popup ─────────────────────────────────────── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key={hovered.state.stateId}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              left: popupPos.left,
              top: popupPos.top,
              zIndex: 50,
            }}
            className="
              w-72 sm:w-80
              rounded-2xl bg-bg-surface/95 backdrop-blur-md
              border border-border
              shadow-card-hover
              p-4 pointer-events-none
            "
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{hovered.state.emoji}</span>
              <div>
                <h4 className="text-sm font-bold text-ink-primary">
                  {hovered.state.stateName}
                </h4>
                <span
                  className="
                    text-[10px] font-mono uppercase tracking-wider px-2 py-0.5
                    rounded-full inline-block mt-0.5
                  "
                  style={{
                    backgroundColor: `${STATUS_COLORS[hovered.state.status].fill}20`,
                    color: STATUS_COLORS[hovered.state.status].fill,
                  }}
                >
                  {STATUS_COLORS[hovered.state.status].label}
                </span>
              </div>
            </div>

            {/* Photo grid */}
            {hovered.state.photos && hovered.state.photos.length > 0 && (
              <div className="grid grid-cols-2 gap-1.5 mb-3 rounded-lg overflow-hidden">
                {hovered.state.photos.slice(0, 4).map((photo, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] bg-bg-elevated overflow-hidden rounded-md"
                  >
                    <Image
                      src={photo}
                      alt={`${hovered.state.stateName} photo ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="160px"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: `linear-gradient(135deg, ${STATUS_COLORS[hovered.state.status].fill}40, transparent)`,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* No photos placeholder */}
            {(!hovered.state.photos || hovered.state.photos.length === 0) && (
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] rounded-md bg-bg-elevated flex items-center justify-center"
                  >
                    <span className="text-2xl opacity-20">{hovered.state.emoji}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Top memory */}
            {hovered.state.memories[0] && (
              <div className="border-t border-border pt-2.5">
                <p className="text-[10px] font-mono text-ink-muted mb-1">
                  {hovered.state.memories[0].year}
                </p>
                <p className="text-xs text-ink-secondary leading-relaxed line-clamp-3">
                  {hovered.state.memories[0].highlight}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
