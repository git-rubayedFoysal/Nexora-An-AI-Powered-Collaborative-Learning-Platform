/**
 * GradeSubmissionModal
 *
 * Portal modal that lets a teacher grade a student's submission.
 * Shows submission details (student, assignment, text, file link) and
 * provides a score input + feedback textarea.
 *
 * Props:
 *  - isOpen        – whether the modal is visible
 *  - onClose       – close handler
 *  - onGrade       – callback({ score, feedback })
 *  - submission    – the submission object to grade
 *  - loading       – disables the grade button while saving
 */

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { Button } from "../../components/index";
import formatDate from "../../utils/formatDate";
import getSubmissionTiming from "../../utils/submissionTiming";
import submissionStorage from "../../services/supabase/assignment/submission.storage";

function GradeSubmissionModal({
  isOpen,
  onClose,
  onGrade,
  submission,
  loading = false,
}) {
  const [score, setScore] = useState(
    submission?.score != null ? String(submission.score) : "",
  );
  const [feedback, setFeedback] = useState(submission?.feedback || "");
  const [fileUrl, setFileUrl] = useState(null);

  // ── Fetch signed URL for the submission file ──
  useEffect(() => {
    if (!isOpen || !submission?.file_path) return undefined;

    let cancelled = false;

    async function loadFileUrl() {
      try {
        const url = await submissionStorage.getSubmissionUrl(
          submission.file_path,
        );
        if (!cancelled) setFileUrl(url);
      } catch {
        if (!cancelled) setFileUrl(null);
      }
    }

    loadFileUrl();
    return () => {
      cancelled = true;
    };
  }, [isOpen, submission?.file_path]);

  if (!isOpen || !submission) return null;

  const maxScore = submission.assignments?.max_score || 100;
  const studentName = submission.users?.full_name || "Student";
  const assignmentTitle = submission.assignments?.title || "Assignment";
  const hasFile = Boolean(submission.file_name);

  function handleSubmit(e) {
    e.preventDefault();
    const numericScore = Number(score);
    if (Number.isNaN(numericScore) || numericScore < 0) return;
    onGrade({ score: numericScore, feedback });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-4"
      style={{
        background: "rgba(8,12,26,0.8)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass2 w-full max-w-lg rounded-2xl border border-white/8
                      shadow-[0_24px_60px_rgba(0,0,0,0.5)] p-6"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2
              className="text-base font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Grade Submission
            </h2>
            <p className="text-xs text-slate mt-0.5">
              {studentName} — {assignmentTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/8
                       flex items-center justify-center text-slate hover:text-white
                       hover:bg-white/10 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* ── Submission preview ── */}
        <div className="rounded-xl bg-white/5 border border-white/6 p-4 mb-5">
          <div className="flex items-center justify-between text-[10px] text-slate-dark mb-2">
            <span>
              Submitted {formatDate(submission.submitted_at)}
            </span>
            {(() => {
              const timing = getSubmissionTiming(
                submission.submitted_at,
                submission.assignments?.due_date,
              );
              return timing?.late ? (
                <span className="text-coral font-semibold">
                  {timing.label}
                </span>
              ) : null;
            })()}
            {submission.graded_at && (
              <span className="text-teal">
                Already graded {formatDate(submission.graded_at)}
              </span>
            )}
          </div>

          {submission.submission_text && (
            <p className="text-sm text-slate leading-relaxed whitespace-pre-wrap">
              {submission.submission_text}
            </p>
          )}

          {hasFile && (
            <div className="mt-3">
              {fileUrl ? (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-violet-light hover:text-violet transition-colors"
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656l-6.586 6.586a6 6 0 008.486 8.486L20.5 13"
                    />
                  </svg>
                  <span>{submission.file_name}</span>
                  <svg
                    className="w-3 h-3 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ) : (
                <p className="text-xs text-slate-dark">{submission.file_name}</p>
              )}
            </div>
          )}

          {!submission.submission_text && !hasFile && (
            <p className="text-xs text-slate-dark italic">No content submitted</p>
          )}
        </div>

        {/* ── Grading form ── */}
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-xs font-semibold text-slate uppercase tracking-wider">
              Score (0 – {maxScore})
            </span>
            <input
              type="number"
              min="0"
              max={maxScore}
              step="1"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
              className="mt-1.5 w-full px-3 py-2 rounded-lg text-sm
                         bg-white/5 border border-white/8 text-white
                         placeholder:text-slate-dark outline-none
                         focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                         transition-all"
              placeholder={`0 – ${maxScore}`}
            />
          </label>

          <label className="block mb-5">
            <span className="text-xs font-semibold text-slate uppercase tracking-wider">
              Feedback (optional)
            </span>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="mt-1.5 w-full px-3 py-2 rounded-lg text-sm
                         bg-white/5 border border-white/8 text-white
                         placeholder:text-slate-dark outline-none resize-none
                         focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                         transition-all"
              placeholder="Add feedback for the student…"
            />
          </label>

          {/* ── Actions ── */}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold
                         text-slate border border-border
                         hover:text-white hover:bg-glass-2 transition-all
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || score === ""}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
                         bg-teal hover:bg-teal-light transition-all
                         shadow-[0_4px_16px_rgba(40,167,139,0.3)]
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving…" : "Save Grade"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default GradeSubmissionModal;
