"use client";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface GameweekChartData {
  gw: string;
  goals: number;
  assists: number;
  players: number;
}

interface TierData {
  tier: string;
  count: number;
  fill: string;
}

interface TopScorerData {
  name: string;
  goals: number;
  assists: number;
}

interface SeasonDashboardProps {
  gameweekData: GameweekChartData[];
  tierData: TierData[];
  topScorers: TopScorerData[];
  cumulativeGoals: { gw: string; goals: number }[];
}

const goalsAssistsConfig: ChartConfig = {
  goals: { label: "Goals", color: "oklch(0.795 0.184 86.047)" },
  assists: { label: "Assists", color: "oklch(0.7 0.15 200)" },
};

const attendanceConfig: ChartConfig = {
  players: { label: "Players", color: "oklch(0.7 0.15 150)" },
};

const tierConfig: ChartConfig = {
  count: { label: "Players" },
};

const topScorersConfig: ChartConfig = {
  goals: { label: "Goals", color: "oklch(0.795 0.184 86.047)" },
  assists: { label: "Assists", color: "oklch(0.7 0.15 200)" },
};

const cumulativeConfig: ChartConfig = {
  goals: { label: "Total Goals", color: "oklch(0.795 0.184 86.047)" },
};

export function SeasonDashboard({
  gameweekData,
  tierData,
  topScorers,
  cumulativeGoals,
}: SeasonDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Goals & Assists per Gameweek */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">
          Goals & Assists per Gameweek
        </h3>
        <ChartContainer config={goalsAssistsConfig} className="h-[250px] w-full">
          <BarChart data={gameweekData} barGap={2}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="gw" tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
            <YAxis tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="goals" fill="var(--color-goals)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="assists" fill="var(--color-assists)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Attendance per Gameweek */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">
          Attendance per Gameweek
        </h3>
        <ChartContainer config={attendanceConfig} className="h-[250px] w-full">
          <LineChart data={gameweekData}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="gw" tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
            <YAxis tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="players"
              stroke="var(--color-players)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-players)" }}
            />
          </LineChart>
        </ChartContainer>
      </div>

      {/* Cumulative Goals */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">
          Cumulative Goals
        </h3>
        <ChartContainer config={cumulativeConfig} className="h-[250px] w-full">
          <AreaChart data={cumulativeGoals}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="gw" tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
            <YAxis tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="goals"
              stroke="var(--color-goals)"
              fill="var(--color-goals)"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Top Scorers */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">
          Top Scorers & Assisters
        </h3>
        <ChartContainer config={topScorersConfig} className="h-[250px] w-full">
          <BarChart data={topScorers} layout="vertical" barGap={2}>
            <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 11 }}
              stroke="rgba(255,255,255,0.3)"
              width={70}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="goals" fill="var(--color-goals)" radius={[0, 3, 3, 0]} />
            <Bar dataKey="assists" fill="var(--color-assists)" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Tier Distribution */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 md:col-span-2">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">
          Card Tier Distribution
        </h3>
        <ChartContainer config={tierConfig} className="h-[250px] w-full">
          <BarChart data={tierData} barSize={40}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="tier" tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
            <YAxis tick={{ fontSize: 11 }} stroke="rgba(255,255,255,0.3)" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
              {tierData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
