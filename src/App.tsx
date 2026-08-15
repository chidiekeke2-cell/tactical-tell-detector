import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { toast, Toaster } from "sonner";
import Navbar from "./components/Navbar";
import OpponentHeader from "./components/OpponentHeader";
import MatchLogEditor from "./components/MatchLogEditor";
import TacticalBoard from "./components/TacticalBoard";
import AnalystReportComponent from "./components/AnalystReport";
import type { Opponent, MatchLog, CounterStrategy, TacticalZone } from "./types";
import { DEFAULT_OPPONENTS, FORMATIONS, PITCH_ZONES } from "./constants";

const STORAGE_KEY = "efootball-stress-test-data";

function loadData(): Opponent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_OPPONENTS;
}

function saveData(opponents: Opponent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(opponents));
  } catch {
    // storage full or private mode
  }
}

function App() {
  const prefersReduced = useReducedMotion();
  const [opponents, setOpponents] = useState<Opponent[]>(() => loadData());
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const data = loadData();
    return data.length > 0 ? data[0].id : null;
  });
  const [activeTab, setActiveTab] = useState("scout");
  const [zones, setZones] = useState<TacticalZone[]>(PITCH_ZONES.map((z) => ({ ...z })));

  const selectedOpponent = opponents.find((o) => o.id === selectedId) ?? null;

  useEffect(() => {
    saveData(opponents);
  }, [opponents]);

  useEffect(() => {
    if (selectedId && !opponents.find((o) => o.id === selectedId)) {
      setSelectedId(opponents.length > 0 ? opponents[0].id : null);
    }
  }, [opponents, selectedId]);

  const handleAddLog = useCallback(
    (log: MatchLog) => {
      if (!selectedId) return;
      setOpponents((prev) =>
        prev.map((opp) => {
          if (opp.id !== selectedId) return opp;
          toast.success("Match log added");
          return {
            ...opp,
            matchesLogged: opp.matchesLogged + 1,
            matchLogs: [...opp.matchLogs, log],
          };
        })
      );
    },
    [selectedId]
  );

  const handleDeleteLog = useCallback(
    (logId: string) => {
      if (!selectedId) return;
      setOpponents((prev) =>
        prev.map((opp) => {
          if (opp.id !== selectedId) return opp;
          return {
            ...opp,
            matchesLogged: opp.matchesLogged - 1,
            matchLogs: opp.matchLogs.filter((l) => l.id !== logId),
          };
        })
      );
      toast.success("Match log deleted");
    },
    [selectedId]
  );

  const handleNewOpponent = useCallback(() => {
    const name = prompt("Enter opponent name:");
    if (!name?.trim()) return;
    const newOpp: Opponent = {
      id: crypto.randomUUID(),
      name: name.trim(),
      matchesLogged: 0,
      matchLogs: [],
      counterHistory: [],
    };
    setOpponents((prev) => [...prev, newOpp]);
    setSelectedId(newOpp.id);
    toast.success(`New opponent: ${name.trim()}`);
  }, []);

  const handleAddCounter = useCallback(
    (strategy: CounterStrategy) => {
      if (!selectedId) return;
      setOpponents((prev) =>
        prev.map((opp) => {
          if (opp.id !== selectedId) return opp;
          return {
            ...opp,
            counterHistory: [...opp.counterHistory, strategy],
          };
        })
      );
    },
    [selectedId]
  );

  const handleExportReport = useCallback(() => {
    if (!selectedOpponent) return;
    const NL = String.fromCharCode(10);
    const lines: string[] = [
      "eFOOTBALL 2026 SCOUTING REPORT",
      `Opponent: ${selectedOpponent.name}`,
      `Matches Logged: ${selectedOpponent.matchesLogged}`,
      "",
      `Live matches: ${selectedOpponent.matchLogs.filter((m) => m.source === "live").length}`,
      `Video matches: ${selectedOpponent.matchLogs.filter((m) => m.source === "video").length}`,
      "",
    ];
    selectedOpponent.matchLogs.forEach((log) => {
      lines.push(`--- Match: ${new Date(log.date).toLocaleDateString()} (${log.source}) ---`);
      lines.push(`Formation: ${log.formation} | Style: ${log.playStyle}`);
      lines.push(`Opener: ${log.opener}`);
      lines.push(`Under Pressure: ${log.underPressure}`);
      lines.push(`After Conceding: ${log.afterConceding}`);
      lines.push(`Never Punishes: ${log.neverPunishes}`);
      lines.push(`Resource Habit: ${log.resourceHabit}`);
      if (log.possession) {
        lines.push(`Stats: ${log.possession}% poss, ${log.shots} shots, ${log.shotsOnTarget} SoT, ${log.passAccuracy}% pass`);
      }
      lines.push("");
    });
    const text = lines.join(NL);

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scouting-report-${selectedOpponent.name.replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded");
  }, [selectedOpponent]);

  const handleToggleZone = useCallback((zoneId: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, active: !z.active } : z))
    );
  }, []);

  const currentFormation =
    selectedOpponent && selectedOpponent.matchLogs.length > 0
      ? FORMATIONS.find(
          (f) =>
            f.name === selectedOpponent.matchLogs[selectedOpponent.matchLogs.length - 1].formation
        ) ?? FORMATIONS[0]
      : FORMATIONS[0];

  return (
    <div className="min-h-screen bg-[#090d16] text-zinc-100">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#111827",
            border: "1px solid #1f2937",
            color: "#e4e4e7",
            fontSize: "12px",
          },
        }}
      />

      <Navbar
        opponents={opponents}
        selectedOpponentId={selectedId}
        onSelectOpponent={setSelectedId}
        onNewOpponent={handleNewOpponent}
        onExportReport={handleExportReport}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="mx-auto max-w-5xl px-4 py-6">
        {!selectedOpponent ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
              <SwordIcon className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="mb-2 text-xl font-bold tracking-tight text-zinc-200">
              eFootball StressTest
            </h1>
            <p className="mb-6 max-w-md text-sm text-zinc-600">
              Sharp, skeptical scouting analysis. Log matches, stress-test your reads, and
              generate counter-strategies that build on what worked.
            </p>
            <button
              onClick={handleNewOpponent}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-emerald-400"
            >
              Add Your First Opponent
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <OpponentHeader opponent={selectedOpponent} />

              {activeTab === "scout" && (
                <MatchLogEditor
                  logs={selectedOpponent.matchLogs}
                  onAddLog={handleAddLog}
                  onDeleteLog={handleDeleteLog}
                />
              )}

              {activeTab === "pitch" && (
                <TacticalBoard
                  formation={currentFormation}
                  logs={selectedOpponent.matchLogs}
                  zones={zones}
                  onToggleZone={handleToggleZone}
                />
              )}

              {activeTab === "analysis" && (
                <AnalystReportComponent
                  opponent={selectedOpponent}
                  onAddCounter={handleAddCounter}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

function SwordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <line x1="19" y1="21" x2="21" y2="19" />
    </svg>
  );
}

export default App;