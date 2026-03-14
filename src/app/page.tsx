import { FifaCard } from "@/components/fifa-card";
import { getPlayers } from "@/lib/data";

export default function Home() {
  const players = getPlayers();
  const jakob = players.find(p => p.name === "Jakob S")!;
  const albert = players.find(p => p.name === "Albert A")!;
  const emil = players.find(p => p.name === "Emil B")!;
  return (
    <main className="min-h-screen bg-zinc-950 p-8 flex gap-6 flex-wrap">
      <FifaCard player={jakob} size="lg" />
      <FifaCard player={albert} size="lg" />
      <FifaCard player={emil} size="lg" />
    </main>
  );
}
