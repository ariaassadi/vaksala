import playersData from "@/data/players.json";
import gameweeksData from "@/data/gameweeks.json";
import specialCardsData from "@/data/special-cards.json";
import type { Player, Gameweek, SpecialCard } from "./types";

const players = playersData as Player[];
const gameweeks = gameweeksData as Gameweek[];
const specialCards = specialCardsData as SpecialCard[];

export function getPlayers(): Player[] {
  return players;
}

export function getPlayer(slug: string): Player | undefined {
  return players.find((p) => p.slug === slug);
}

export function getGameweeks(): Gameweek[] {
  return gameweeks;
}

export function getPlayerGameweeks(playerName: string): Gameweek[] {
  return gameweeks
    .map((gw) => ({
      ...gw,
      players: gw.players.filter((p) => p.player === playerName),
    }))
    .filter((gw) => gw.players.length > 0);
}

export function getSpecialCards(): SpecialCard[] {
  return specialCards;
}

export function getPlayerSpecialCards(playerName: string): SpecialCard[] {
  return specialCards.filter((card) => card.player === playerName);
}
