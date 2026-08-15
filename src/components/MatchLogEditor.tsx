import { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Video,
  Eye,
  Clock,
  Crosshair,
  Footprints,
  Map,
  Flag,
  Zap,
  Check,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import type { MatchLog, PlayStyle, MatchSource } from "../types";
import { PLAYSTYLES, FORMATIONS } from "../constants";

interface MatchLogEditorProps {
  logs: MatchLog[];
  onAddLog: (log: MatchLog) => void;
  onDeleteLog: (id: string) => void;
}

const EMPTY_LOG = {
  id: "",
  opponentId: "",
  date: new Date().toISOString().split("T")[0],
  source: "live" as MatchSource,
  formation: "4-2-1-3",
  playStyle: "Quick Counter" as PlayStyle,
  opener: "",
  underPressure: "",
  afterConceding: "",
  neverPunishes: "",
  resourceHabit: "",
};

export default function MatchLogEditor({
  logs,
  onAddLog,
  onDeleteLog,
}: MatchLogEditorProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<typeof EMPTY_LOG>({ ...EMPTY_LOG });

  const handleSubmit = () => {
    if (!form.opener.trim()) return;
    onAddLog({
      ...form,
      id: crypto.randomUUID(),
    });
    setForm({ ...EMPTY_LOG });
    setShowForm(false);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <Clock className="h-4 w-4 text-emerald-400" />
          Match Logs
          <Badge
            variant="outline"
            className="ml-1 border-zinc-700 text-[10px] text-zinc-500"
          >
            {logs.length}
          </Badge>
        </h3>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="h-7 gap-1 bg-emerald-500 text-xs text-black hover:bg-emerald-400"
        >
          {showForm ? (
            <>
              <X className="h-3.5 w-3.5" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" /> Log Match
            </>
          )}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-zinc-300"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                Source
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setForm({ ...form, source: "live" })}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-xs transition-colors ${
                    form.source === "live"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 text-zinc-500 hover:border-zinc-600"
                  }`}
                >
                  <Eye className="h-3 w-3" /> Live
                </button>
                <button
                  onClick={() => setForm({ ...form, source: "video" })}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-xs transition-colors ${
                    form.source === "video"
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : "border-zinc-700 text-zinc-500 hover:border-zinc-600"
                  }`}
                >
                  <Video className="h-3 w-3" /> Video
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                Formation
              </label>
              <select
                value={form.formation}
                onChange={(e) => setForm({ ...form, formation: e.target.value })}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-zinc-300"
              >
                {FORMATIONS.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.structure}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                Play Style
              </label>
              <select
                value={form.playStyle}
                onChange={(e) =>
                  setForm({ ...form, playStyle: e.target.value as PlayStyle })
                }
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-zinc-300"
              >
                {PLAYSTYLES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Text fields */}
          <div className="space-y-2.5">
            {(
              [
                {
                  key: "opener",
                  label: "Opener",
                  icon: Zap,
                  placeholder: "First 30 seconds — formation shift, press trigger, early attacking pattern...",
                },
                {
                  key: "underPressure",
                  label: "Under Pressure",
                  icon: Crosshair,
                  placeholder: "What they do when losing or defending a lead...",
                },
                {
                  key: "afterConceding",
                  label: "After Conceding",
                  icon: Flag,
                  placeholder: "First tactical/personnel reaction after conceding...",
                },
                {
                  key: "neverPunishes",
                  label: "Never Punishes",
                  icon: Footprints,
                  placeholder: "A space or run they consistently fail to track...",
                },
                {
                  key: "resourceHabit",
                  label: "Resource Habit",
                  icon: Map,
                  placeholder: "How they use subs, formation changes, or tempo shifts...",
                },
              ] as const
            ).map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key}>
                  <label className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                    <Icon className="h-3 w-3" />
                    {field.label}
                  </label>
                  <textarea
                    value={(form as any)[field.key]}
                    onChange={(e) =>
                      setForm({ ...form, [field.key]: e.target.value })
                    }
                    placeholder={field.placeholder}
                    rows={2}
                    className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:border-emerald-500/30 focus:outline-none"
                  />
                </div>
              );
            })}
          </div>

          {/* Stats row */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {(
              [
                { key: "possession", label: "Possession %", icon: Map },
                { key: "shots", label: "Shots", icon: Crosshair },
                { key: "shotsOnTarget", label: "Shots on Target", icon: Eye },
                { key: "passAccuracy", label: "Pass Accuracy %", icon: Zap },
              ] as const
            ).map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.key}>
                  <label className="mb-1 flex items-center gap-1 text-[10px] font-medium text-zinc-600">
                    <Icon className="h-2.5 w-2.5" />
                    {stat.label}
                  </label>
                  <input
                    type="number"
                    value={(form as any)[stat.key] ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [stat.key]: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300"
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!form.opener.trim()}
              className="h-8 gap-1.5 bg-emerald-500 text-xs text-black hover:bg-emerald-400"
            >
              <Check className="h-3.5 w-3.5" />
              Save Match Log
            </Button>
          </div>
        </div>
      )}

      {/* Log list */}
      <div className="space-y-2">
        {logs.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-zinc-800 py-8 text-center">
            <Clock className="h-6 w-6 text-zinc-700" />
            <p className="text-xs text-zinc-600">No match logs yet.</p>
            <p className="text-[10px] text-zinc-700">
              Add your first match log to start scouting.
            </p>
          </div>
        )}

        {[...logs]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((log) => (
            <div
              key={log.id}
              className="group rounded-lg border border-zinc-800 bg-zinc-900/30 p-3 transition-colors hover:border-zinc-700"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "border px-1.5 py-0 text-[10px]",
                      log.source === "live"
                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                        : "border-amber-500/30 bg-amber-500/5 text-amber-400"
                    )}
                  >
                    {log.source === "live" ? (
                      <Eye className="mr-1 inline h-2.5 w-2.5" />
                    ) : (
                      <Video className="mr-1 inline h-2.5 w-2.5" />
                    )}
                    {log.source === "live" ? "Live" : "Video"}
                  </Badge>
                  <span className="text-[11px] font-medium text-zinc-400">
                    {log.formation} · {log.playStyle}
                  </span>
                  <span className="text-[10px] text-zinc-600">
                    {new Date(log.date).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteLog(log.id)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500 hover:text-red-400" />
                </button>
              </div>

              <div className="grid gap-1.5 text-[11px] text-zinc-400">
                {[
                  { label: "Opener", value: log.opener, icon: Zap },
                  { label: "Under Pressure", value: log.underPressure, icon: Crosshair },
                  { label: "After Conceding", value: log.afterConceding, icon: Flag },
                  { label: "Never Punishes", value: log.neverPunishes, icon: Footprints },
                  { label: "Resource Habit", value: log.resourceHabit, icon: Map },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex gap-2">
                      <span className="flex w-28 shrink-0 items-center gap-1 text-[10px] font-medium text-zinc-600">
                        <Icon className="h-2.5 w-2.5" />
                        {item.label}
                      </span>
                      <span className="text-zinc-400">{item.value}</span>
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              {(log.possession || log.shots || log.shotsOnTarget || log.passAccuracy) && (
                <div className="mt-2 flex gap-3 border-t border-zinc-800 pt-2 text-[10px] text-zinc-600">
                  {log.possession && <span>Possession: {log.possession}%</span>}
                  {log.shots && <span>Shots: {log.shots}</span>}
                  {log.shotsOnTarget && <span>SoT: {log.shotsOnTarget}</span>}
                  {log.passAccuracy && <span>Pass: {log.passAccuracy}%</span>}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}