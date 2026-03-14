import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Player, CardStats, SpecialCardType } from "@/lib/types";
import { TIER_COLORS, SPECIAL_COLORS, getCardStats } from "@/lib/card-utils";
import { CardBackground } from "@/components/card-background";
import { StatsGrid } from "@/components/stats-grid";

type CardSize = "sm" | "md" | "lg";

interface SizeConfig {
  card: string;
  rating: string;
  badge: string;
  flag: string;
  name: string;
  silhouette: string;
  statValue: string;
  statLabel: string;
  footerText: string;
  gap: string;
}

const SIZE_MAP: Record<CardSize, SizeConfig> = {
  sm: {
    card: "w-[160px] h-[230px]",
    rating: "text-[26px]",
    badge: "w-[28px] h-[30px]",
    flag: "w-[24px] h-[15px]",
    name: "text-[12px] py-[3px]",
    silhouette: "w-[70px] h-[80px]",
    statValue: "text-[15px]",
    statLabel: "text-[9px]",
    footerText: "text-[9px] pb-5",
    gap: "gap-[2px]",
  },
  md: {
    card: "w-[200px] h-[290px]",
    rating: "text-[34px]",
    badge: "w-[34px] h-[37px]",
    flag: "w-[30px] h-[19px]",
    name: "text-[14px] py-[3px]",
    silhouette: "w-[90px] h-[102px]",
    statValue: "text-[18px]",
    statLabel: "text-[10px]",
    footerText: "text-[10px] pb-6",
    gap: "gap-[3px]",
  },
  lg: {
    card: "w-[300px] h-[430px]",
    rating: "text-[50px]",
    badge: "w-[46px] h-[50px]",
    flag: "w-[42px] h-[26px]",
    name: "text-[20px] py-1",
    silhouette: "w-[130px] h-[148px]",
    statValue: "text-[26px]",
    statLabel: "text-[14px]",
    footerText: "text-[14px] pb-8",
    gap: "gap-1",
  },
};

// Face silhouette colors per tier/special type
const FACE_COLORS: Record<string, string> = {
  bronze: "#4A2A14",
  "bronze-rare": "#5C3820",
  silver: "#3A3A3A",
  "silver-rare": "#444444",
  gold: "#5A4510",
  "gold-rare": "#6B5518",
  motm: "rgba(255,255,255,0.2)",
  totw: "rgba(255,255,255,0.2)",
  rb: "rgba(255,255,255,0.2)",
  tots: "rgba(255,255,255,0.2)",
  hero: "rgba(255,255,255,0.2)",
  icon: "#6B5215",
};

interface FifaCardProps {
  player: Player;
  specialType?: SpecialCardType;
  specialRating?: number;
  specialStats?: CardStats;
  specialTitle?: string;
  size?: CardSize;
  className?: string;
  cardBackgroundImage?: string;
}

export function FifaCard({
  player,
  specialType,
  specialRating,
  specialStats,
  size = "md",
  className,
}: FifaCardProps) {
  const s = SIZE_MAP[size];
  const colors = specialType ? SPECIAL_COLORS[specialType] : TIER_COLORS[player.tier];
  const textColor = colors.text;
  const rating = specialRating ?? player.rating;
  const stats = specialStats ?? getCardStats(player);
  const footerLabel = specialType ? specialType.toUpperCase() : "BASIC";
  const faceColor = specialType ? FACE_COLORS[specialType] : FACE_COLORS[player.tier];

  return (
    <CardBackground
      tier={player.tier}
      specialType={specialType}
      className={cn(s.card, className)}
    >
      {/* Left column: rating + badge + flag */}
      <div className={cn("absolute top-0 left-0 flex flex-col items-center pt-[8%] pl-[10%] z-20", s.gap)}>
        <span className={cn("font-black leading-none tracking-tight", s.rating, textColor)}>
          {rating}
        </span>
        {/* Vaksala SK badge */}
        <div className={cn("relative", s.badge)}>
          <Image
            src="/vaksala.png"
            alt="Vaksala SK"
            fill
            className="object-contain"
          />
        </div>
        {/* Swedish flag */}
        <div className={cn("relative overflow-hidden rounded-[2px]", s.flag)}>
          <Image
            src="/sverige.png"
            alt="Sverige"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Face silhouette — bottom-aligned so it sits on the name banner line */}
      <div className="flex flex-1 items-end justify-center w-full">
        <div className={cn("relative flex items-end justify-center overflow-hidden", s.silhouette)}>
          {/* Portrait silhouette — realistic male head, neck, shoulders */}
          <svg
            viewBox="0 0 200 230"
            className="relative w-full h-full"
            style={{ color: faceColor }}
          >
            {/* Hair / top of head with texture */}
            <path d="M68 72 Q68 28 100 22 Q132 28 132 72" fill="currentColor" />
            <path d="M65 68 Q62 40 78 28 Q85 22 100 20 Q115 22 122 28 Q138 40 135 68" fill="currentColor" />
            {/* Messy hair strands */}
            <path d="M72 38 Q68 25 75 20 Q82 16 88 22" fill="currentColor" />
            <path d="M112 22 Q118 16 125 20 Q132 25 128 38" fill="currentColor" />
            <path d="M95 18 Q100 12 105 18" fill="currentColor" />
            {/* Face / head oval */}
            <ellipse cx="100" cy="82" rx="35" ry="45" fill="currentColor" />
            {/* Ears */}
            <ellipse cx="63" cy="82" rx="7" ry="12" fill="currentColor" />
            <ellipse cx="137" cy="82" rx="7" ry="12" fill="currentColor" />
            {/* Neck */}
            <path d="M85 124 L85 145 Q85 150 90 152 L110 152 Q115 150 115 145 L115 124" fill="currentColor" />
            {/* Shoulders — wider, natural curve */}
            <path d="M90 150 Q88 150 70 156 Q40 166 15 185 L5 195 L5 240 L195 240 L195 195 L185 185 Q160 166 130 156 Q112 150 110 150 Z" fill="currentColor" />
            {/* Collar / shirt neckline */}
            <path d="M90 150 Q95 160 100 164 Q105 160 110 150" fill="currentColor" opacity="0.8" />
          </svg>
        </div>
      </div>

      {/* Name banner */}
      <div
        className={cn(
          "w-full text-center font-bold tracking-[0.15em] uppercase border-t border-b border-current/15",
          s.name, textColor, "bg-black/10"
        )}
      >
        {player.name}
      </div>

      {/* Stats grid */}
      <div className="w-full py-[3%]">
        <StatsGrid
          stats={stats}
          isGoalkeeper={player.isGoalkeeper}
          textColor={textColor}
          valueSize={s.statValue}
          labelSize={s.statLabel}
        />
      </div>

      {/* Footer */}
      <div className={cn("font-semibold tracking-[0.2em] opacity-50", s.footerText, textColor)}>
        {footerLabel}
      </div>
    </CardBackground>
  );
}
