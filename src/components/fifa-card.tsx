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
    badge: "w-[14px] h-[14px] text-[4.5px]",
    flag: "w-[14px] h-[9px]",
    name: "text-[10px] py-[3px]",
    silhouette: "w-[56px] h-[56px]",
    statValue: "text-[15px]",
    statLabel: "text-[8px]",
    footerText: "text-[8px] pb-5",
    gap: "gap-[2px]",
  },
  md: {
    card: "w-[200px] h-[290px]",
    rating: "text-[34px]",
    badge: "w-[18px] h-[18px] text-[5.5px]",
    flag: "w-[18px] h-[11px]",
    name: "text-[11px] py-[3px]",
    silhouette: "w-[76px] h-[76px]",
    statValue: "text-[18px]",
    statLabel: "text-[9px]",
    footerText: "text-[9px] pb-6",
    gap: "gap-[3px]",
  },
  lg: {
    card: "w-[300px] h-[430px]",
    rating: "text-[50px]",
    badge: "w-[24px] h-[24px] text-[7px]",
    flag: "w-[24px] h-[15px]",
    name: "text-[16px] py-1",
    silhouette: "w-[110px] h-[110px]",
    statValue: "text-[26px]",
    statLabel: "text-[12px]",
    footerText: "text-[12px] pb-8",
    gap: "gap-1",
  },
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
  const silhouetteColor = specialType ? "rgba(255,255,255,0.15)" : TIER_COLORS[player.tier].silhouette;

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
        {/* VSK badge */}
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-black border border-current/60",
            textColor, s.badge
          )}
        >
          VSK
        </div>
        {/* Swedish flag */}
        <div className={cn("relative overflow-hidden rounded-[1px]", s.flag)} style={{ background: "#006AA7" }}>
          <div className="absolute" style={{ top: "35%", left: 0, right: 0, height: "30%", background: "#FECC02" }} />
          <div className="absolute" style={{ left: "30%", top: 0, bottom: 0, width: "20%", background: "#FECC02" }} />
        </div>
      </div>

      {/* Face silhouette - centered in card body */}
      <div className="flex flex-1 items-center justify-center w-full pt-[10%]">
        <div className={cn("rounded-full flex items-center justify-center", s.silhouette)}
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${silhouetteColor}88 0%, ${silhouetteColor}22 70%, transparent 100%)`,
          }}
        >
          {/* Head + shoulders silhouette */}
          <svg viewBox="0 0 80 80" className="w-[70%] h-[70%] opacity-40" fill={silhouetteColor}>
            <circle cx="40" cy="28" r="16" />
            <ellipse cx="40" cy="68" rx="26" ry="18" />
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
