"use client";
// ============================================================
//  components/widgets/IndiaMapCard.tsx
//  Free, offline-first interactive India state map.
//  • Uses react-simple-maps + a LOCAL /public/india-states.topojson
//    (download once, zero API calls, zero cost forever)
//  • Hover highlights visited states in red, lived-in states in amber
//  • Shows a sleek tooltip with travel memories
//
//  ── TopoJSON source (free, open-source) ──────────────────────
//  curl -L \
//    "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json" \
//    -o public/india-states.topojson
// ============================================================
import {
  useState, useCallback, useRef,
} from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { AnimatePresence, motion }      from "framer-motion";
import { MapPin }                        from "lucide-react";
import travelData                        from "@/data/travel.json";
import type { TravelState, TooltipData } from "@/types";

// ─── Path to the local TopoJSON (in /public) ─────────────────
const GEO_URL = "/india-states.topojson";

// ─── Build a lookup map by stateId ───────────────────────────
const TRAVEL_MAP = (travelData as unknown as TravelState[]).reduce<Record<string, TravelState>>(
  (acc, s) => { acc[s.stateId] = s; return acc; },
  {}
);

// ─── Colour palette ──────────────────────────────────────────
const COLORS = {
  visited:  "#EF3B2D",   // red — visited
  lived:    "#F59E0B",   // amber — lived in
  want:     "#3B82F6",   // blue — want to go
  default:  "#ffffff",   // white — unvisited
  hover:    "#333333",
} as const;

function stateColor(id: string, hovered: boolean) {
  const state = TRAVEL_MAP[id];
  if (!state) return hovered ? COLORS.hover : COLORS.default;
  if (state.status === "lived")   return COLORS.lived;
  if (state.status === "visited") return COLORS.visited;
  return COLORS.want;
}

// ─── Tooltip component ───────────────────────────────────────
function MapTooltip({ data }: { data: TooltipData | null }) {
  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 6 }}
          animate={{ opacity: 1, scale: 1,   y: 0 }}
          exit={{    opacity: 0, scale: 0.9,  y: 6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{ left: data.x + 10, top: data.y - 10 }}
          className="
            absolute z-20 pointer-events-none
            max-w-[220px]
            bg-bg-elevated/95 backdrop-blur-sm
            border border-border rounded-xl
            p-3 shadow-card-hover
          "
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">{data.content.emoji}</span>
            <div>
              <p className="text-xs font-bold text-ink-primary">{data.content.stateName}</p>
              <p className="text-[10px] font-mono text-ink-muted capitalize">
                {data.content.status}
              </p>
            </div>
          </div>

          {/* Memories list */}
          {data.content.memories.slice(0, 2).map((m, i) => (
            <p key={i} className="text-[10px] text-ink-secondary leading-relaxed mb-1 last:mb-0">
              <span className="text-ink-muted font-mono">{m.year}</span>
              {" — "}{m.highlight}
            </p>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Props ───────────────────────────────────────────────────
interface Props {
  /** Called when user hovers a new state (for achievement tracking) */
  onStateHover?: (stateId: string) => void;
}

export function IndiaMapCard({ onStateHover }: Props) {
  const [tooltip,    setTooltip]    = useState<TooltipData | null>(null);
  const [hoveredId,  setHoveredId]  = useState<string | null>(null);
  const containerRef                = useRef<HTMLDivElement>(null);

  // Track how many UNIQUE states were hovered (for achievement)
  const hoveredSet  = useRef<Set<string>>(new Set());

  const handleEnter = useCallback(
    (geo: { id: string }, e: React.MouseEvent) => {
      const rect    = containerRef.current?.getBoundingClientRect();
      const stateId = geo.id;
      setHoveredId(stateId);

      if (rect) {
        setTooltip({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          content: TRAVEL_MAP[stateId] ?? {
            stateId,
            stateName: stateId,
            status: "visited",
            emoji: "📍",
            memories: [{ year: "—", highlight: "Not visited yet." }],
          },
        });
      }

      // Track unique hovers for the explorer achievement
      if (TRAVEL_MAP[stateId]) {
        hoveredSet.current.add(stateId);
        onStateHover?.(stateId);
      }
    },
    [onStateHover]
  );

  const handleMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && tooltip) {
      setTooltip((prev) =>
        prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null
      );
    }
  }, [tooltip]);

  const handleLeave = useCallback(() => {
    setHoveredId(null);
    setTooltip(null);
  }, []);

  // ── Legend data ─────────────────────────────────────────────
  const legend = [
    { color: COLORS.lived,   label: "Lived in" },
    { color: COLORS.visited, label: "Visited"  },
    { color: COLORS.want,    label: "Want to"  },
  ];

  const visitedCount = (travelData as unknown as TravelState[]).filter(
    (s) => s.status === "visited" || s.status === "lived"
  ).length;

  return (
    <div
      className="
        relative h-full overflow-hidden rounded-2.5xl
        bg-bg-surface border border-border
        flex flex-col
      "
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-accent-red" />
          <div>
            <h3 className="text-sm font-bold text-ink-primary">India Travels</h3>
            <p className="text-[10px] font-mono text-ink-muted">
              {visitedCount} states explored
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3">
          {legend.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              <span className="text-[9px] font-mono text-ink-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Map ────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative flex-1"
        onMouseMove={handleMove}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 1000, center: [82, 22] }}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup zoom={1} maxZoom={4} minZoom={1}>
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: Array<{ rsmKey: string; id: string }> }) =>
                geographies.map((geo: { rsmKey: string; id: string }) => {
                  const isHovered = hoveredId === geo.id;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo as never}
                      fill={stateColor(geo.id, isHovered)}
                      stroke="#ffffff"
                      strokeWidth={0.8}
                      style={{
                        default: { outline: "none", transition: "fill 0.2s ease" },
                        hover:   { outline: "none", fill: isHovered && TRAVEL_MAP[geo.id]
                          ? stateColor(geo.id, false)
                          : "#29bb05",
                          filter: "brightness(1.3)"
                        },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={(e: React.MouseEvent) => handleEnter(geo, e)}
                      onMouseLeave={handleLeave}
                      aria-label={geo.id}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        <MapTooltip data={tooltip} />
      </div>
    </div>
  );
}
