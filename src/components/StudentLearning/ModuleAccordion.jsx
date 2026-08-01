import formatDuration from "../../utils/formatDuration";
import { LessonItem } from "../index";

/**
 * ModuleAccordion — Collapsible module card in the sidebar.
 *
 * Shows lesson count + total duration when collapsed.
 * Passes completedLessonIds to each LessonItem for checkmark display.
 */
function ModuleAccordion({
  module: mod,
  lessons,
  isExpanded,
  selectedLessonId,
  completedLessonIds,
  onToggle,
  onSelectLesson,
  isLoading,
}) {
  const totalDuration = lessons.reduce((sum, l) => sum + (l.duration || 0), 0);

  return (
    <div>
      <button
        onClick={onToggle}
        className={[
          "group flex items-center justify-between gap-3 w-full px-4 py-3",
          "rounded-xl border border-white/8 bg-glass-2",
          "hover:border-white/15 transition-colors cursor-pointer select-none text-left",
        ].join(" ")}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          <svg
            className={[
              "w-4 h-4 text-slate-dark shrink-0 transition-transform duration-200",
              isExpanded ? "rotate-180" : "",
            ].join(" ")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>

          <span className="text-[11px] font-mono text-slate-dark w-5 font-bold text-right shrink-0">
            {String(mod.position).padStart(2, "0")}
          </span>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {mod.title}
            </p>
            {mod.lesson_count > 0 && (
              <p className="text-[10px] text-slate-dark mt-0.5">
                {mod.lesson_count} lesson{mod.lesson_count !== 1 && "s"}
                {lessons.length > 0 && <> · {formatDuration(totalDuration)}</>}
              </p>
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="ml-4 mt-1 mb-2 rounded-xl border border-white/5 bg-white/3 overflow-hidden">
          {isLoading ? (
            <div className="px-5 py-6 text-center">
              <p className="text-xs text-slate-dark">Loading lessons…</p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="px-5 py-6 text-center">
              <p className="text-xs text-slate-dark">
                No lessons in this module yet.
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {lessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  isActive={lesson.id === selectedLessonId}
                  isCompleted={completedLessonIds?.has(lesson.id) ?? false}
                  onClick={() => onSelectLesson(lesson)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ModuleAccordion;
