import { cn } from "@/lib/utils";
import type { CardTier, SpecialCardType } from "@/lib/types";
import { TIER_COLORS, SPECIAL_COLORS } from "@/lib/card-utils";

interface CardBackgroundProps {
  tier: CardTier;
  specialType?: SpecialCardType;
  className?: string;
  children: React.ReactNode;
}

export function CardBackground({ tier, specialType, className, children }: CardBackgroundProps) {
  const colors = specialType ? SPECIAL_COLORS[specialType] : TIER_COLORS[tier];
  const isRare = tier.includes("rare") || !!specialType;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center overflow-hidden",
        "bg-gradient-to-b", colors.bg, colors.accent,
        className
      )}
      style={{
        clipPath: "polygon(8% 0%, 92% 0%, 100% 6%, 100% 82%, 85% 92%, 50% 100%, 15% 92%, 0% 82%, 0% 6%)",
      }}
    >
      {/* Geometric shimmer pattern for rare/special cards */}
      {isRare && (
        <div className="absolute inset-0 opacity-[0.12]" style={{
          backgroundImage: `
            linear-gradient(60deg, transparent 40%, rgba(255,255,255,0.2) 41%, rgba(255,255,255,0.2) 43%, transparent 44%),
            linear-gradient(-60deg, transparent 40%, rgba(255,255,255,0.2) 41%, rgba(255,255,255,0.2) 43%, transparent 44%),
            linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.12) 41%, rgba(255,255,255,0.12) 43%, transparent 44%)
          `,
          backgroundSize: "60px 60px",
        }} />
      )}
      {/* Inner border glow */}
      <div className="absolute inset-[2px] border border-white/[0.08] rounded-sm pointer-events-none z-10"
        style={{
          clipPath: "polygon(8% 0%, 92% 0%, 100% 6%, 100% 82%, 85% 92%, 50% 100%, 15% 92%, 0% 82%, 0% 6%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center w-full h-full">{children}</div>
    </div>
  );
}
