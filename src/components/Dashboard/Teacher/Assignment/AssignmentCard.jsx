/**
 * AssignmentCard
 *
 * Displays a single assignment as a glass card with:
 *  - Course & module tags
 *  - Title and description
 *  - Meta row (due date, max score, attachment indicator)
 *  - Edit and Delete action buttons
 *
 * Props:
 *  - assignment — the assignment object (with nested modules.courses)
 *  - onEdit     — callback to open edit modal
 *  - onDelete   — callback to open delete confirmation
 */

import { useNavigate } from "react-router";
import formatDate from "../../../../utils/formatDate";

function AssignmentCard({ assignment, onEdit, onDelete }) {
  const navigate = useNavigate();
  const courseName = assignment.modules?.courses?.title ?? "—";
  const moduleName = assignment.modules?.title ?? "—";

  return (
    <div
      onClick={() => navigate(`/dashboard/assignments/${assignment.id}`)}
      className="glass rounded-2xl border border-white/6 p-5 flex flex-col cursor-pointer hover:border-white/12 transition-colors"
    >
      {/* ── Course & module tags ── */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber/15 text-amber truncate max-w-30">
          {courseName}
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet/15 text-violet-light truncate max-w-30">
          {moduleName}
        </span>
      </div>

      {/* ── Title ── */}
      <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">
        {assignment.title}
      </h3>

      {/* ── Description ── */}
      <p className="text-xs text-slate mb-4 line-clamp-2">
        {assignment.description}
      </p>

      {/* ── Meta row (date, score, attachment) ── */}
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-dark font-mono">
        {/* Due date */}
        <span className="flex items-center gap-1">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {formatDate(assignment.due_date)}
        </span>

        {/* Max score */}
        <span className="flex items-center gap-1">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {assignment.max_score ?? "—"} pts
        </span>

        {/* Attachment indicator */}
        {assignment.attachment_name && (
          <span className="flex items-center gap-1 text-teal">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
            {assignment.attachment_name}
          </span>
        )}
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-white/6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(assignment);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                     text-xs font-semibold text-teal bg-teal-dim border border-teal/25
                     hover:bg-teal/20 transition-colors cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(assignment);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                     text-xs font-semibold text-coral bg-coral-dim border border-coral/25
                     hover:bg-coral/20 transition-colors cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}

export default AssignmentCard;
