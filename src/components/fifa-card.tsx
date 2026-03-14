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
  silhouettePx: number;
  statValue: string;
  statLabel: string;
  footerText: string;
  gap: string;
}

const SIZE_MAP: Record<CardSize, SizeConfig> = {
  sm: {
    card: "w-[160px] h-[230px]",
    rating: "text-[26px]",
    badge: "w-[20px] h-[24px]",
    flag: "w-[20px] h-[13px]",
    name: "text-[10px] py-[3px]",
    silhouette: "w-[64px] h-[72px]",
    silhouettePx: 64,
    statValue: "text-[15px]",
    statLabel: "text-[8px]",
    footerText: "text-[8px] pb-5",
    gap: "gap-[2px]",
  },
  md: {
    card: "w-[200px] h-[290px]",
    rating: "text-[34px]",
    badge: "w-[26px] h-[32px]",
    flag: "w-[26px] h-[16px]",
    name: "text-[11px] py-[3px]",
    silhouette: "w-[84px] h-[96px]",
    silhouettePx: 84,
    statValue: "text-[18px]",
    statLabel: "text-[9px]",
    footerText: "text-[9px] pb-6",
    gap: "gap-[3px]",
  },
  lg: {
    card: "w-[300px] h-[430px]",
    rating: "text-[50px]",
    badge: "w-[36px] h-[44px]",
    flag: "w-[36px] h-[23px]",
    name: "text-[16px] py-1",
    silhouette: "w-[120px] h-[136px]",
    silhouettePx: 120,
    statValue: "text-[26px]",
    statLabel: "text-[12px]",
    footerText: "text-[12px] pb-8",
    gap: "gap-1",
  },
};

// Face silhouette colors per tier/special type
const FACE_COLORS: Record<string, string> = {
  bronze: "#5C3D1A",
  "bronze-rare": "#6B4A28",
  silver: "#3A3A3A",
  "silver-rare": "#444444",
  gold: "#5A4210",
  "gold-rare": "#6B5215",
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
        {/* Vaksala badge */}
        <div className={cn("relative", s.badge)}>
          <Image
            src="/vaksala.svg"
            alt="Vaksala IF"
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

      {/* Face silhouette - centered, positioned like a FIFA card portrait */}
      <div className="flex flex-1 items-center justify-center w-full pt-[6%]">
        <div className={cn("relative flex items-end justify-center overflow-hidden", s.silhouette)}>
          {/* Subtle glow behind the face */}
          <div className="absolute inset-0 rounded-full" style={{
            background: `radial-gradient(ellipse at 50% 40%, ${faceColor}44 0%, transparent 70%)`,
          }} />
          {/* Portrait silhouette SVG */}
          <svg
            viewBox="0 0 200 240"
            className="relative w-full h-full"
            style={{ color: faceColor }}
          >
            {/* Head */}
            <ellipse cx="100" cy="68" rx="42" ry="52" fill="currentColor" />
            {/* Ears */}
            <ellipse cx="55" cy="72" rx="8" ry="14" fill="currentColor" />
            <ellipse cx="145" cy="72" rx="8" ry="14" fill="currentColor" />
            {/* Neck */}
            <rect x="82" y="115" width="36" height="24" rx="4" fill="currentColor" />
            {/* Shoulders and torso */}
            <path d="M82 132 Q80 132 60 140 Q20 155 5 180 L5 260 L195 260 L195 180 Q180 155 140 140 Q120 132 118 132 Z" fill="currentColor" />
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
