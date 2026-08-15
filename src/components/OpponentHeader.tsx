import { Clock, Video, Eye, Target, Crosshair, Sword, Trophy } from "lucide-react";
import { Badge } from "./ui/badge";
import type { Opponent, MatchLog } from "../types";

interface OpponentHeaderProps {
  opponent: Opponent;
}

export default function OpponentHeader({ opponent }: OpponentHeaderProps) {
  const liveMatches = opponent.matchLogs.filter((m) => m.source === "live");
  const videoMatches = opponent.matchLogs.filter((m) => m.source === "video");
  const confidence = opponent.matchesLogged > 0
    ? Math.round((liveMatches.length / opponent.matchesLogged) * 100)
    : 0;

  const workedCount = opponent.counterHistory.filter((c) => c.outcome === "Worked").length;
  const failedCount = opponent.counterHistory.filter((c) => c.outcome === "Failed").length;

  return (
    <div className="rounded-lg border border-zinc-800 bg-[#111827] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Identity */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-zinc-100">
              {opponent.name}
            </h2>
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/5 text-[10px] text-emerald-400"
            >
              {opponent.matchesLogged} matches
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last match:{" "}
              {opponent.matchLogs.length > 0
                ? new Date(
                    Math.max(
                      ...opponent.matchLogs.map((m) => new Date(m.date).getTime())
                    )
                  ).toLocaleDateString()
                : "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <Video className="h-3 w-3" />
              {videoMatches.length} video
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {liveMatches.length} live
            </span>
          </div>
        </div>

        {/* Confidence gauge */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
              Confidence
            </span>
            <div className="flex h-2 w-24 overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  confidence >= 70
                    ? "bg-emerald-500"
                    : confidence >= 40
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span
              className={`text-xs font-bold tabular-nums ${
                confidence >= 70
                  ? "text-emerald-400"
                  : confidence >= 40
                    ? "text-amber-400"
                    : "text-red-400"
              }`}
            >
              {confidence}%
            </span>
          </div>
          <span className="text-[10px] text-zinc-600">
            {confidence < 50
              ? "Low confidence — more live matches needed"
              : confidence < 70
                ? "Moderate — supplement with live logging"
                : "High confidence — reliable tactical data"}
          </span>
        </div>
      </div>

      {/* Counter history summary */}
      {opponent.counterHistory.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-zinc-800 pt-3">
          <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
            <Target className="h-3 w-3" />
            Counter History
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-400">
            <Trophy className="h-3 w-3" />
            {workedCount} worked
          </span>
          <span className="flex items-center gap-1 text-[11px] text-red-400">
            <Crosshair className="h-3 w-3" />
            {failedCount} failed
          </span>
          <span className="flex items-center gap-1 text-[11px] text-amber-400">
            <Sword className="h-3 w-3" />
            {opponent.counterHistory.filter((c) => c.outcome === "Mixed").length} mixed
          </span>
        </div>
      )}
    </div>
  );
}