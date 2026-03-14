"use client";

import { useState } from "react";
import Link from "next/link";
import { FifaCard } from "@/components/fifa-card";
import { Input } from "@/components/ui/input";
import type { Player, CardTier } from "@/lib/types";

interface CardGridProps {
  players: Player[];
}

const TIER_OPTIONS: { value: CardTier | "all"; label: string }[] = [
  { value: "all", label: "All Tiers" },
  { value: "gold-rare", label: "Gold Rare" },
  { value: "gold", label: "Gold" },
  { value: "silver-rare", label: "Silver Rare" },
  { value: "silver", label: "Silver" },
  { value: "bronze-rare", label: "Bronze Rare" },
  { value: "bronze", label: "Bronze" },
];

type SortKey = "rating" | "goals" | "assists" | "points" | "name";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "rating", label: "Rating" },
  { value: "goals", label: "Goals" },
  { value: "assists", label: "Assists" },
  { value: "points", label: "Points" },
  { value: "name", label: "Name" },
];

export function CardGrid({ players }: CardGridProps) {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState<CardTier | "all">("all");
  const [sort, setSort] = useState<SortKey>("rating");

  const filtered = players
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesTier = tier === "all" || p.tier === tier;
      return matchesSearch && matchesTier;
    })
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "goals") return b.goals - a.goals;
      if (sort === "assists") return b.assists - a.assists;
      if (sort === "points") return b.points - a.points;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 sm:max-w-xs"
        />
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as CardTier | "all")}
          className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-yellow-500"
        >
          {TIER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-yellow-500"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-zinc-400 text-sm">{filtered.length} players</p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
        {filtered.map((player) => (
          <Link
            key={player.slug}
            href={`/cards/${player.slug}`}
            className="hover:scale-105 transition-transform duration-200"
          >
            <FifaCard player={player} size="sm" />
          </Link>
        ))}
      </div>
    </div>
  );
}
