import type { CardTier, SpecialCardType, CardStats, Player } from "./types";

export function getTier(rating: number): CardTier {
  if (rating >= 80) return "gold-rare";
  if (rating >= 75) return "gold";
  if (rating >= 70) return "silver-rare";
  if (rating >= 65) return "silver";
  if (rating >= 60) return "bronze-rare";
  return "bronze";
}

export function isGoalkeeper(cleanSheets: number, goals: number): boolean {
  return cleanSheets > 0 && goals <= 5;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/ö/g, "o")
    .replace(/ä/g, "a")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCardStats(player: Player): CardStats {
  return {
    points: player.points,
    attendance: player.attendance,
    goalsOrGA: player.isGoalkeeper ? player.goals + player.assists : player.goals,
    wins: player.wins,
    assistsOrCS: player.isGoalkeeper ? player.cleanSheets : player.assists,
    losses: player.losses,
  };
}

export function getStatLabels(isGK: boolean): string[] {
  if (isGK) {
    return ["POÄ", "NÄR", "G+A", "VIN", "NOL", "FÖR"];
  }
  return ["POÄ", "NÄR", "MÅL", "VIN", "ASS", "FÖR"];
}

export const TIER_COLORS: Record<
  CardTier,
  { bg: string; text: string; accent: string; silhouette: string }
> = {
  bronze: {
    bg: "from-amber-900/80 to-amber-800/60",
    text: "text-amber-950",
    accent: "shadow-amber-700/30",
    silhouette: "#3D2B0F",
  },
  "bronze-rare": {
    bg: "from-amber-700/80 to-amber-600/60",
    text: "text-amber-950",
    accent: "shadow-amber-500/40",
    silhouette: "#4A3520",
  },
  silver: {
    bg: "from-gray-400/80 to-gray-300/60",
    text: "text-gray-800",
    accent: "shadow-gray-400/30",
    silhouette: "#2A2A2A",
  },
  "silver-rare": {
    bg: "from-gray-300/80 to-gray-200/60",
    text: "text-gray-800",
    accent: "shadow-gray-300/40",
    silhouette: "#333333",
  },
  gold: {
    bg: "from-yellow-600/80 to-yellow-500/60",
    text: "text-yellow-950",
    accent: "shadow-yellow-500/30",
    silhouette: "#4A3A10",
  },
  "gold-rare": {
    bg: "from-yellow-500/80 to-yellow-400/60",
    text: "text-yellow-950",
    accent: "shadow-yellow-400/40",
    silhouette: "#5A4A10",
  },
};

export const SPECIAL_COLORS: Record<
  SpecialCardType,
  { bg: string; text: string; accent: string }
> = {
  motm: {
    bg: "from-orange-600/90 to-orange-500/70",
    text: "text-white",
    accent: "shadow-orange-500/50",
  },
  totw: {
    bg: "from-slate-900/90 to-slate-800/70",
    text: "text-white",
    accent: "shadow-blue-900/50",
  },
  rb: {
    bg: "from-teal-700/90 to-teal-600/70",
    text: "text-white",
    accent: "shadow-teal-500/50",
  },
  tots: {
    bg: "from-blue-800/90 to-blue-700/70",
    text: "text-white",
    accent: "shadow-blue-500/50",
  },
  hero: {
    bg: "from-purple-700/90 to-purple-600/70",
    text: "text-white",
    accent: "shadow-purple-500/50",
  },
  icon: {
    bg: "from-yellow-200/90 to-yellow-100/70",
    text: "text-yellow-900",
    accent: "shadow-yellow-300/50",
  },
};
