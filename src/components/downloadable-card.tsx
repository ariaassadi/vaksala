"use client";

import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";

interface DownloadableCardProps {
  children: React.ReactNode;
  fileName: string;
}

export function DownloadableCard({ children, fileName }: DownloadableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cardRef.current) return;

    const dataUrl = await toPng(cardRef.current, {
      pixelRatio: 3,
      backgroundColor: "transparent",
    });

    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
  }, [fileName]);

  return (
    <div className="relative group">
      <div ref={cardRef}>{children}</div>
      <button
        onClick={handleDownload}
        className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 cursor-pointer"
        title="Download as PNG"
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}
