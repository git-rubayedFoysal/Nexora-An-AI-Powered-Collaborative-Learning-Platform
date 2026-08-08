/**
 * AssignmentStudentSection
 *
 * Student-facing section on the assignment detail page.
 * Handles three states:
 *  - Not submitted: shows the submit form (text + optional file upload)
 *  - Submitted (pending): shows submission confirmation with timestamp
 *  - Graded: shows score, feedback, and graded timestamp
 *
 * Props:
 *  - assignmentId  — the assignment ID (used for submission)
 *  - mySubmission  — the student's submission for this assignment (null if not submitted)
 *  - loading       — whether the submission data is still loading
 */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { submitAssignment } from "../../../../features/assignment/assignmentSubmissionSlice";
import { Button, Textarea } from "../../../index";
import formatDate from "../../../../utils/formatDate";
import getSubmissionTiming from "../../../../utils/submissionTiming";
import submissionStorage from "../../../../services/supabase/assignment/submission.storage";

function AssignmentStudentSection({ assignmentId, mySubmission, loading, assignment }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [fileUrl, setFileUrl] = useState(null);

  const { loading: submissionLoading } = useSelector(
    (state) => state.assignmentSubmission,
  );

  // ── Fetch signed URL for the submission file ──
  useEffect(() => {
    if (!mySubmission?.file_path) return undefined;

    let cancelled = false;

    async function loadFileUrl() {
      try {
        const url = await submissionStorage.getSubmissionUrl(
          mySubmission.file_path,
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
  }, [mySubmission?.file_path]);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  // ── Submit handler ──
  async function onSubmit(data) {
    setSubmitError("");
    try {
      await dispatch(
        submitAssignment({
          assignmentId,
          submissionText: data.submissionText,
          fileName: file?.name ?? null,
          file: file ?? null,
        }),
      ).unwrap();
    } catch (error) {
      setSubmitError(error.message);
    }
  }

  // ── Loading state ──
  if (loading) {
    return (
      <div className="glass rounded-2xl border border-white/6 p-6 animate-pulse">
        <div className="h-5 bg-white/6 rounded w-1/3 mb-4" />
        <div className="h-20 bg-white/6 rounded mb-3" />
        <div className="h-10 bg-white/6 rounded w-1/4" />
      </div>
    );
  }

  // ── Graded state ──
  if (mySubmission?.status === "graded") {
    return (
      <div className="glass rounded-2xl border border-teal/25 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal/15 border border-teal/25">
            <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-display">Graded</h2>
            <p className="text-[11px] text-slate-dark">
              Graded on {formatDate(mySubmission.graded_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-slate">Score:</span>
          <span className="text-lg font-bold text-teal font-mono">
            {mySubmission.score}
          </span>
          {getSubmissionTiming(
            mySubmission.submitted_at,
            mySubmission.assignments?.due_date,
          )?.late && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-coral/15 text-coral border border-coral/25">
              {getSubmissionTiming(
                mySubmission.submitted_at,
                mySubmission.assignments?.due_date,
              ).label}
            </span>
          )}
        </div>

        {mySubmission.feedback && (
          <div className="mb-3">
            <p className="text-xs text-slate mb-1">Feedback:</p>
            <p className="text-sm text-slate leading-relaxed bg-glass rounded-xl px-4 py-3">
              {mySubmission.feedback}
            </p>
          </div>
        )}

        {mySubmission.file_name && (
          <div>
            <p className="text-xs text-slate mb-1">Submitted File:</p>
            {fileUrl ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-violet-light hover:text-violet transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656l-6.586 6.586a6 6 0 008.486 8.486L20.5 13" />
                </svg>
                <span>{mySubmission.file_name}</span>
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <p className="text-xs text-slate-dark">{mySubmission.file_name}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Submitted (pending review) state ──
  if (mySubmission) {
    return (
      <div className="glass rounded-2xl border border-amber/25 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber/15 border border-amber/25">
            <svg className="w-5 h-5 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-display">
              Submitted
            </h2>
            <p className="text-[11px] text-slate-dark">
              Submitted on {formatDate(mySubmission.submitted_at)}
            </p>
          </div>
        </div>
        <p className="text-xs text-amber mb-2">Pending Review</p>
        {getSubmissionTiming(
          mySubmission.submitted_at,
          mySubmission.assignments?.due_date,
        )?.late && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-coral/15 text-coral border border-coral/25 mb-2">
            {getSubmissionTiming(
              mySubmission.submitted_at,
              mySubmission.assignments?.due_date,
            ).label}
          </span>
        )}

        {mySubmission.file_name && (
          <div>
            <p className="text-xs text-slate mb-1">Submitted File:</p>
            {fileUrl ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-violet-light hover:text-violet transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656l-6.586 6.586a6 6 0 008.486 8.486L20.5 13" />
                </svg>
                <span>{mySubmission.file_name}</span>
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <p className="text-xs text-slate-dark">{mySubmission.file_name}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Not submitted: show submit form ──
  const isPastDue =
    assignment?.due_date && new Date(assignment.due_date) < new Date();

  return (
    <div className="glass rounded-2xl border border-white/6 p-6">
      <h2 className="text-sm font-bold text-white font-display mb-4">
        Submit Your Assignment
      </h2>

      {isPastDue && (
        <div className="flex items-start gap-3 rounded-2xl border border-coral/25 bg-coral-dim px-5 py-4 mb-4">
          <svg className="w-4 h-4 text-coral shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-coral font-medium">Deadline has passed</p>
            <p className="text-xs text-coral/70 mt-0.5">
              This assignment was due on {formatDate(assignment.due_date)}. You can still submit, but it will be marked as late.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {submitError && (
          <div className="flex items-start gap-3 rounded-2xl border border-coral/25 bg-coral-dim px-5 py-4">
            <svg className="w-4 h-4 text-coral shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-coral leading-relaxed">{submitError}</p>
          </div>
        )}

        {/* ── Response text ── */}
        <div>
          <label className="block text-[11px] font-semibold text-slate uppercase tracking-wider mb-1.5">
            Your Response
          </label>
          <Textarea
            placeholder="Write your response here..."
            rows={5}
            {...register("submissionText", {
              required: "Response is required",
            })}
          />
          {errors?.submissionText && (
            <p className="mt-1.5 text-xs text-coral font-mono">
              {errors.submissionText.message}
            </p>
          )}
        </div>

        {/* ── File upload ── */}
        <div>
          <label className="block text-[11px] font-semibold text-slate uppercase tracking-wider mb-1.5">
            Attach File (optional)
          </label>
          {file ? (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-glass px-4 py-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet/15 border border-violet/25 shrink-0">
                <svg className="w-5 h-5 text-violet-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white font-medium truncate">
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-dark">
                  {file.size.toLocaleString()} bytes
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-1.5 rounded-lg text-slate hover:text-coral hover:bg-coral-dim transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-2 bg-glass py-6 px-4 text-center hover:border-violet/40 hover:bg-glass-2 transition-all cursor-pointer">
              <svg className="w-7 h-7 text-slate-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm text-slate font-medium">
                  Upload a file
                </p>
                <p className="text-xs text-slate-dark mt-0.5">
                  Any file type, max 10 MB
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected) {
                    if (selected.size > 10 * 1024 * 1024) {
                      setSubmitError("File must be under 10 MB.");
                      return;
                    }
                    setFile(selected);
                    setSubmitError("");
                  }
                }}
              />
            </label>
          )}
        </div>

        {/* ── Submit button ── */}
        <Button
          type="submit"
          disabled={isSubmitting || submissionLoading}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-violet hover:bg-violet-dark shadow-[0_4px_16px_rgba(124,90,247,0.3)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting || submissionLoading ? "Submitting..." : "Submit Assignment"}
        </Button>
      </form>
    </div>
  );
}

export default AssignmentStudentSection;
