/**
 * LessonsPanel
 *
 * The expanded section beneath a module row. Handles three states:
 *  1. Loading — spinner while lessons are being fetched
 *  2. Empty — "No lessons yet" placeholder with optional "Add first lesson" link
 *  3. Content — list of LessonRow components + assignment list + "Add Lesson" footer button
 *
 * Props:
 *  - mod              — the module object (id)
 *  - lessons          — array of lessons for this module
 *  - assignments      — array of assignments for this module
 *  - isLoading        — whether lessons are currently being fetched
 *  - isEnrolled       — whether the student is enrolled in the course
 *  - showTeacherActions — whether to show add lesson buttons
 *  - onAddLesson      — callback to open create lesson modal
 *  - onPlayPreview    — callback to open preview video modal
 *  - onEditLesson     — callback to open edit lesson modal
 *  - onDeleteLesson   — callback to open delete lesson confirmation
 */

import LessonRow from "./LessonRow";
import AssignmentRow from "./AssignmentRow";
import { PlusIcon } from "./CourseIcons";

function LessonsPanel({
  mod,
  lessons,
  assignments,
  isLoading,
  isEnrolled,
  showTeacherActions,
  onAddLesson,
  onPlayPreview,
  onEditLesson,
  onDeleteLesson,
}) {
  const hasAssignments = assignments && assignments.length > 0;

  return (
    <div className="ml-6 mt-1 mb-2 rounded-xl border border-white/5 bg-white/5 overflow-hidden">
      {/* State 1: Loading */}
      {isLoading ? (
        <div className="px-5 py-6 text-center">
          <p className="text-xs text-slate-dark">Loading lessons…</p>
        </div>
      ) : lessons.length === 0 && !hasAssignments ? (
        /* State 2: Empty (no lessons and no assignments) */
        <div className="px-5 py-6 text-center">
          <p className="text-xs text-slate-dark">
            No lessons in this module yet.
          </p>
          {showTeacherActions && (
            <button
              onClick={() => onAddLesson(mod)}
              className="mt-2 text-[11px] text-violet-light hover:underline"
            >
              + Add first lesson
            </button>
          )}
        </div>
      ) : (
        /* State 3: Content */
        <div>
          {/* Lessons section */}
          {lessons.length > 0 && (
            <div className="divide-y divide-white/5">
              {lessons.map((lesson) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  isEnrolled={isEnrolled}
                  showTeacherActions={showTeacherActions}
                  onPlayPreview={onPlayPreview}
                  onEditLesson={onEditLesson}
                  onDeleteLesson={onDeleteLesson}
                />
              ))}
            </div>
          )}

          {/* Assignments section */}
          {hasAssignments && (
            <div className="divide-y divide-white/5">
              {assignments.map((assignment) => (
                <AssignmentRow
                  key={assignment.id}
                  assignment={assignment}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* "Add Lesson" footer button (teacher/admin, shown when content exists) */}
      {showTeacherActions && (lessons.length > 0 || hasAssignments) && (
        <div className="px-5 py-2.5 border-t border-white/5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddLesson(mod);
            }}
            className="flex items-center gap-1.5 text-[11px] text-violet-light hover:text-violet transition-colors"
          >
            <PlusIcon className="w-3 h-3" />
            Add Lesson
          </button>
        </div>
      )}
    </div>
  );
}

export default LessonsPanel;
