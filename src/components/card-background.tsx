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
      {/* Diagonal line pattern — all cards */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 8px,
          rgba(255,255,255,0.4) 8px,
          rgba(255,255,255,0.4) 9px
        )`,
      }} />

      {/* Radial vignette */}
      <div className="absolute inset-0 opacity-30" style={{
        background: "radial-gradient(ellipse at 50% 35%, transparent 30%, rgba(0,0,0,0.4) 100%)",
      }} />

      {/* Geometric shimmer pattern for rare/special cards */}
      {isRare && (
        <>
          <div className="absolute inset-0 opacity-[0.12]" style={{
            backgroundImage: `
              linear-gradient(60deg, transparent 40%, rgba(255,255,255,0.25) 41%, rgba(255,255,255,0.25) 42.5%, transparent 43.5%),
              linear-gradient(-60deg, transparent 40%, rgba(255,255,255,0.25) 41%, rgba(255,255,255,0.25) 42.5%, transparent 43.5%),
              linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.15) 41%, rgba(255,255,255,0.15) 42.5%, transparent 43.5%)
            `,
            backgroundSize: "50px 50px",
          }} />
          {/* Horizontal shine band */}
          <div className="absolute inset-0 opacity-[0.08]" style={{
            background: "linear-gradient(180deg, transparent 20%, rgba(255,255,255,0.3) 35%, transparent 50%)",
          }} />
        </>
      )}

      {/* Hexagonal/honeycomb pattern for special cards */}
      {!!specialType && (
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `
            radial-gradient(circle at 25px 0px, rgba(255,255,255,0.5) 2px, transparent 2px),
            radial-gradient(circle at 0px 43px, rgba(255,255,255,0.5) 2px, transparent 2px)
          `,
          backgroundSize: "50px 86px",
        }} />
      )}

      {/* Inner border glow */}
      <div className="absolute inset-[2px] border border-white/[0.1] rounded-sm pointer-events-none z-10"
        style={{
          clipPath: "polygon(8% 0%, 92% 0%, 100% 6%, 100% 82%, 85% 92%, 50% 100%, 15% 92%, 0% 82%, 0% 6%)",
        }}
      />

      {/* Decorative top edge line */}
      <div className="absolute top-[6%] left-[10%] right-[10%] h-[1px] bg-white/[0.1] z-10" />

      <div className="relative z-10 flex flex-col items-center w-full h-full font-[family-name:var(--font-card)]">{children}</div>
    </div>
  );
}
