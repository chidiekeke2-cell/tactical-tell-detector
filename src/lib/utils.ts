import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type { Formation, PlayStyle, MatchSource, MatchLog, CounterOutcome, CounterStrategy, Opponent, AnalystReport, TacticalZone } from "../types";