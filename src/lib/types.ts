export interface Player {
  name: string;
  slug: string;
  goals: number;
  assists: number;
  wins: number;
  losses: number;
  attendance: number;
  cleanSheets: number;
  points: number;
  ppt: number;
  rating: number;
  isGoalkeeper: boolean;
  tier: CardTier;
  imageUrl: string | null;
}

export type CardTier = "bronze" | "bronze-rare" | "silver" | "silver-rare" | "gold" | "gold-rare";
export type SpecialCardType = "motm" | "totw" | "rb" | "tots" | "hero" | "icon";

export interface CardStats {
  points: number;
  attendance: number;
  goalsOrGA: number;
  wins: number;
  assistsOrCS: number;
  losses: number;
}

export interface SpecialCard {
  player: string;
  playerSlug: string;
  type: SpecialCardType;
  title: string;
  description: string;
  boostedRating: number;
  stats: CardStats;
}

export interface GameweekPlayerStats {
  gameweek: number;
  player: string;
  goals: number;
  assists: number;
  wins: number;
  losses: number;
}

export interface Gameweek {
  number: number;
  players: GameweekPlayerStats[];
}
