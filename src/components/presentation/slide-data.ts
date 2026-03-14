import type { Player, SpecialCard, CardTier, SpecialCardType } from "@/lib/types";

// ---------------------------------------------------------------------------
// Slide type definitions (discriminated union)
// ---------------------------------------------------------------------------

export interface IntroSlide {
  kind: "intro";
}

export interface LeaderboardSlide {
  kind: "leaderboard";
  category: string;
  top5: { name: string; value: number | string }[];
}

export interface TierHeaderSlide {
  kind: "tier-header";
  tier: CardTier;
  label: string;
  count: number;
}

export interface PlayerCardSlide {
  kind: "player-card";
  player: Player;
}

export interface SpecialHeaderSlide {
  kind: "special-header";
  type: SpecialCardType;
  label: string;
}

export interface SpecialCardSlide {
  kind: "special-card";
  player: Player;
  specialCard: SpecialCard;
}

export interface MvpSlide {
  kind: "mvp";
  player: Player;
  specialCard: SpecialCard;
}

export type SlideType =
  | IntroSlide
  | LeaderboardSlide
  | TierHeaderSlide
  | PlayerCardSlide
  | SpecialHeaderSlide
  | SpecialCardSlide
  | MvpSlide;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TIER_ORDER: CardTier[] = [
  "bronze",
  "bronze-rare",
  "silver",
  "silver-rare",
  "gold",
  "gold-rare",
];

const TIER_LABELS: Record<CardTier, string> = {
  bronze: "Bronze",
  "bronze-rare": "Bronze Rare",
  silver: "Silver",
  "silver-rare": "Silver Rare",
  gold: "Gold",
  "gold-rare": "Gold Rare",
};

// Reveal order for special cards (ICON last as MVP)
const SPECIAL_ORDER: SpecialCardType[] = ["motm", "totw", "rb", "hero", "tots", "icon"];

const SPECIAL_LABELS: Record<SpecialCardType, string> = {
  motm: "Man of the Match",
  totw: "Team of the Week",
  rb: "Record Breaker",
  hero: "Hero",
  tots: "Team of the Season",
  icon: "Season Icon",
};

// ---------------------------------------------------------------------------
// Leaderboard categories
// ---------------------------------------------------------------------------

interface LeaderboardCategory {
  category: string;
  getValue: (p: Player) => number;
  formatValue: (v: number) => number | string;
}

const LEADERBOARD_CATEGORIES: LeaderboardCategory[] = [
  {
    category: "Top Scorers",
    getValue: (p) => p.goals,
    formatValue: (v) => v,
  },
  {
    category: "Top Assisters",
    getValue: (p) => p.assists,
    formatValue: (v) => v,
  },
  {
    category: "Most Wins",
    getValue: (p) => p.wins,
    formatValue: (v) => v,
  },
  {
    category: "Highest PPT",
    getValue: (p) => p.ppt,
    formatValue: (v) => v,
  },
  {
    category: "Most Points",
    getValue: (p) => p.points,
    formatValue: (v) => v,
  },
];

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

export function generateSlides(players: Player[], specialCards: SpecialCard[]): SlideType[] {
  const slides: SlideType[] = [];

  // 1. Intro
  slides.push({ kind: "intro" });

  // 2. Leaderboard reveals
  for (const cat of LEADERBOARD_CATEGORIES) {
    const sorted = [...players]
      .sort((a, b) => cat.getValue(b) - cat.getValue(a))
      .slice(0, 5);

    slides.push({
      kind: "leaderboard",
      category: cat.category,
      top5: sorted.map((p) => ({
        name: p.name,
        value: cat.formatValue(cat.getValue(p)),
      })),
    });
  }

  // 3. Card reveals by tier (bronze → gold-rare, ascending rating within tier)
  for (const tier of TIER_ORDER) {
    const tieredPlayers = players
      .filter((p) => p.tier === tier)
      .sort((a, b) => a.rating - b.rating);

    if (tieredPlayers.length === 0) continue;

    slides.push({
      kind: "tier-header",
      tier,
      label: TIER_LABELS[tier],
      count: tieredPlayers.length,
    });

    for (const player of tieredPlayers) {
      slides.push({ kind: "player-card", player });
    }
  }

  // 4. Special card reveals (ICON last as mvp)
  for (const type of SPECIAL_ORDER) {
    const cards = specialCards.filter((sc) => sc.type === type);
    if (cards.length === 0) continue;

    slides.push({
      kind: "special-header",
      type,
      label: SPECIAL_LABELS[type],
    });

    for (const sc of cards) {
      const player = players.find((p) => p.slug === sc.playerSlug);
      if (!player) continue;

      if (type === "icon") {
        slides.push({ kind: "mvp", player, specialCard: sc });
      } else {
        slides.push({ kind: "special-card", player, specialCard: sc });
      }
    }
  }

  return slides;
}
