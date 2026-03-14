"use client";

import { FifaCard } from "@/components/fifa-card";
import type { SlideType } from "./slide-data";

interface SlideRendererProps {
  slide: SlideType;
}

export function SlideRenderer({ slide }: SlideRendererProps) {
  switch (slide.kind) {
    case "intro":
      return (
        <div className="animate-fade-in flex flex-col items-center justify-center gap-6 text-center">
          <h1 className="text-6xl font-black tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
            Vaksala KR-cupen
          </h1>
          <h2 className="text-3xl font-bold text-zinc-300">25/26 Season</h2>
          <p className="text-zinc-500 text-lg mt-4">Press SPACE or &rarr; to start</p>
        </div>
      );

    case "leaderboard":
      return (
        <div className="animate-fade-in flex flex-col items-center gap-6 w-full max-w-lg">
          <h2 className="text-4xl font-black text-yellow-500 tracking-tight">{slide.category}</h2>
          <ol className="w-full flex flex-col gap-3">
            {slide.top5.map((entry, i) => (
              <li
                key={entry.name}
                className="flex items-center justify-between bg-zinc-900 rounded-xl px-6 py-4"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={
                      i < 3
                        ? "text-2xl font-black text-yellow-400 w-8"
                        : "text-2xl font-black text-zinc-500 w-8"
                    }
                  >
                    {i + 1}
                  </span>
                  <span className="text-xl font-semibold text-zinc-100">{entry.name}</span>
                </div>
                <span className="text-2xl font-black text-zinc-200">{entry.value}</span>
              </li>
            ))}
          </ol>
        </div>
      );

    case "tier-header":
      return (
        <div className="animate-fade-in flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-5xl font-black text-zinc-100 tracking-tight">{slide.label}</h2>
          <p className="text-zinc-400 text-xl">
            {slide.count} player{slide.count !== 1 ? "s" : ""}
          </p>
        </div>
      );

    case "player-card":
      return (
        <div className="animate-card-reveal flex items-center justify-center">
          <FifaCard player={slide.player} size="lg" />
        </div>
      );

    case "special-header":
      return (
        <div className="animate-fade-in flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-5xl font-black text-yellow-500 tracking-tight">{slide.label}</h2>
        </div>
      );

    case "special-card":
      return (
        <div className="animate-card-reveal flex flex-col items-center justify-center gap-6">
          <FifaCard
            player={slide.player}
            specialType={slide.specialCard.type}
            specialRating={slide.specialCard.boostedRating}
            specialStats={slide.specialCard.stats}
            specialTitle={slide.specialCard.title}
            size="lg"
          />
          <p className="text-zinc-300 text-lg text-center max-w-sm">{slide.specialCard.description}</p>
        </div>
      );

    case "mvp":
      return (
        <div className="animate-card-reveal flex flex-col items-center justify-center gap-6">
          <h2 className="text-5xl font-black text-yellow-500 tracking-tight animate-pulse">
            SEASON MVP
          </h2>
          <FifaCard
            player={slide.player}
            specialType={slide.specialCard.type}
            specialRating={slide.specialCard.boostedRating}
            specialStats={slide.specialCard.stats}
            specialTitle={slide.specialCard.title}
            size="lg"
          />
          <p className="text-zinc-300 text-lg text-center max-w-sm">{slide.specialCard.description}</p>
        </div>
      );

    default:
      return null;
  }
}
