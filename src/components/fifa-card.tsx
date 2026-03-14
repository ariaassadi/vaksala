import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Player, CardStats, SpecialCardType } from "@/lib/types";
import { TIER_COLORS, SPECIAL_COLORS, getCardStats } from "@/lib/card-utils";
import { CardBackground } from "@/components/card-background";
import { StatsGrid } from "@/components/stats-grid";

type CardSize = "sm" | "md" | "lg";

interface SizeConfig {
  card: string;
  ratingText: string;
  nameText: string;
  imageSize: number;
  paddingTop: string;
}

const SIZE_MAP: Record<CardSize, SizeConfig> = {
  sm: {
    card: "w-[180px] h-[260px]",
    ratingText: "text-2xl",
    nameText: "text-xs",
    imageSize: 80,
    paddingTop: "pt-3",
  },
  md: {
    card: "w-[240px] h-[346px]",
    ratingText: "text-3xl",
    nameText: "text-sm",
    imageSize: 110,
    paddingTop: "pt-4",
  },
  lg: {
    card: "w-[320px] h-[462px]",
    ratingText: "text-4xl",
    nameText: "text-base",
    imageSize: 150,
    paddingTop: "pt-5",
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
  specialTitle,
  size = "md",
  className,
}: FifaCardProps) {
  const sizeConfig = SIZE_MAP[size];
  const colors = specialType ? SPECIAL_COLORS[specialType] : TIER_COLORS[player.tier];
  const textColor = colors.text;
  const rating = specialRating ?? player.rating;
  const stats = specialStats ?? getCardStats(player);
  const footerLabel = specialType ? specialType.toUpperCase() : "BASIC";

  return (
    <CardBackground
      tier={player.tier}
      specialType={specialType}
      className={cn(sizeConfig.card, className)}
    >
      {/* Top section: rating (absolute top-left) + club/flag (absolute below rating) */}
      <div className={cn("absolute top-0 left-0 flex flex-col items-center", sizeConfig.paddingTop, "pl-4 z-20")}>
        <span className={cn("font-black leading-none", sizeConfig.ratingText, textColor)}>
          {rating}
        </span>
        {/* VSK circle crest */}
        <div className={cn("mt-1 flex flex-col items-center gap-0.5")}>
          <div
            className={cn(
              "rounded-full flex items-center justify-center font-black border",
              textColor,
              size === "lg" ? "w-7 h-7 text-[9px]" : size === "md" ? "w-5 h-5 text-[7px]" : "w-4 h-4 text-[6px]",
              "border-current opacity-80"
            )}
          >
            VSK
          </div>
          {/* Swedish flag */}
          <div
            className={cn(
              "relative overflow-hidden rounded-sm",
              size === "lg" ? "w-7 h-[14px]" : size === "md" ? "w-5 h-[10px]" : "w-4 h-[8px]"
            )}
            style={{ background: "#006AA7" }}
          >
            {/* Yellow cross */}
            <div className="absolute inset-0 flex items-center" style={{ paddingLeft: "30%" }}>
              <div className="w-full h-[30%] bg-[#FECC02]" />
            </div>
            <div className="absolute inset-0 flex justify-center" style={{ paddingTop: "0" }}>
              <div className="h-full w-[20%] bg-[#FECC02]" />
            </div>
          </div>
        </div>
      </div>

      {/* Player image or silhouette — centered, flexible height */}
      <div className={cn("flex flex-1 items-end justify-center w-full mt-0", sizeConfig.paddingTop)}>
        {player.imageUrl ? (
          <Image
            src={player.imageUrl}
            alt={player.name}
            width={sizeConfig.imageSize}
            height={sizeConfig.imageSize}
            className="object-contain drop-shadow-lg"
            style={{ maxHeight: sizeConfig.imageSize }}
          />
        ) : (
          <div
            style={{
              width: sizeConfig.imageSize,
              height: sizeConfig.imageSize,
              background: `radial-gradient(ellipse at 50% 30%, ${TIER_COLORS[player.tier].silhouette}cc 0%, ${TIER_COLORS[player.tier].silhouette}44 70%, transparent 100%)`,
            }}
            className="rounded-full"
          />
        )}
      </div>

      {/* Name banner */}
      <div
        className={cn(
          "w-full text-center font-bold tracking-widest uppercase border-t border-b border-current/20 py-1",
          sizeConfig.nameText,
          textColor,
          "bg-black/10"
        )}
      >
        {player.name}
      </div>

      {/* Stats grid */}
      <div className="w-full py-2">
        <StatsGrid stats={stats} isGoalkeeper={player.isGoalkeeper} textColor={textColor} />
      </div>

      {/* Footer */}
      <div className={cn("text-[10px] font-semibold tracking-widest opacity-60 pb-8", textColor)}>
        ⚽ {footerLabel}
      </div>
    </CardBackground>
  );
}
