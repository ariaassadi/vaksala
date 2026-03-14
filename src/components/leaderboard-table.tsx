"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Player } from "@/lib/types";

type SortKey = "rating" | "points" | "goals" | "assists" | "wins" | "ppt" | "cleanSheets";

const CATEGORIES: { key: SortKey; label: string }[] = [
  { key: "rating", label: "Rating" },
  { key: "points", label: "Points" },
  { key: "goals", label: "Goals" },
  { key: "assists", label: "Assists" },
  { key: "wins", label: "Wins" },
  { key: "ppt", label: "PPT" },
  { key: "cleanSheets", label: "Clean Sheets" },
];

interface LeaderboardTableProps {
  players: Player[];
}

export function LeaderboardTable({ players }: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("rating");

  const sorted = [...players].sort((a, b) => b[sortKey] - a[sortKey]);

  return (
    <div className="space-y-4">
      {/* Category buttons */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSortKey(key)}
            className={cn(
              "px-4 py-1.5 rounded text-sm font-medium transition-colors",
              sortKey === key
                ? "bg-yellow-500 text-black"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase text-xs tracking-wider">
              <th className="px-4 py-3 text-left w-10">#</th>
              <th className="px-4 py-3 text-left">Player</th>
              {CATEGORIES.map(({ key, label }) => (
                <th
                  key={key}
                  className={cn(
                    "px-4 py-3 text-right",
                    sortKey === key ? "text-yellow-400" : ""
                  )}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((player, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              return (
                <tr
                  key={player.slug}
                  className={cn(
                    "border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors",
                    isTop3 ? "font-bold" : "font-normal"
                  )}
                >
                  <td className={cn("px-4 py-3", isTop3 ? "text-yellow-400" : "text-zinc-500")}>
                    {rank}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/cards/${player.slug}`}
                      className="text-zinc-100 hover:text-yellow-400 transition-colors"
                    >
                      {player.name}
                    </Link>
                  </td>
                  {CATEGORIES.map(({ key, label }) => (
                    <td
                      key={key}
                      className={cn(
                        "px-4 py-3 text-right tabular-nums",
                        sortKey === key ? "text-yellow-400" : "text-zinc-300"
                      )}
                    >
                      {player[key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
