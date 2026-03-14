import { cn } from "@/lib/utils";
import type { CardStats } from "@/lib/types";
import { getStatLabels } from "@/lib/card-utils";

interface StatsGridProps {
  stats: CardStats;
  isGoalkeeper: boolean;
  textColor?: string;
  valueSize?: string;
  labelSize?: string;
}

export function StatsGrid({
  stats,
  isGoalkeeper,
  textColor = "text-current",
  valueSize = "text-[15px]",
  labelSize = "text-[8px]",
}: StatsGridProps) {
  const labels = getStatLabels(isGoalkeeper);
  const values = [stats.points, stats.attendance, stats.goalsOrGA, stats.wins, stats.assistsOrCS, stats.losses];
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-0 w-full pl-[16%] pr-[8%]">
      {values.map((value, i) => (
        <div key={labels[i]} className={cn("flex items-baseline gap-1", textColor)}>
          <span className={cn("font-bold tabular-nums leading-tight", valueSize)}>{value}</span>
          <span className={cn("font-semibold opacity-70 tracking-wide", labelSize)}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
