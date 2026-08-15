import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  AlertTriangle,
  Shield,
  Sword,
  Trophy,
  Check,
  ArrowRight,
  History,
  Target,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { cn } from "../lib/utils";
import { ANALYSIS_TEMPLATES } from "../constants";
import type { Opponent, CounterStrategy, AnalystReport, CounterOutcome } from "../types";

interface AnalystReportProps {
  opponent: Opponent;
  onAddCounter: (strategy: CounterStrategy) => void;
}

function generateReport(opponent: Opponent): AnalystReport {
  const matchLogs = opponent.matchLogs;
  const videoDraftedFields: string[] = [];

  matchLogs.forEach((log) => {
    if (log.source === "video") {
      if (log.underPressure) videoDraftedFields.push("under pressure");
      if (log.afterConceding) videoDraftedFields.push("after conceding");
    }
  });

  const neverPunishesPatterns = matchLogs
    .filter((l) => l.neverPunishes.trim())
    .map((l) => l.neverPunishes);

  const openerPatterns = matchLogs
    .filter((l) => l.opener.trim())
    .map((l) => `Opener (${new Date(l.date).toLocaleDateString()}): ${l.opener}`);

  const resourcePatterns = matchLogs
    .filter((l) => l.resourceHabit.trim())
    .map((l) => l.resourceHabit);

  const strongestReads: string[] = [];
  if (neverPunishesPatterns.length > 0) {
    strongestReads.push(
      `Consistent exploitable space: "${neverPunishesPatterns[0]}"`
    );
  }
  if (resourcePatterns.length > 0) {
    strongestReads.push(`Predictable resource management: ${resourcePatterns[0]}`);
  }
  if (openerPatterns.length > 0) {
    strongestReads.push(`Repeated opening pattern: ${openerPatterns[0]}`);
  }
  if (matchLogs.some((l) => l.possession && l.possession < 45)) {
    strongestReads.push("Low possession profile — comfortable without the ball, vulnerable when forced to build up.");
  }

  const worked = opponent.counterHistory
    .filter((c) => c.outcome === "Worked")
    .map((c) => c.description);
  const failed = opponent.counterHistory
    .filter((c) => c.outcome === "Failed")
    .map((c) => c.description);

  const newStrategies: string[] = [];
  if (neverPunishesPatterns.length > 0) {
    newStrategies.push(
      "Exploit the identified 'Never Punishes' space with a targeted overload — assign a midfielder to drift into that zone off the ball."
    );
  }
  if (resourcePatterns.length > 0) {
    newStrategies.push(
      "Time your attacking push to coincide with their defensive sub windows — they are vulnerable 5 minutes before their planned changes."
    );
  }
  if (matchLogs.some((l) => l.playStyle === "Quick Counter")) {
    newStrategies.push(
      "Drop into a mid-block and deny their wingers space to turn — force them to play through congested central channels where their quick transitions falter."
    );
  }
  if (matchLogs.some((l) => l.playStyle === "Possession")) {
    newStrategies.push(
      "High pressing triggers on their CBs — force rushed passes and capitalize on the space left behind their advancing fullbacks."
    );
  }
  if (newStrategies.length === 0) {
    newStrategies.push(
      "Log more matches to identify exploitable patterns — current data is insufficient for targeted counter-strategies."
    );
  }

  const watchNext: string[] = [];
  if (videoDraftedFields.length > 0) {
    watchNext.push(
      "Watch LIVE to validate video-drafted reads on " + videoDraftedFields.join(" and ") + " — these are guesses from short clips."
    );
  }
  if (neverPunishesPatterns.length > 0) {
    watchNext.push(
      "Test the identified 'Never Punishes' space by assigning a runner to that zone in the first 15 minutes."
    );
  }
  watchNext.push(
    "Note their first tactical reaction after conceding — is it immediate or delayed? This is a key decision-making window."
  );

  return {
    weakestReads: ANALYSIS_TEMPLATES.weakestReads(
      opponent.name,
      matchLogs.length,
      videoDraftedFields
    ),
    strongestReads: ANALYSIS_TEMPLATES.strongestReads(opponent.name, strongestReads),
    counterStrategies: ANALYSIS_TEMPLATES.counterStrategies(worked, failed, newStrategies),
    watchNext: ANALYSIS_TEMPLATES.watchNext(watchNext),
  };
}

export default function AnalystReportComponent({
  opponent,
  onAddCounter,
}: AnalystReportProps) {
  const [report, setReport] = useState<AnalystReport | null>(null);
  const [showNewCounter, setShowNewCounter] = useState(false);
  const [newCounterDesc, setNewCounterDesc] = useState("");
  const [newCounterOutcome, setNewCounterOutcome] = useState<CounterOutcome>("Worked");

  const generate = useCallback(() => {
    setReport(generateReport(opponent));
  }, [opponent]);

  const handleCopy = () => {
    if (!report) return;
    const NL = String.fromCharCode(10);
    const text = [
      report.weakestReads,
      "",
      report.strongestReads,
      "",
      report.counterStrategies,
      "",
      report.watchNext,
    ].join(NL + NL);
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Report copied to clipboard");
    });
  };

  const handleSaveCounter = () => {
    if (!newCounterDesc.trim()) return;
    onAddCounter({
      id: crypto.randomUUID(),
      opponentId: opponent.id,
      description: newCounterDesc.trim(),
      outcome: newCounterOutcome,
      date: new Date().toISOString().split("T")[0],
    });
    setNewCounterDesc("");
    setShowNewCounter(false);
    toast.success("Counter strategy logged");
  };

  const sections = report
    ? [
        { title: "Weakest Reads", icon: AlertTriangle, content: report.weakestReads, color: "text-amber-400" },
        { title: "Strongest Reads", icon: Trophy, content: report.strongestReads, color: "text-emerald-400" },
        { title: "Counter-Strategies", icon: Sword, content: report.counterStrategies, color: "text-cyan-400" },
        { title: "What to Watch Next", icon: Target, content: report.watchNext, color: "text-rose-400" },
      ]
    : [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <Shield className="h-4 w-4 text-emerald-400" />
          Stress-Test Analysis
        </h3>
        <div className="flex items-center gap-2">
          {report && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="h-7 gap-1 border-zinc-700 text-xs text-zinc-400 hover:bg-zinc-800"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          )}
          <Button
            size="sm"
            onClick={generate}
            className="h-7 gap-1.5 bg-emerald-500 text-xs text-black hover:bg-emerald-400"
          >
            <Sword className="h-3.5 w-3.5" />
            Generate Analysis
          </Button>
        </div>
      </div>

      {!report && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-zinc-800 py-8 text-center">
          <Shield className="h-6 w-6 text-zinc-700" />
          <p className="text-xs text-zinc-600">
            Click "Generate Analysis" to stress-test your reads on{" "}
            {opponent.name}.
          </p>
          <p className="text-[10px] text-zinc-700">
            Based on {opponent.matchesLogged} match{opponent.matchesLogged !== 1 ? "es" : ""} logged.
          </p>
        </div>
      )}

      {report && (
        <div className="space-y-2.5">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
            >
              <div className="mb-2 flex items-center gap-2">
                <section.icon className={`h-4 w-4 ${section.color}`} />
                <span className={`text-[11px] font-bold uppercase tracking-wider ${section.color}`}>
                  {section.title}
                </span>
              </div>
              <div className="whitespace-pre-wrap text-[11px] leading-relaxed text-zinc-400">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
              Counter History
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowNewCounter(!showNewCounter)}
            className="h-6 gap-1 text-[10px] text-zinc-500 hover:text-zinc-300"
          >
            {showNewCounter ? (
              <>
                <Trash2 className="h-3 w-3" /> Cancel
              </>
            ) : (
              <>
                <Plus className="h-3 w-3" /> Log Counter
              </>
            )}
          </Button>
        </div>

        {showNewCounter && (
          <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-800/50 p-3">
            <textarea
              value={newCounterDesc}
              onChange={(e) => setNewCounterDesc(e.target.value)}
              placeholder="Describe the counter strategy you tried..."
              rows={2}
              className="mb-2 w-full resize-none rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:border-emerald-500/30 focus:outline-none"
            />
            <div className="flex items-center gap-2">
              {(["Worked", "Mixed", "Failed"] as const).map((outcome) => (
                <button
                  key={outcome}
                  onClick={() => setNewCounterOutcome(outcome)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors",
                    newCounterOutcome === outcome
                      ? outcome === "Worked"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : outcome === "Failed"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-amber-500/10 text-amber-400"
                      : "bg-zinc-800 text-zinc-600 hover:text-zinc-400"
                  )}
                >
                  {outcome}
                </button>
              ))}
              <div className="flex-1" />
              <Button
                size="sm"
                onClick={handleSaveCounter}
                disabled={!newCounterDesc.trim()}
                className="h-7 bg-emerald-500 text-xs text-black hover:bg-emerald-400"
              >
                <Check className="mr-1 h-3 w-3" />
                Save
              </Button>
            </div>
          </div>
        )}

        {opponent.counterHistory.length === 0 ? (
          <p className="text-[11px] text-zinc-600">No counter strategies logged yet.</p>
        ) : (
          <div className="space-y-1.5">
            {[...opponent.counterHistory]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((c) => (
                <div
                  key={c.id}
                  className="flex items-start gap-2 rounded-md border border-zinc-800 bg-zinc-900/30 p-2"
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-0.5 shrink-0 border px-1.5 py-0 text-[9px]",
                      c.outcome === "Worked"
                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                        : c.outcome === "Failed"
                          ? "border-red-500/30 bg-red-500/5 text-red-400"
                          : "border-amber-500/30 bg-amber-500/5 text-amber-400"
                    )}
                  >
                    {c.outcome}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-[11px] text-zinc-400">{c.description}</p>
                    <p className="text-[9px] text-zinc-700">
                      {new Date(c.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}