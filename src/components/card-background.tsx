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
      className={cn("relative flex flex-col items-center", "bg-gradient-to-b", colors.bg, colors.accent, "shadow-lg", className)}
      style={{ clipPath: "polygon(10% 0%, 90% 0%, 100% 8%, 100% 82%, 85% 90%, 50% 100%, 15% 90%, 0% 82%, 0% 8%)" }}
    >
      {isRare && (
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(60deg, transparent 40%, rgba(255,255,255,0.15) 41%, rgba(255,255,255,0.15) 44%, transparent 45%), linear-gradient(-60deg, transparent 40%, rgba(255,255,255,0.15) 41%, rgba(255,255,255,0.15) 44%, transparent 45%), linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.1) 41%, rgba(255,255,255,0.1) 44%, transparent 45%)`,
          backgroundSize: "80px 80px",
        }} />
      )}
      <div className="relative z-10 flex flex-col items-center w-full h-full">{children}</div>
    </div>
  );
}
