import { notFound } from "next/navigation";
import Link from "next/link";
import { FifaCard } from "@/components/fifa-card";
import { getPlayer, getPlayerGameweeks, getPlayerSpecialCards } from "@/lib/data";
import { getPlayers } from "@/lib/data";
import type { Player } from "@/lib/types";

export function generateStaticParams() {
  const players = getPlayers();
  return players.map((p) => ({ player: p.slug }));
}

interface StatCardProps {
  label: string;
  value: string | number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-black text-zinc-100">{value}</p>
    </div>
  );
}

function tierLabel(tier: Player["tier"]): string {
  const map: Record<Player["tier"], string> = {
    "gold-rare": "Gold Rare",
    gold: "Gold",
    "silver-rare": "Silver Rare",
    silver: "Silver",
    "bronze-rare": "Bronze Rare",
    bronze: "Bronze",
  };
  return map[tier];
}

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ player: string }>;
}) {
  const { player: slug } = await params;
  const player = getPlayer(slug);
  if (!player) notFound();

  const gwStats = getPlayerGameweeks(player.name);
  const specialCards = getPlayerSpecialCards(player.name);

  const maxGA = gwStats.reduce((max, gw) => {
    const ga = (gw.players[0]?.goals ?? 0) + (gw.players[0]?.assists ?? 0);
    return Math.max(max, ga);
  }, 1);

  const stats: { label: string; value: string | number }[] = [
    { label: "Rating", value: player.rating },
    { label: "Tier", value: tierLabel(player.tier) },
    { label: "Goals", value: player.goals },
    { label: "Assists", value: player.assists },
    { label: "Wins", value: player.wins },
    { label: "Losses", value: player.losses },
    { label: "Points", value: player.points },
    { label: "PPT", value: player.ppt },
    { label: "Attendance", value: player.attendance },
    ...(player.isGoalkeeper ? [{ label: "Clean Sheets", value: player.cleanSheets }] : []),
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <Link
        href="/cards"
        className="text-zinc-400 hover:text-white text-sm mb-8 inline-block transition-colors"
      >
        &larr; Back to Cards
      </Link>

      {/* Main layout */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: FIFA Card */}
        <div className="flex-shrink-0 flex justify-center">
          <FifaCard player={player} size="lg" />
        </div>

        {/* Right: Stats */}
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-black text-zinc-100 mb-6">{player.name}</h1>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            {stats.map(({ label, value }) => (
              <StatCard key={label} label={label} value={value} />
            ))}
          </div>

          {/* Per-GW bar chart */}
          {gwStats.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-zinc-100 mb-4">Goals + Assists per Gameweek</h2>
              <div className="flex items-end gap-1 h-32 bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                {gwStats.map((gw) => {
                  const ps = gw.players[0];
                  const ga = (ps?.goals ?? 0) + (ps?.assists ?? 0);
                  const heightPct = maxGA > 0 ? (ga / maxGA) * 100 : 0;
                  return (
                    <div
                      key={gw.number}
                      className="flex flex-col items-center justify-end flex-1 min-w-0"
                    >
                      <span className="text-[10px] text-zinc-400 mb-0.5">{ga > 0 ? ga : ""}</span>
                      <div
                        className="w-full bg-yellow-500 rounded-t"
                        style={{ height: `${heightPct}%`, minHeight: ga > 0 ? "4px" : "2px" }}
                      />
                      <span className="text-[9px] text-zinc-500 mt-0.5">{gw.number}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Special cards section */}
      {specialCards.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">Special Cards</h2>
          <div className="flex flex-wrap gap-6">
            {specialCards.map((sc, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <FifaCard
                  player={player}
                  specialType={sc.type}
                  specialRating={sc.boostedRating}
                  specialStats={sc.stats}
                  specialTitle={sc.title}
                  size="md"
                />
                <p className="text-zinc-400 text-xs text-center max-w-[240px]">{sc.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
