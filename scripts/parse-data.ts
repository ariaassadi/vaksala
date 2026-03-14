import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

// ─── Types ───────────────────────────────────────────────────────────────────

type CardTier =
  | "bronze"
  | "bronze-rare"
  | "silver"
  | "silver-rare"
  | "gold"
  | "gold-rare";
type SpecialCardType = "motm" | "totw" | "rb" | "tots" | "hero" | "icon";

interface Player {
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

interface CardStats {
  points: number;
  attendance: number;
  goalsOrGA: number;
  wins: number;
  assistsOrCS: number;
  losses: number;
}

interface SpecialCard {
  player: string;
  playerSlug: string;
  type: SpecialCardType;
  title: string;
  description: string;
  boostedRating: number;
  stats: CardStats;
}

interface GameweekPlayerStats {
  gameweek: number;
  player: string;
  goals: number;
  assists: number;
  wins: number;
  losses: number;
}

interface Gameweek {
  number: number;
  players: GameweekPlayerStats[];
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/ö/g, "o")
    .replace(/ä/g, "a")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTier(rating: number): CardTier {
  if (rating >= 80) return "gold-rare";
  if (rating >= 75) return "gold";
  if (rating >= 70) return "silver-rare";
  if (rating >= 65) return "silver";
  if (rating >= 60) return "bronze-rare";
  return "bronze";
}

function isGK(cleanSheets: number, goals: number): boolean {
  return cleanSheets > 0 && goals <= 5;
}

// ─── Load Workbook ────────────────────────────────────────────────────────────

const xlsxPath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
  "data",
  "Vaksala KR-cupen 25_26.xlsx"
);
const wb = XLSX.readFile(xlsxPath);

// ─── Parse Poängligan ────────────────────────────────────────────────────────

function parsePlayers(imageDir: string): Player[] {
  const ws = wb.Sheets["Poängligan"];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });

  const players: Player[] = [];
  // Row 0 is header, data starts at row 1
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] as unknown[];
    const name = row[0];
    if (!name || String(name).trim() === "") break;

    const playerName = String(name).trim();
    const goals = Number(row[1]) || 0;
    const assists = Number(row[2]) || 0;
    const wins = Number(row[3]) || 0;
    const losses = Number(row[4]) || 0;
    const attendance = Number(row[5]) || 0;
    const cleanSheets = Number(row[6]) || 0;
    const points = Number(row[7]) || 0;
    // col 8 is the bar (skip)
    const ppt = Number(row[9]) || 0;
    const rating = Number(row[10]) || 0;

    const slug = slugify(playerName);
    const goalkeeper = isGK(cleanSheets, goals);
    const tier = getTier(rating);

    // Check for image
    const imagePath = path.join(imageDir, `${playerName}.png`);
    const imageUrl = fs.existsSync(imagePath)
      ? `/players/${playerName}.png`
      : null;

    players.push({
      name: playerName,
      slug,
      goals,
      assists,
      wins,
      losses,
      attendance,
      cleanSheets,
      points,
      ppt,
      rating,
      isGoalkeeper: goalkeeper,
      tier,
      imageUrl,
    });
  }

  return players;
}

// ─── Parse Matcher ────────────────────────────────────────────────────────────

function parseGameweeks(): Gameweek[] {
  const ws = wb.Sheets["Matcher"];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });

  const gameweeks: Gameweek[] = [];
  let currentGW: Gameweek | null = null;
  let currentGWEnd = 0;

  for (let i = 3; i < rows.length; i++) {
    const row = rows[i] as unknown[];
    const cellA = row[0];

    if (cellA && String(cellA).startsWith("Gameweek")) {
      // Save previous GW
      if (currentGW) {
        gameweeks.push(currentGW);
      }
      const gwNum = parseInt(String(cellA).replace("Gameweek ", ""), 10);
      currentGW = { number: gwNum, players: [] };
      // Each GW block is 20 rows (header + 19 data rows)
      currentGWEnd = i + 19;
      continue;
    }

    if (!currentGW) continue;
    if (i > currentGWEnd) continue;

    const playerMap = new Map<string, GameweekPlayerStats>();

    // Helper to add a player's stats
    const addPlayer = (
      nameRaw: unknown,
      goalsRaw: unknown,
      assistsRaw: unknown,
      winsRaw: unknown,
      lossesRaw: unknown,
      gwNum: number
    ) => {
      if (!nameRaw || String(nameRaw).trim() === "") return;
      const name = String(nameRaw).trim();
      const goals = Number(goalsRaw) || 0;
      const assists = Number(assistsRaw) || 0;
      const wins = Number(winsRaw) || 0;
      const losses = Number(lossesRaw) || 0;

      if (playerMap.has(name)) {
        // Accumulate if same player appears multiple times in same GW
        const existing = playerMap.get(name)!;
        existing.goals += goals;
        existing.assists += assists;
        // wins and losses are totals per team block - take the max to avoid double counting
        // Actually wins/losses are repeated for each player row in the team - use the value
        // from the first occurrence only
      } else {
        playerMap.set(name, { gameweek: gwNum, player: name, goals, assists, wins, losses });
      }
    };

    // Blå: cols 7(name), 8(goals), 9(assists), 10(wins), 11(losses)
    addPlayer(row[7], row[8], row[9], row[10], row[11], currentGW.number);
    // Rosa: cols 12(name), 13(goals), 14(assists), 15(wins), 16(losses)
    addPlayer(row[12], row[13], row[14], row[15], row[16], currentGW.number);
    // Grön: cols 17(name), 18(goals), 19(assists), 20(wins), 21(losses)
    addPlayer(row[17], row[18], row[19], row[20], row[21], currentGW.number);
    // Brun: cols 22(name), 23(goals), 24(assists), 25(wins), 26(losses)
    addPlayer(row[22], row[23], row[24], row[25], row[26], currentGW.number);

    // Merge into currentGW players (avoid duplicate entries per row)
    for (const [name, stats] of playerMap) {
      const existing = currentGW.players.find((p) => p.player === name);
      if (existing) {
        existing.goals += stats.goals;
        existing.assists += stats.assists;
        // wins/losses: keep the value from first occurrence (they are repeated per player row)
      } else {
        currentGW.players.push(stats);
      }
    }
  }

  // Push last GW
  if (currentGW) {
    gameweeks.push(currentGW);
  }

  return gameweeks;
}

// ─── Special Card Helpers ─────────────────────────────────────────────────────

function getGWStats(
  gameweeks: Gameweek[],
  playerName: string,
  gwNum: number
): GameweekPlayerStats | null {
  const gw = gameweeks.find((g) => g.number === gwNum);
  if (!gw) return null;
  return gw.players.find((p) => p.player === playerName) ?? null;
}

function aggregateGWStats(
  gameweeks: Gameweek[],
  playerName: string,
  startGW: number,
  endGW: number
): GameweekPlayerStats {
  let goals = 0;
  let assists = 0;
  let wins = 0;
  let losses = 0;

  for (let gw = startGW; gw <= endGW; gw++) {
    const stats = getGWStats(gameweeks, playerName, gw);
    if (stats) {
      goals += stats.goals;
      assists += stats.assists;
      wins += stats.wins;
      losses += stats.losses;
    }
  }

  return { gameweek: startGW, player: playerName, goals, assists, wins, losses };
}

function buildCardStats(
  player: Player,
  gwStats: GameweekPlayerStats | null,
  mode: "season" | "motm" | "totw" = "season",
  numGWs: number = 1
): CardStats {
  if (!gwStats) {
    return {
      points: player.points,
      attendance: player.attendance,
      goalsOrGA: player.isGoalkeeper ? player.goals + player.assists : player.goals,
      wins: player.wins,
      assistsOrCS: player.isGoalkeeper ? player.cleanSheets : player.assists,
      losses: player.losses,
    };
  }

  if (mode === "motm") {
    return {
      points: gwStats.goals + gwStats.assists,
      attendance: 1,
      goalsOrGA: player.isGoalkeeper
        ? gwStats.goals + gwStats.assists
        : gwStats.goals,
      wins: gwStats.wins,
      assistsOrCS: player.isGoalkeeper ? player.cleanSheets : gwStats.assists,
      losses: gwStats.losses,
    };
  }

  if (mode === "totw") {
    return {
      points: gwStats.goals + gwStats.assists,
      attendance: numGWs,
      goalsOrGA: player.isGoalkeeper
        ? gwStats.goals + gwStats.assists
        : gwStats.goals,
      wins: gwStats.wins,
      assistsOrCS: player.isGoalkeeper ? player.cleanSheets : gwStats.assists,
      losses: gwStats.losses,
    };
  }

  return {
    points: player.points,
    attendance: player.attendance,
    goalsOrGA: player.isGoalkeeper
      ? gwStats.goals + gwStats.assists
      : gwStats.goals,
    wins: gwStats.wins,
    assistsOrCS: player.isGoalkeeper ? player.cleanSheets : gwStats.assists,
    losses: gwStats.losses,
  };
}

// ─── Generate Special Cards ───────────────────────────────────────────────────

function generateSpecialCards(
  players: Player[],
  gameweeks: Gameweek[]
): SpecialCard[] {
  const cards: SpecialCard[] = [];
  const playerMap = new Map(players.map((p) => [p.name, p]));

  // MOTM cards
  const motmPicks: Array<{ name: string; gw: number; description: string }> = [
    { name: "Daniel K", gw: 16, description: "Man of the Match - GW16 (8G 7A)" },
    { name: "Daniel Ö", gw: 16, description: "Man of the Match - GW16 (9 goals)" },
    { name: "Milos G", gw: 15, description: "Man of the Match - GW15 (6G 6A)" },
    { name: "Jakob S", gw: 3, description: "Man of the Match - GW3 (7G 2A)" },
    { name: "Joel C", gw: 16, description: "Man of the Match - GW16 (8 assists)" },
    { name: "Dennis F", gw: 18, description: "Man of the Match - GW18 (5G 4A)" },
  ];

  for (const pick of motmPicks) {
    const player = playerMap.get(pick.name);
    if (!player) continue;
    const gwStats = getGWStats(gameweeks, pick.name, pick.gw);
    cards.push({
      player: player.name,
      playerSlug: player.slug,
      type: "motm",
      title: "MOTM",
      description: pick.description,
      boostedRating: Math.min(99, player.rating + 2),
      stats: buildCardStats(player, gwStats, "motm"),
    });
  }

  // TOTW cards
  const totwPicks: Array<{
    name: string;
    startGW: number;
    endGW: number;
    description: string;
  }> = [
    {
      name: "Daniel Ö",
      startGW: 15,
      endGW: 17,
      description: "Team of the Week - GW15-17 (18G 7A)",
    },
    {
      name: "Jakob S",
      startGW: 3,
      endGW: 5,
      description: "Team of the Week - GW3-5 (16G 6A)",
    },
    {
      name: "Branislav D",
      startGW: 2,
      endGW: 4,
      description: "Team of the Week - GW2-4 (18W 2L)",
    },
    {
      name: "Ivan N",
      startGW: 6,
      endGW: 8,
      description: "Team of the Week - GW6-8 (8G 9A)",
    },
    {
      name: "Daniel K",
      startGW: 15,
      endGW: 17,
      description: "Team of the Week - GW15-17 (10G 7A)",
    },
  ];

  for (const pick of totwPicks) {
    const player = playerMap.get(pick.name);
    if (!player) continue;
    const aggStats = aggregateGWStats(
      gameweeks,
      pick.name,
      pick.startGW,
      pick.endGW
    );
    cards.push({
      player: player.name,
      playerSlug: player.slug,
      type: "totw",
      title: "TOTW",
      description: pick.description,
      boostedRating: Math.min(99, player.rating + 3),
      stats: buildCardStats(player, aggStats, "totw", pick.endGW - pick.startGW + 1),
    });
  }

  // Record Breaker cards
  const rbPicks: Array<{ name: string; description: string }> = [
    { name: "Jakob S", description: "Record Breaker - Most G+A in season (73)" },
    { name: "Daniel K", description: "Record Breaker - Best single GW (15 G+A in GW16)" },
    { name: "Daniel Ö", description: "Record Breaker - Most goals in a single GW (9 in GW16)" },
    { name: "Samuel P", description: "Record Breaker - Season assist leader (29)" },
    { name: "Emil B", description: "Record Breaker - Most GWs played as GK (14)" },
    { name: "Oliver G", description: "Record Breaker - Most GWs attended (17)" },
  ];
  for (const pick of rbPicks) {
    const player = playerMap.get(pick.name);
    if (!player) continue;
    cards.push({
      player: player.name,
      playerSlug: player.slug,
      type: "rb",
      title: "Record Breaker",
      description: pick.description,
      boostedRating: Math.min(99, player.rating + 6),
      stats: buildCardStats(player, null),
    });
  }

  // TOTS cards (rating + 7, capped at 97)
  const totsPicks = [
    "Jakob S", "Ivan N", "Daniel Ö", "Dennis F", "Oliver G", "Emil B",
    "Daniel K", "Samuel P", "Milos G",
  ];
  for (const name of totsPicks) {
    const player = playerMap.get(name);
    if (!player) continue;
    cards.push({
      player: player.name,
      playerSlug: player.slug,
      type: "tots",
      title: "TOTS",
      description: `Team of the Season - ${player.name}`,
      boostedRating: Math.min(97, player.rating + 4),
      stats: buildCardStats(player, null),
    });
  }

  // HERO cards
  const heroPicks: Array<{ name: string; description: string }> = [
    { name: "Emil B", description: "Club Hero - Emil B (GK wall, 14 GWs)" },
    { name: "Milos G", description: "Club Hero - Milos G (PPT king: 15.0)" },
    { name: "Samuel P", description: "Club Hero - Samuel P (29 assists)" },
  ];
  for (const pick of heroPicks) {
    const player = playerMap.get(pick.name);
    if (!player) continue;
    cards.push({
      player: player.name,
      playerSlug: player.slug,
      type: "hero",
      title: "Hero",
      description: pick.description,
      boostedRating: Math.min(99, player.rating + 5),
      stats: buildCardStats(player, null),
    });
  }

  // ICON card
  const iconPlayer = playerMap.get("Jakob S");
  if (iconPlayer) {
    cards.push({
      player: iconPlayer.name,
      playerSlug: iconPlayer.slug,
      type: "icon",
      title: "Icon",
      description: "Club Icon - Jakob S (94 rated, 73 G+A)",
      boostedRating: Math.min(99, iconPlayer.rating + 5),
      stats: buildCardStats(iconPlayer, null),
    });
  }

  return cards;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const imageDir = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
  "public",
  "players"
);
const outDir = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
  "src",
  "data"
);

fs.mkdirSync(outDir, { recursive: true });

const players = parsePlayers(imageDir);
const gameweeks = parseGameweeks();
const specialCards = generateSpecialCards(players, gameweeks);

// Write outputs
fs.writeFileSync(
  path.join(outDir, "players.json"),
  JSON.stringify(players, null, 2)
);
fs.writeFileSync(
  path.join(outDir, "gameweeks.json"),
  JSON.stringify(gameweeks, null, 2)
);
fs.writeFileSync(
  path.join(outDir, "special-cards.json"),
  JSON.stringify(specialCards, null, 2)
);

// Verification output
console.log(`Players parsed: ${players.length}`);
console.log(`Gameweeks parsed: ${gameweeks.length}`);
console.log(`Special cards: ${specialCards.length}`);

const jakob = players.find((p) => p.name === "Jakob S");
if (jakob) {
  console.log(
    `Jakob S: rating=${jakob.rating}, tier=${jakob.tier}, isGoalkeeper=${jakob.isGoalkeeper}`
  );
}

const emilB = players.find((p) => p.name === "Emil B");
if (emilB) {
  console.log(
    `Emil B: isGoalkeeper=${emilB.isGoalkeeper}, cleanSheets=${emilB.cleanSheets}`
  );
}

console.log("Data written to src/data/");
