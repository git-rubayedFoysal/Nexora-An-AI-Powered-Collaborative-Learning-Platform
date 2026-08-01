import formatDuration from "../../utils/formatDuration";

/**
 * LessonActionBar — Lesson title, counter, duration, and mark complete button.
 *
 * Stacks vertically on mobile, horizontal on sm+.
 */
function LessonActionBar({
  currentIndex,
  totalLessons,
  lesson,
  isCompleted,
  onToggleComplete,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-[10px] font-mono text-slate-dark px-2 py-0.5 rounded-md bg-white/5 border border-white/8 shrink-0">
          {currentIndex + 1} / {totalLessons}
        </span>
        <h2 className="text-base lg:text-lg font-bold text-white font-display truncate">
          {lesson.title}
        </h2>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {lesson.duration > 0 && (
          <span className="text-[10px] font-mono text-slate-dark">
            {formatDuration(lesson.duration)}
          </span>
        )}
        <button
          type="button"
          onClick={onToggleComplete}
          className={[
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
            isCompleted
              ? "bg-teal text-white shadow-[0_4px_16px_rgba(15,191,138,0.35)]"
              : "bg-teal/15 text-teal border border-teal/25 hover:bg-teal/25 hover:border-teal/40",
          ].join(" ")}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {isCompleted ? "Completed" : "Mark Complete"}
        </button>
      </div>
    </div>
  );
}

export default LessonActionBar;
