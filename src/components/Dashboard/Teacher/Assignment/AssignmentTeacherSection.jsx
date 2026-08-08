/**
 * AssignmentTeacherSection
 *
 * Displays the list of student submissions for a teacher viewing an assignment detail.
 * Shows student name, submission status, score, submitted date, and a grade button.
 *
 * Props:
 *  - submissions   — array of submission objects (with users join)
 *  - maxScore      — the assignment's max_score for display
 *  - onGrade       — callback(submission) to open the grade modal
 */

import formatDate from "../../../../utils/formatDate";
import getSubmissionTiming from "../../../../utils/submissionTiming";

function AssignmentTeacherSection({ submissions, maxScore, dueDate, onGrade }) {
  return (
    <div className="glass rounded-2xl border border-white/6 p-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber/15 border border-amber/25 shrink-0">
          <svg className="w-6 h-6 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white font-display">
              Submissions
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber/15 text-amber font-mono">
              {submissions.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-dark mt-0.5">
            Students who submitted to this assignment
          </p>
        </div>
      </div>

      {/* ── Empty state ── */}
      {submissions.length === 0 ? (
        <p className="text-xs text-slate-dark text-center py-6">
          No submissions yet.
        </p>
      ) : (
        /* ── Submissions table ── */
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                {["Student", "Submitted", "Late", "Status", "Score", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-dark border-b border-white/6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map((s, i, arr) => {
                const isGraded = s.status === "graded";
                const timing = getSubmissionTiming(s.submitted_at, dueDate);
                return (
                  <tr key={s.id} className="nx-tr">
                    <td
                      className={`py-2.5 px-3 text-white font-medium ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                    >
                      {s.users?.full_name || "—"}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-slate-dark ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                    >
                      {formatDate(s.submitted_at)}
                    </td>
                    <td
                      className={`py-2.5 px-3 ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                    >
                      {timing?.late ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-coral/15 text-coral border border-coral/25">
                          {timing.label}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-dark">On time</span>
                      )}
                    </td>
                    <td
                      className={`py-2.5 px-3 ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                    >
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isGraded
                            ? "bg-teal/15 text-teal"
                            : "bg-amber/15 text-amber"
                        }`}
                      >
                        {isGraded ? "Graded" : "Ungraded"}
                      </span>
                    </td>
                    <td
                      className={`py-2.5 px-3 font-mono ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                    >
                      {s.score != null
                        ? `${s.score} / ${maxScore ?? "—"}`
                        : "—"}
                    </td>
                    <td
                      className={`py-2.5 px-3 ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                    >
                      <button
                        onClick={() => onGrade(s)}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-semibold
                                   bg-teal/10 text-teal border border-teal/25
                                   hover:bg-teal/20 transition-all cursor-pointer"
                      >
                        {isGraded ? "Re-grade" : "Grade"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AssignmentTeacherSection;
