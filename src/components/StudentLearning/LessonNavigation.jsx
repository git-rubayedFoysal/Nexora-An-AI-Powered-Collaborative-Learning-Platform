/**
 * LessonNavigation — Previous / counter / Next buttons for lesson navigation.
 * Disabled at boundaries.
 */
function LessonNavigation({
  hasPrev,
  hasNext,
  currentIndex,
  totalLessons,
  onPrev,
  onNext,
}) {
  return (
    <div className="flex items-center gap-3 pt-2 border-t border-white/6">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className={[
          "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all flex-1 sm:flex-none",
          hasPrev
            ? "glass2 border border-white/10 text-white hover:border-white/20 hover:bg-white/8 cursor-pointer"
            : "bg-white/3 text-slate-dark border border-white/5 cursor-not-allowed opacity-50",
        ].join(" ")}
        aria-label="Previous lesson"
      >
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/3 border border-white/6">
        <span className="text-[10px] font-mono text-slate-dark">
          {currentIndex + 1} of {totalLessons}
        </span>
      </div>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className={[
          "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all flex-1 sm:flex-none",
          hasNext
            ? "bg-linear-to-r from-violet to-violet-light text-white shadow-[0_4px_20px_rgba(124,90,247,0.35)] hover:shadow-[0_4px_30px_rgba(124,90,247,0.5)] cursor-pointer"
            : "bg-white/3 text-slate-dark border border-white/5 cursor-not-allowed opacity-50",
        ].join(" ")}
        aria-label="Next lesson"
      >
        <span className="hidden sm:inline">Next</span>
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}

export default LessonNavigation;
