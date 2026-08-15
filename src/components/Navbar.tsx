import { Users, Plus, FileText, Download, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import type { Opponent } from "../types";

interface NavbarProps {
  opponents: Opponent[];
  selectedOpponentId: string | null;
  onSelectOpponent: (id: string) => void;
  onNewOpponent: () => void;
  onExportReport: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "scout", label: "Scout & Log" },
  { id: "pitch", label: "Tactical Pitch" },
  { id: "analysis", label: "Stress-Test Analysis" },
];

export default function Navbar({
  opponents,
  selectedOpponentId,
  onSelectOpponent,
  onNewOpponent,
  onExportReport,
  activeTab,
  onTabChange,
}: NavbarProps) {
  const selected = opponents.find((o) => o.id === selectedOpponentId);

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-[#090d16]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 pr-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-xs font-bold text-black">
            eF
          </div>
          <span className="hidden text-sm font-bold tracking-tight text-zinc-100 sm:block">
            StressTest
          </span>
        </div>

        {/* Tabs */}
        <div className="hidden items-center gap-1 sm:flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile tabs */}
        <div className="flex gap-1 sm:hidden">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-zinc-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Opponent selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-zinc-700 bg-zinc-800/50 text-xs text-zinc-300 hover:bg-zinc-700/50"
            >
              <Users className="h-3.5 w-3.5 text-emerald-400" />
              <span className="max-w-[100px] truncate">
                {selected?.name ?? "Select Opponent"}
              </span>
              <ChevronDown className="h-3 w-3 text-zinc-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 border-zinc-800 bg-[#111827]">
            {opponents.map((opp) => (
              <DropdownMenuItem
                key={opp.id}
                onClick={() => onSelectOpponent(opp.id)}
                className="cursor-pointer text-xs text-zinc-300 hover:bg-zinc-700/50 hover:text-zinc-100"
              >
                <ShieldIcon className="h-3.5 w-3.5 text-emerald-400" />
                {opp.name}
                <span className="ml-auto text-[10px] text-zinc-600">
                  {opp.matchesLogged}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={onNewOpponent}
              className="cursor-pointer border-t border-zinc-800 text-xs text-emerald-400 hover:bg-zinc-700/50"
            >
              <Plus className="mr-2 h-3.5 w-3.5" />
              New Opponent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs text-zinc-500 hover:text-zinc-300"
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 border-zinc-800 bg-[#111827]">
            <DropdownMenuItem
              onClick={onExportReport}
              className="cursor-pointer text-xs text-zinc-300 hover:bg-zinc-700/50"
            >
              <Download className="mr-2 h-3.5 w-3.5" />
              Download Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

function ShieldIcon({ className }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}