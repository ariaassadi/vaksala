import { LeaderboardTable } from "@/components/leaderboard-table";
import { getPlayers } from "@/lib/data";

export default function LeaderboardPage() {
  const players = getPlayers();
  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-zinc-100 mb-8">Leaderboard</h1>
      <LeaderboardTable players={players} />
    </main>
  );
}
