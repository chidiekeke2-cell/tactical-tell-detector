export interface Formation {
  name: string;
  structure: string; // e.g. "4-2-1-3"
  positions: { x: number; y: number; label: string }[];
}

export type PlayStyle =
  | "Quick Counter"
  | "Possession"
  | "Long Ball Counter"
  | "Out Wide"
  | "Long Ball";

export type MatchSource = "live" | "video";

export interface MatchLog {
  id: string;
  opponentId: string;
  date: string;
  source: MatchSource;
  formation: string;
  playStyle: PlayStyle;
  opener: string;
  underPressure: string;
  afterConceding: string;
  neverPunishes: string;
  resourceHabit: string;
  possession?: number;
  shots?: number;
  shotsOnTarget?: number;
  passAccuracy?: number;
}

export type CounterOutcome = "Worked" | "Failed" | "Mixed";

export interface CounterStrategy {
  id: string;
  opponentId: string;
  description: string;
  outcome: CounterOutcome;
  date: string;
}

export interface Opponent {
  id: string;
  name: string;
  matchesLogged: number;
  matchLogs: MatchLog[];
  counterHistory: CounterStrategy[];
}

export interface AnalystReport {
  weakestReads: string;
  strongestReads: string;
  counterStrategies: string;
  watchNext: string;
}

export interface TacticalZone {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "press" | "space" | "sub" | "formation";
  active: boolean;
}