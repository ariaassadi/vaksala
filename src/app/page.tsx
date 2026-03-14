import { getPlayers, getGameweeks, getSpecialCards } from "@/lib/data";
import { SeasonDashboard } from "@/components/season-dashboard";

const TIER_DISPLAY: Record<string, { label: string; fill: string }> = {
  bronze: { label: "Bronze", fill: "#8B6914" },
  "bronze-rare": { label: "Bronze Rare", fill: "#B8860B" },
  silver: { label: "Silver", fill: "#8A8A8A" },
  "silver-rare": { label: "Silver Rare", fill: "#B0B0B0" },
  gold: { label: "Gold", fill: "#C5A000" },
  "gold-rare": { label: "Gold Rare", fill: "#FFD700" },
};

export default function Home() {
  const players = getPlayers();
  const gameweeks = getGameweeks();
  const specialCards = getSpecialCards();

  const totalGoals = players.reduce((sum, p) => sum + p.goals, 0);
  const totalAssists = players.reduce((sum, p) => sum + p.assists, 0);

  const quickStats = [
    { label: "Players", value: players.length },
    { label: "Gameweeks", value: gameweeks.length },
    { label: "Total Goals", value: totalGoals },
    { label: "Special Cards", value: specialCards.length },
  ];

  // Goals & assists per gameweek
  const gameweekData = gameweeks.map((gw) => ({
    gw: `GW${gw.number}`,
    goals: gw.players.reduce((s, p) => s + p.goals, 0),
    assists: gw.players.reduce((s, p) => s + p.assists, 0),
    players: gw.players.length,
  }));

  // Cumulative goals
  let cumulative = 0;
  const cumulativeGoals = gameweekData.map((d) => {
    cumulative += d.goals;
    return { gw: d.gw, goals: cumulative };
  });

  // Tier distribution
  const tierCounts = new Map<string, number>();
  players.forEach((p) => tierCounts.set(p.tier, (tierCounts.get(p.tier) || 0) + 1));
  const tierOrder = ["bronze", "bronze-rare", "silver", "silver-rare", "gold", "gold-rare"];
  const tierData = tierOrder
    .filter((t) => tierCounts.has(t))
    .map((t) => ({
      tier: TIER_DISPLAY[t].label,
      count: tierCounts.get(t)!,
      fill: TIER_DISPLAY[t].fill,
    }));

  // Top scorers (by G+A)
  const topScorers = [...players]
    .sort((a, b) => b.goals + b.assists - (a.goals + a.assists))
    .slice(0, 8)
    .map((p) => ({ name: p.name, goals: p.goals, assists: p.assists }));

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Vaksala KR-cupen 25/26
          </span>
        </h1>
        <p className="text-zinc-400 text-xl mt-2">FIFA Cards — Season Stats &amp; Awards</p>
      </section>

      {/* Quick stats bar */}
      <section className="max-w-5xl mx-auto px-4 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map(({ label, value }) => (
            <div
              key={label}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 text-center"
            >
              <p className="text-3xl font-black text-yellow-400">{value}</p>
              <p className="text-zinc-400 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <SeasonDashboard
          gameweekData={gameweekData}
          tierData={tierData}
          topScorers={topScorers}
          cumulativeGoals={cumulativeGoals}
        />
      </section>
    </main>
  );
}
