/**
 * LessonRow
 *
 * Renders a single lesson inside an expanded module panel.
 * Shows position number, title, duration, and role-based action buttons:
 *  - Students/Guests: play/lock toggle based on enrollment + preview status
 *  - Teacher/Admin: edit + delete buttons
 *
 * Also renders AttachmentRow sub-rows for video/PDF files below the lesson.
 *
 * Props:
 *  - lesson            — the lesson object
 *  - isEnrolled        — whether the student is enrolled in the course
 *  - showTeacherActions — whether to show edit/delete buttons
 *  - onPlayPreview     — callback to open preview video modal
 *  - onEditLesson      — callback to open edit lesson modal
 *  - onDeleteLesson    — callback to open delete lesson confirmation
 */

import formatDuration from "../../../utils/formatDuration";
import { PencilIcon, TrashIcon } from "./CourseIcons";
import AttachmentRow from "./AttachmentRow";

function LessonRow({
  lesson,
  isEnrolled,
  showTeacherActions,
  onPlayPreview,
  onEditLesson,
  onDeleteLesson,
}) {
  return (
    <div>
      {/* ── Main lesson row ── */}
      <div className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/3 transition-colors">
        {/* Position number: "01", "02", etc. */}
        <span className="text-[10px] font-mono text-slate-dark w-5 text-right shrink-0">
          {String(lesson.position).padStart(2, "0")}
        </span>

        {/* Lesson title */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/80 truncate">{lesson.title}</p>
        </div>

        {/* Duration badge */}
        <span className="text-[10px] text-slate-dark shrink-0">
          {formatDuration(lesson.duration)}
        </span>

        {/* Teacher/Admin: edit + delete buttons */}
        {showTeacherActions && (
          <div
            className="flex items-center gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEditLesson(lesson)}
              className="p-1.5 rounded-md text-slate hover:text-teal hover:bg-teal/10 transition-colors"
              title="Edit Lesson"
            >
              <PencilIcon className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDeleteLesson(lesson)}
              className="p-1.5 rounded-md text-slate hover:text-coral hover:bg-coral/10 transition-colors"
              title="Delete Lesson"
            >
              <TrashIcon className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* ── Attachment sub-rows (video / PDF) ── */}
      {lesson.video_path && (
        <AttachmentRow
          lesson={lesson}
          type="video"
          isEnrolled={isEnrolled}
          onPlayPreview={onPlayPreview}
        />
      )}
      {lesson.pdf_path && (
        <AttachmentRow
          lesson={lesson}
          type="pdf"
          isEnrolled={isEnrolled}
        />
      )}
    </div>
  );
}

export default LessonRow;
