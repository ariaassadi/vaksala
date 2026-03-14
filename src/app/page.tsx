import Link from "next/link";
import { FifaCard } from "@/components/fifa-card";
import { getPlayers, getGameweeks, getSpecialCards } from "@/lib/data";

export default function Home() {
  const players = getPlayers();
  const gameweeks = getGameweeks();
  const specialCards = getSpecialCards();

  const totalGoals = players.reduce((sum, p) => sum + p.goals, 0);
  const topFive = [...players].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const quickStats = [
    { label: "Players", value: players.length },
    { label: "Gameweeks", value: gameweeks.length },
    { label: "Total Goals", value: totalGoals },
    { label: "Special Cards", value: specialCards.length },
  ];

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
      <section className="max-w-4xl mx-auto px-4 mb-16">
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

      {/* Top Rated */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold mb-8 text-zinc-100">Top Rated</h2>
        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
          {topFive.map((player) => (
            <Link
              key={player.slug}
              href={`/cards/${player.slug}`}
              className="hover:scale-105 transition-transform duration-200"
            >
              <FifaCard player={player} size="md" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
