/**
 * ModuleRow
 *
 * Renders the clickable module header bar with:
 *  - Chevron icon that rotates on expand/collapse
 *  - Module position number (01, 02, etc.)
 *  - Title + optional description
 *  - Collapsed summary badge (lesson count + total duration, student-only)
 *  - Action buttons: Add Lesson, Edit Module, Delete Module (teacher/admin only)
 *
 * Props:
 *  - mod           — the module object (id, position, title, description)
 *  - isExpanded    — whether this module is currently expanded
 *  - lessons       — array of loaded lessons (for summary badge)
 *  - isStudent     — whether the current user is a student
 *  - showTeacherActions — whether to show edit/delete/add buttons
 *  - onToggle      — callback to expand/collapse this module
 *  - onAddLesson   — callback to open create lesson modal
 *  - onEditModule  — callback to open edit module modal
 *  - onDeleteModule — callback to open delete module confirmation
 */

import formatDuration from "../../../utils/formatDuration";
import { ChevronIcon, PlusIcon, PencilIcon, TrashIcon } from "./CourseIcons";

function ModuleRow({
  mod,
  isExpanded,
  lessons,
  isStudent,
  showTeacherActions,
  onToggle,
  onAddLesson,
  onEditModule,
  onDeleteModule,
}) {
  const totalDuration = lessons.reduce((sum, l) => sum + (l.duration || 0), 0);

  return (
    <div
      className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-white/8 bg-glass-2 hover:border-white/15 transition-colors cursor-pointer select-none"
      onClick={() => onToggle(mod.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(mod.id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* Left: chevron + position + title + summary */}
      <div className="flex items-center gap-3 min-w-0">
        <ChevronIcon
          className={`w-4 h-4 text-slate-dark shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
        <span className="text-[11px] font-mono text-slate-dark w-5 font-bold text-right shrink-0">
          {String(mod.position).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{mod.title}</p>
          {mod.description && (
            <p className="text-[11px] text-slate-dark truncate mt-0.5">
              {mod.description}
            </p>
          )}
          {/* Summary badge: only shown when collapsed & lessons loaded (student view) */}
          {lessons.length > 0 && !isExpanded && isStudent && (
            <p className="text-[10px] text-slate-dark mt-0.5">
              {lessons.length} lesson{lessons.length !== 1 && "s"} ·{" "}
              {formatDuration(totalDuration)}
            </p>
          )}
        </div>
      </div>

      {/* Right: module action buttons (teacher & admin only) */}
      {showTeacherActions && (
        <div
          className="flex items-center gap-2 shrink-0"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <button
            className="p-2 rounded-lg border border-white/10 text-slate hover:text-violet-light hover:border-violet/30 transition-colors"
            title="Add Lesson"
            onClick={() => onAddLesson(mod)}
          >
            <PlusIcon className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-lg border border-white/10 text-slate hover:text-teal hover:border-teal/30 transition-colors"
            title="Edit module"
            onClick={() => onEditModule(mod)}
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-lg border border-white/10 text-slate hover:text-coral hover:border-coral/30 transition-colors"
            title="Delete module"
            onClick={() => onDeleteModule(mod)}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ModuleRow;
