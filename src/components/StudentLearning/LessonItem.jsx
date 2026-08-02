import formatDuration from "../../utils/formatDuration";

/**
 * LessonItem — Single clickable lesson row inside a ModuleAccordion.
 *
 * Shows: position number, title, video icon or checkmark (if completed), duration.
 * Active lesson gets teal highlight with left border indicator.
 */
function LessonItem({ lesson, isActive, isCompleted, onClick }) {
  return (
    <button
      onClick={onClick}
      data-lesson-id={lesson.id}
      className={[
        "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left transition-colors",
        isActive
          ? "bg-teal/10 text-teal border-l-2 border-teal"
          : "text-slate hover:text-white hover:bg-white/6 border-l-2 border-transparent",
      ].join(" ")}
      aria-current={isActive ? "step" : undefined}
    >
      <div className="flex gap-2 items-center">
        <span className="text-[10px] font-mono text-slate-dark w-5 text-right shrink-0">
          {String(lesson.position).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-xs truncate">{lesson.title}</p>
        </div>
      </div>

      <div className="w-12 flex items-center gap-2 ml-auto">
        {/* Completed checkmark or video icon */}
        {isCompleted ? (
          <svg
            className="w-3.5 h-3.5 shrink-0 text-teal"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : lesson.video_path ? (
          <svg
            className="w-3 h-3 shrink-0 text-violet-light"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        ) : null}

        <span className="text-[10px] text-slate-dark shrink-0">
          {formatDuration(lesson.duration)}
        </span>
      </div>
    </button>
  );
}

export default LessonItem;
