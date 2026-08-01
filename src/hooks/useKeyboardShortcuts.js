import { useEffect } from "react";

/**
 * useKeyboardShortcuts — Global keyboard shortcuts for the learning page.
 *
 * Space = play/pause, ←/→ = seek ±10s, N = next lesson, P = previous lesson.
 * Ignored when an input or textarea is focused to avoid hijacking typing.
 */
export default function useKeyboardShortcuts(videoRef, { hasNext, hasPrev, goToNext, goToPrev }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      )
        return;

      const video = videoRef.current;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (video) {
            video.paused ? video.play() : video.pause();
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (video) {
            video.currentTime = Math.max(0, video.currentTime - 10);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (video) {
            video.currentTime = Math.min(
              video.duration || 0,
              video.currentTime + 10,
            );
          }
          break;
        case "KeyN":
          if (hasNext) goToNext();
          break;
        case "KeyP":
          if (hasPrev) goToPrev();
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [videoRef, hasNext, hasPrev, goToNext, goToPrev]);
}
