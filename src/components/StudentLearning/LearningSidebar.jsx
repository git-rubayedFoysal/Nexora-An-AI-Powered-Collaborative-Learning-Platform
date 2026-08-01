import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ModuleAccordion } from "../index";

/**
 * LearningSidebar — Fixed left panel showing the course curriculum.
 *
 * Desktop: sticky sidebar, 320px wide, always visible.
 * Mobile: full-height overlay drawer with backdrop.
 * Auto-scrolls to keep the active lesson visible.
 */
function LearningSidebar({
  modules,
  moduleLessons,
  expandedModules,
  selectedLessonId,
  completedLessonIds,
  onToggleModule,
  onSelectLesson,
  loadingModules,
  isOpen,
  onClose,
}) {
  const navRef = useRef(null);

  const totalLessons = modules.reduce(
    (sum, mod) => sum + (mod.lesson_count || 0),
    0,
  );

  // Auto-scroll sidebar to keep the active lesson visible.
  // Runs whenever selectedLessonId changes.
  useEffect(() => {
    if (!navRef.current || !selectedLessonId) return;
    const activeEl = navRef.current.querySelector(
      `[data-lesson-id="${selectedLessonId}"]`,
    );
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedLessonId]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          "fixed lg:sticky left-0 w-80 bg-navy-2",
          "border-r border-white/6 overflow-y-auto flex flex-col z-40",
          "transition-transform duration-200",
          "top-0 h-screen lg:top-17 lg:h-[calc(100vh-4.25rem)] lg:shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Mobile header with close button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 lg:hidden shrink-0">
          <span className="text-sm font-semibold text-white">Curriculum</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate hover:text-white hover:bg-white/6 transition-colors"
            aria-label="Close sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Back link */}
        <div className="px-3 pt-3 pb-1 shrink-0">
          <Link
            to="/dashboard/my-learning"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate hover:text-white hover:bg-white/6 transition-colors"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            My Learning
          </Link>
        </div>

        {/* Module list */}
        <nav
          ref={navRef}
          className="flex-1 px-3 pb-3 space-y-1.5 overflow-y-auto"
        >
          {modules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-glass-2 border border-border flex items-center justify-center text-2xl mb-1">
                📋
              </div>
              <p className="text-xs text-slate-dark">No modules available.</p>
            </div>
          ) : (
            modules.map((mod) => (
              <ModuleAccordion
                key={mod.id}
                module={mod}
                lessons={moduleLessons[mod.id] || []}
                isExpanded={expandedModules.has(mod.id)}
                selectedLessonId={selectedLessonId}
                completedLessonIds={completedLessonIds}
                onToggle={() => onToggleModule(mod.id)}
                onSelectLesson={onSelectLesson}
                isLoading={loadingModules.has(mod.id)}
              />
            ))
          )}
        </nav>

        {/* Footer stat */}
        {totalLessons > 0 && (
          <div className="px-4 py-3 border-t border-white/6 shrink-0">
            <p className="text-[10px] font-mono text-slate-dark text-center">
              {modules.length} module{modules.length !== 1 && "s"} ·{" "}
              {totalLessons} lesson{totalLessons !== 1 && "s"}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

export default LearningSidebar;
