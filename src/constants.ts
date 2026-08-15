import type { Opponent, Formation, PlayStyle, TacticalZone } from "./types";

export const FORMATIONS: Formation[] = [
  {
    name: "4-2-1-3",
    structure: "4-2-1-3",
    positions: [
      { x: 50, y: 90, label: "CF" },
      { x: 25, y: 72, label: "LW" },
      { x: 75, y: 72, label: "RW" },
      { x: 50, y: 58, label: "AMF" },
      { x: 35, y: 45, label: "CMF" },
      { x: 65, y: 45, label: "CMF" },
      { x: 20, y: 28, label: "LB" },
      { x: 38, y: 28, label: "CB" },
      { x: 62, y: 28, label: "CB" },
      { x: 80, y: 28, label: "RB" },
      { x: 50, y: 10, label: "GK" },
    ],
  },
  {
    name: "4-3-3",
    structure: "4-3-3",
    positions: [
      { x: 50, y: 90, label: "CF" },
      { x: 25, y: 74, label: "LW" },
      { x: 75, y: 74, label: "RW" },
      { x: 35, y: 55, label: "CMF" },
      { x: 50, y: 50, label: "CMF" },
      { x: 65, y: 55, label: "CMF" },
      { x: 20, y: 28, label: "LB" },
      { x: 38, y: 28, label: "CB" },
      { x: 62, y: 28, label: "CB" },
      { x: 80, y: 28, label: "RB" },
      { x: 50, y: 10, label: "GK" },
    ],
  },
  {
    name: "5-2-1-2",
    structure: "5-2-1-2",
    positions: [
      { x: 35, y: 88, label: "CF" },
      { x: 65, y: 88, label: "CF" },
      { x: 50, y: 68, label: "AMF" },
      { x: 35, y: 52, label: "CMF" },
      { x: 65, y: 52, label: "CMF" },
      { x: 10, y: 30, label: "LWB" },
      { x: 30, y: 25, label: "CB" },
      { x: 50, y: 22, label: "CB" },
      { x: 70, y: 25, label: "CB" },
      { x: 90, y: 30, label: "RWB" },
      { x: 50, y: 10, label: "GK" },
    ],
  },
];

export const PLAYSTYLES: PlayStyle[] = [
  "Quick Counter",
  "Possession",
  "Long Ball Counter",
  "Out Wide",
  "Long Ball",
];

export const PITCH_ZONES: TacticalZone[] = [
  { id: "left-wing", label: "Left Wing", x: 15, y: 60, type: "space", active: false },
  { id: "right-wing", label: "Right Wing", x: 85, y: 60, type: "space", active: false },
  { id: "mid-center", label: "Mid Center", x: 50, y: 50, type: "press", active: false },
  { id: "mid-left", label: "Mid Left", x: 30, y: 50, type: "press", active: false },
  { id: "mid-right", label: "Mid Right", x: 70, y: 50, type: "press", active: false },
  { id: "behind-defense", label: "Behind Defense", x: 50, y: 75, type: "space", active: false },
  { id: "half-space-l", label: "Half Space L", x: 35, y: 65, type: "space", active: false },
  { id: "half-space-r", label: "Half Space R", x: 65, y: 65, type: "space", active: false },
  { id: "sub-momentum", label: "Sub Window", x: 50, y: 40, type: "sub", active: false },
  { id: "press-trap", label: "Press Trap", x: 50, y: 35, type: "press", active: false },
];

export const DEFAULT_OPPONENTS: Opponent[] = [
  {
    id: "opp-1",
    name: "RyuKaze_JP",
    matchesLogged: 12,
    matchLogs: [
      {
        id: "ml-1",
        opponentId: "opp-1",
        date: "2026-03-15",
        source: "live",
        formation: "4-2-1-3",
        playStyle: "Quick Counter",
        opener: "Opens in 4-2-1-3 but instantly shifts to 4-3-3 high press when opponent plays first touch into midfield. First 30s always a driven through ball to the right winger.",
        underPressure: "Drops to 5-4-1 deep block, switches to Long Ball. Stops pressing and lets opponent hold possession in their own half.",
        afterConceding: "Immediately subs in a fast CF (usually Mbappe or similar), switches to Out Wide, increases attacking depth to 9.",
        neverPunishes: "Consistently abandons the left-wing defensive half-space. Opponent's right midfielder has 3-4 seconds of unpressured time on the ball there.",
        resourceHabit: "Uses all 5 subs by minute 70. First sub is always at HT. Second sub batch at minute 60-65. Abandons tactical formation changes for pure attacking/defensive mental state.",
        possession: 44,
        shots: 7,
        shotsOnTarget: 3,
        passAccuracy: 78,
      },
      {
        id: "ml-2",
        opponentId: "opp-1",
        date: "2026-02-28",
        source: "video",
        formation: "4-2-1-3",
        playStyle: "Quick Counter",
        opener: "Kickoff long ball to right winger. Overlaps with RB immediately. First 30s always trying to force a cross into the box.",
        underPressure: "Video draft - high press intensity drops significantly after 60th minute. Players seem to disconnect from pressing triggers.",
        afterConceding: "Video draft - switches to all-out attack, CBs split wide, fullbacks become wingers.",
        neverPunishes: "Switches off completely on opponent's left side counter-attacks. The space between his RB and RCB is exploitable.",
        resourceHabit: "Consistent sub pattern: fresh fullbacks at 60', attacking midfielder at 70', striker at 75'.",
        possession: 39,
        shots: 5,
        shotsOnTarget: 2,
        passAccuracy: 72,
      },
    ],
    counterHistory: [
      { id: "ct-1", opponentId: "opp-1", description: "Overload left half-space with creative AMF - drag his CDMs out of position", outcome: "Worked", date: "2026-03-15" },
      { id: "ct-2", opponentId: "opp-1", description: "Deep block + long ball to pacey wingers to exploit his high defensive line", outcome: "Mixed", date: "2026-02-28" },
    ],
  },
  {
    id: "opp-2",
    name: "ElMatador_98",
    matchesLogged: 8,
    matchLogs: [
      {
        id: "ml-3",
        opponentId: "opp-2",
        date: "2026-03-10",
        source: "live",
        formation: "4-3-3",
        playStyle: "Possession",
        opener: "Starts with patient buildup, CBs split wide, CDM drops between them. First 30s is always a lateral pass sequence to probe defensive shape.",
        underPressure: "Increases possession tempo, uses one-touch passes in tight spaces. Does not abandon possession style even when losing.",
        afterConceding: "Switches to 3-4-3 diamond, brings on a creative playmaker, increases passing support range.",
        neverPunishes: "Never tracks runner from opponent's deep midfield positions. The space between his CDM and CBs is undefended on transitional plays.",
        resourceHabit: "Rarely subs before minute 70. Prefers tactical shape shifts over personnel changes. Uses 2-3 subs max.",
        possession: 62,
        shots: 11,
        shotsOnTarget: 6,
        passAccuracy: 87,
      },
    ],
    counterHistory: [
      { id: "ct-3", opponentId: "opp-2", description: "Compact mid-block forcing him wide, then pressing fullbacks on reception", outcome: "Worked", date: "2026-03-10" },
    ],
  },
  {
    id: "opp-3",
    name: "Tsubasa_10",
    matchesLogged: 5,
    matchLogs: [
      {
        id: "ml-4",
        opponentId: "opp-3",
        date: "2026-01-20",
        source: "video",
        formation: "5-2-1-2",
        playStyle: "Long Ball Counter",
        opener: "Video draft - deep defensive block from kickoff. Long ball to target man. Seems to concede possession deliberately.",
        underPressure: "Video draft - drops even deeper, almost 6-3-1 shape. Long clearances only.",
        afterConceding: "Video draft - no visible tactical reaction within first 10 minutes of conceding.",
        neverPunishes: "The channel between his LWB and LCB is consistently exposed in transition.",
        resourceHabit: "Brings on 3 defensive subs at minute 80+ to protect result. Rarely attacks with subs.",
        possession: 34,
        shots: 3,
        shotsOnTarget: 1,
        passAccuracy: 65,
      },
    ],
    counterHistory: [],
  },
];

const NL = `
`;

export const ANALYSIS_TEMPLATES = {
  weakestReads: (opponent: string, matchCount: number, videoFields: string[]) => {
    let result = `**WEAKEST READS — ${opponent}**${NL}`;
    result += `Only ${matchCount} match${matchCount !== 1 ? "es" : ""} logged — confidence is limited.${NL}`;
    if (videoFields.length > 0) {
      result += `Video-drafted fields flagged as low confidence: ${videoFields.join(", ")}.${NL}`;
      result += `  These are guesses from short clips, not reliable for tactical prep.${NL}`;
    }
    result += `Patterns may not hold across different in-game form patches or opponent skill levels.`;
    return result;
  },
  strongestReads: (opponent: string, patterns: string[]) => {
    let result = `**STRONGEST READS — ${opponent}**${NL}`;
    result += patterns.map((p, i) => `${i + 1}. ${p}`).join(NL);
    return result;
  },
  counterStrategies: (worked: string[], failed: string[], newStrategies: string[]) => {
    let result = `**COUNTER-STRATEGIES**${NL}`;
    if (worked.length > 0) {
      result += `What worked before:${NL}`;
      result += worked.map((s, i) => `  ${i + 1}. ${s}`).join(NL);
      result += `${NL}${NL}`;
    }
    if (failed.length > 0) {
      result += `What failed (avoid):${NL}`;
      result += failed.map((s, i) => `  ${i + 1}. ${s}`).join(NL);
      result += `${NL}${NL}`;
    }
    result += `Recommended adjustments:${NL}`;
    result += newStrategies.map((s, i) => `  ${i + 1}. ${s}`).join(NL);
    return result;
  },
  watchNext: (objectives: string[]) => {
    let result = `**WHAT TO WATCH NEXT**${NL}`;
    result += objectives.map((o, i) => `${i + 1}. ${o}`).join(NL);
    return result;
  },
};