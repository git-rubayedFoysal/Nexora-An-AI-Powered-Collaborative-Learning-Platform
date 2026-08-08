/**
 * AssignmentDetailCard
 *
 * Displays the full details of a single assignment.
 * Shared by both teacher and student views.
 *
 * Shows:
 *  - Course and module tags
 *  - Assignment title
 *  - Full description and instructions
 *  - Due date and max score
 *  - Attachment download link (opens in new tab)
 *
 * Props:
 *  - assignment — the assignment object with nested modules.courses
 */

import { useState, useEffect } from "react";
import formatDate from "../../../../utils/formatDate";
import assignmentStorage from "../../../../services/supabase/assignment/assignment.storage";

function AssignmentDetailCard({ assignment }) {
  // ── Attachment signed URL (fetched on mount) ──
  const [attachmentUrl, setAttachmentUrl] = useState(null);

  const courseName = assignment.modules?.courses?.title ?? "—";
  const moduleName = assignment.modules?.title ?? "—";

  // Generate a signed URL for the attachment so it can be opened in a new tab
  useEffect(() => {
    if (!assignment.attachment_path) return;

    let cancelled = false;

    async function loadAttachmentUrl() {
      try {
        const url = await assignmentStorage.getAttachmentUrl(
          assignment.attachment_path,
        );
        if (!cancelled) setAttachmentUrl(url);
      } catch {
        if (!cancelled) setAttachmentUrl(null);
      }
    }

    loadAttachmentUrl();
    return () => {
      cancelled = true;
    };
  }, [assignment.attachment_path]);

  return (
    <div className="glass rounded-2xl border border-white/6 p-6 sm:p-8">
      {/* ── Course & module tags ── */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber/15 text-amber truncate max-w-36">
          {courseName}
        </span>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-violet/15 text-violet-light truncate max-w-36">
          {moduleName}
        </span>
      </div>

      {/* ── Title ── */}
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-6 font-display">
        {assignment.title}
      </h1>

      {/* ── Description ── */}
      <div className="mb-5">
        <h2 className="text-xs font-semibold text-slate uppercase tracking-wider mb-2">
          Description
        </h2>
        <p className="text-sm text-slate leading-relaxed whitespace-pre-line">
          {assignment.description}
        </p>
      </div>

      {/* ── Instructions ── */}
      <div className="mb-5">
        <h2 className="text-xs font-semibold text-slate uppercase tracking-wider mb-2">
          Instructions
        </h2>
        <p className="text-sm text-slate leading-relaxed whitespace-pre-line">
          {assignment.instructions}
        </p>
      </div>

      {/* ── Meta row (due date, max score) ── */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-dark font-mono mb-5 pt-4 border-t border-white/6">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Due: {formatDate(assignment.due_date)}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {assignment.max_score ?? "—"} pts
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Created: {formatDate(assignment.created_at)}
        </span>
      </div>

      {/* ── Attachment ── */}
      {assignment.attachment_name && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-glass px-4 py-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet/15 border border-violet/25 shrink-0">
            <svg className="w-5 h-5 text-violet-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white font-medium truncate">
              {assignment.attachment_name}
            </p>
            <p className="text-[11px] text-slate-dark">Attachment</p>
          </div>
          {attachmentUrl && (
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-teal bg-teal-dim border border-teal/25 hover:bg-teal/20 transition-colors shrink-0"
            >
              Open
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default AssignmentDetailCard;
