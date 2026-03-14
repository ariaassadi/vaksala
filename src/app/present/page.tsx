"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getPlayers, getSpecialCards } from "@/lib/data";
import { generateSlides } from "@/components/presentation/slide-data";
import { SlideRenderer } from "@/components/presentation/slide-renderer";

export default function PresentPage() {
  const players = useMemo(() => getPlayers(), []);
  const specialCards = useMemo(() => getSpecialCards(), []);
  const slides = useMemo(() => generateSlides(players, specialCards), [players, specialCards]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Sync isFullscreen state with browser fullscreen changes (e.g. Escape key)
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Auto-play interval
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= slides.length - 1) {
          return prev;
        }
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [autoPlay, slides.length]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "p":
          setAutoPlay((prev) => !prev);
          break;
        case "m":
          // Placeholder for future music toggle
          break;
        case "Escape":
          if (isFullscreen) {
            document.exitFullscreen().catch(() => {});
            setIsFullscreen(false);
          }
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, toggleFullscreen, isFullscreen]);

  const progress = slides.length > 1 ? (currentSlide / (slides.length - 1)) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col text-white overflow-hidden">
      {/* Slide content area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
        <div key={currentSlide} className="w-full flex items-center justify-center">
          <SlideRenderer slide={slides[currentSlide]} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-800 w-full shrink-0">
        <div
          className="h-1 bg-yellow-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls bar */}
      <div className="shrink-0 flex items-center justify-between gap-4 px-6 py-3 bg-zinc-900/80 border-t border-zinc-800 text-sm">
        {/* Slide counter */}
        <span className="text-zinc-400 tabular-nums min-w-[6rem]">
          {currentSlide + 1} / {slides.length}
        </span>

        {/* Nav buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            &larr; Prev
          </button>
          <button
            onClick={goNext}
            disabled={currentSlide === slides.length - 1}
            className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next &rarr;
          </button>
        </div>

        {/* Auto-play toggle */}
        <button
          onClick={() => setAutoPlay((prev) => !prev)}
          className={`px-3 py-1.5 rounded transition-colors ${
            autoPlay
              ? "bg-yellow-500 text-zinc-950 hover:bg-yellow-400"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
          }`}
        >
          {autoPlay ? "Auto: ON" : "Auto: OFF"}
        </button>

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          {isFullscreen ? "Exit FS" : "Fullscreen"}
        </button>

        {/* Keyboard hints */}
        <span className="text-zinc-600 hidden md:block">
          SPACE / &rarr; next &nbsp;|&nbsp; &larr; prev &nbsp;|&nbsp; F fullscreen &nbsp;|&nbsp; P auto-play
        </span>
      </div>
    </div>
  );
}
