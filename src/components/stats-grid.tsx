import { cn } from "@/lib/utils";
import type { CardStats } from "@/lib/types";
import { getStatLabels } from "@/lib/card-utils";

interface StatsGridProps {
  stats: CardStats;
  isGoalkeeper: boolean;
  textColor?: string;
}

export function StatsGrid({ stats, isGoalkeeper, textColor = "text-current" }: StatsGridProps) {
  const labels = getStatLabels(isGoalkeeper);
  const values = [stats.points, stats.attendance, stats.goalsOrGA, stats.wins, stats.assistsOrCS, stats.losses];
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-1 w-full px-4">
      {values.map((value, i) => (
        <div key={labels[i]} className={cn("flex items-baseline gap-2", textColor)}>
          <span className="text-lg font-bold tabular-nums">{value}</span>
          <span className="text-xs font-medium opacity-80">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
