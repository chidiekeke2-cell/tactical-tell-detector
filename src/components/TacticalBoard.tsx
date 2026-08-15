import { useState } from "react";
import { motion } from "framer-motion";
import { Swords, Layers, Crosshair, Footprints, Map, Zap } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import { PITCH_ZONES } from "../constants";
import type { Formation, TacticalZone, MatchLog } from "../types";

interface TacticalBoardProps {
  formation: Formation | null;
  logs: MatchLog[];
  zones: TacticalZone[];
  onToggleZone: (id: string) => void;
}

export default function TacticalBoard({
  formation,
  logs,
  zones,
  onToggleZone,
}: TacticalBoardProps) {
  const [showLabels, setShowLabels] = useState(true);
  const [activeLayer, setActiveLayer] = useState<"all" | "formation" | "spaces" | "press">("all");

  const activeZones = zones.filter((z) => z.active);
  const neverPunishesLogs = logs.filter((l) => l.neverPunishes.trim());

  const filteredZones = zones.filter((z) => {
    if (activeLayer === "spaces") return z.type === "space";
    if (activeLayer === "press") return z.type === "press";
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <Swords className="h-4 w-4 text-emerald-400" />
          Tactical Pitch
        </h3>
        <div className="flex items-center gap-1.5">
          {(["all", "formation", "spaces", "press"] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={cn(
                "rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                activeLayer === layer
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              {layer === "all" ? "All" : layer.charAt(0).toUpperCase() + layer.slice(1)}
            </button>
          ))}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className="rounded-md px-2 py-1 text-[10px] text-zinc-600 hover:text-zinc-400"
          >
            {showLabels ? "Hide Labels" : "Show Labels"}
          </button>
        </div>
      </div>

      {/* Pitch */}
      <div className="relative mx-auto aspect-[2/3] w-full max-w-sm overflow-hidden rounded-xl border border-zinc-700 bg-gradient-to-b from-emerald-950/30 to-[#0a1628]">
        {/* Pitch markings */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 150">
          {/* Outer border */}
          <rect
            x="5"
            y="5"
            width="90"
            height="140"
            fill="none"
            stroke="rgba(16,185,129,0.15)"
            strokeWidth="0.5"
          />
          {/* Center line */}
          <line
            x1="5"
            y1="75"
            x2="95"
            y2="75"
            stroke="rgba(16,185,129,0.15)"
            strokeWidth="0.5"
          />
          {/* Center circle */}
          <circle
            cx="50"
            cy="75"
            r="12"
            fill="none"
            stroke="rgba(16,185,129,0.15)"
            strokeWidth="0.5"
          />
          {/* Penalty areas */}
          <rect
            x="20"
            y="15"
            width="60"
            height="30"
            fill="none"
            stroke="rgba(16,185,129,0.15)"
            strokeWidth="0.5"
          />
          <rect
            x="20"
            y="105"
            width="60"
            height="30"
            fill="none"
            stroke="rgba(16,185,129,0.15)"
            strokeWidth="0.5"
          />
          {/* Goal areas */}
          <rect
            x="30"
            y="5"
            width="40"
            height="12"
            fill="none"
            stroke="rgba(16,185,129,0.15)"
            strokeWidth="0.5"
          />
          <rect
            x="30"
            y="133"
            width="40"
            height="12"
            fill="none"
            stroke="rgba(16,185,129,0.15)"
            strokeWidth="0.5"
          />
        </svg>

        {/* Formation positions */}
        {formation &&
          formation.positions.map((pos, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[8px] font-bold text-emerald-400 ring-1 ring-emerald-500/30">
                {pos.label}
              </div>
              {showLabels && (
                <span className="mt-0.5 whitespace-nowrap text-[7px] text-zinc-600">
                  {pos.label}
                </span>
              )}
            </motion.div>
          ))}

        {/* Tactical zones */}
        {filteredZones.map((zone) => {
          const isActive = zone.active;
          const isHighlighted = zone.type === "space" || zone.type === "press";
          return (
            <motion.button
              key={zone.id}
              onClick={() => onToggleZone(zone.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all",
                zone.type === "press"
                  ? "border-red-500/30"
                  : zone.type === "space"
                    ? "border-amber-500/30"
                    : "border-cyan-500/30",
                isActive
                  ? cn(
                      "bg-opacity-20",
                      zone.type === "press"
                        ? "bg-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                        : zone.type === "space"
                          ? "bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                          : "bg-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                    )
                  : "bg-zinc-800/50"
              )}
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: isActive ? "28px" : "20px",
                height: isActive ? "28px" : "20px",
              }}
            >
              {isActive && (
                <span className="flex h-full items-center justify-center text-[9px] font-bold">
                  {zone.type === "press" ? "P" : zone.type === "space" ? "S" : "M"}
                </span>
              )}
            </motion.button>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap items-center gap-2 rounded-md bg-black/50 px-2 py-1.5 backdrop-blur-sm">
          <span className="flex items-center gap-1 text-[8px] text-zinc-500">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500/40" /> Positions
          </span>
          <span className="flex items-center gap-1 text-[8px] text-zinc-500">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500/40" /> Exploited Space
          </span>
          <span className="flex items-center gap-1 text-[8px] text-zinc-500">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500/40" /> Press Trigger
          </span>
          <span className="flex items-center gap-1 text-[8px] text-zinc-500">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-500/40" /> Sub Window
          </span>
        </div>
      </div>

      {/* "Never Punishes" space summary */}
      {neverPunishesLogs.length > 0 && (
        <div className="rounded-lg border border-amber-500/10 bg-amber-500/5 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Footprints className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-amber-400">
              Never Punishes — Exploitable Spaces
            </span>
          </div>
          <div className="space-y-1.5">
            {neverPunishesLogs.map((log) => (
              <p key={log.id} className="text-[11px] leading-relaxed text-zinc-400">
                <span className="text-zinc-600">
                  {new Date(log.date).toLocaleDateString()}:
                </span>{" "}
                {log.neverPunishes}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}