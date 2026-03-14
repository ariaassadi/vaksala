import { CardGrid } from "@/components/card-grid";
import { getPlayers } from "@/lib/data";

export default function CardsPage() {
  const players = getPlayers();
  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-zinc-100 mb-8">All Cards</h1>
      <CardGrid players={players} />
    </main>
  );
}
