import Link from "next/link";
import { FifaCard } from "@/components/fifa-card";
import { DownloadableCard } from "@/components/downloadable-card";
import { getSpecialCards, getPlayer } from "@/lib/data";
import type { SpecialCardType } from "@/lib/types";

const TYPE_ORDER: SpecialCardType[] = ["icon", "hero", "tots", "rb", "totw", "motm"];

const TYPE_LABELS: Record<SpecialCardType, string> = {
  icon: "ICON",
  hero: "HERO",
  tots: "Team of the Season",
  rb: "Record Breaker",
  totw: "Team of the Week",
  motm: "Man of the Match",
};

export default function SpecialPage() {
  const specialCards = getSpecialCards();

  const byType = TYPE_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type],
    cards: specialCards.filter((sc) => sc.type === type),
  })).filter((section) => section.cards.length > 0);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-zinc-100 mb-10">Special Cards</h1>

      <div className="space-y-14">
        {byType.map(({ type, label, cards }) => (
          <section key={type}>
            <h2 className="text-xl font-bold text-zinc-100 mb-6 border-b border-zinc-800 pb-2">
              {label}
            </h2>
            <div className="flex flex-wrap gap-6">
              {cards.map((sc, i) => {
                const player = getPlayer(sc.playerSlug);
                if (!player) return null;
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <DownloadableCard fileName={`${sc.playerSlug}-${sc.type}`}>
                      <Link
                        href={`/cards/${sc.playerSlug}`}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        <FifaCard
                          player={player}
                          specialType={sc.type}
                          specialRating={sc.boostedRating}
                          specialStats={sc.stats}
                          specialTitle={sc.title}
                          size="md"
                        />
                      </Link>
                    </DownloadableCard>
                    <p className="text-zinc-400 text-xs text-center max-w-[240px]">
                      {sc.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
