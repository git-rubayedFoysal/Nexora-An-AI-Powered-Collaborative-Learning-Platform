/**
 * StudentAssignments
 *
 * Page component for the student's assignment dashboard.
 * Shows all assignments from enrolled courses with submission status.
 *
 * Responsibilities:
 *  - Fetch enrolled courses on mount
 *  - Fetch assignments for each enrolled course
 *  - Fetch student's submissions to show status
 *  - Display assignment cards with course/module tags, due date, and status
 *  - Navigate to assignment detail on click
 */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchMyEnrollments } from "../../features/enroll/enrollSlice";
import { fetchMySubmissions } from "../../features/assignment/assignmentSubmissionSlice";
import assignmentService from "../../services/supabase/assignment/assignment.service";
import { LoadingState, EmptyState } from "../../components/index";
import formatDate from "../../utils/formatDate";
import getSubmissionTiming from "../../utils/submissionTiming";

function StudentAssignments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Local state for assignments (fetched per course) ──
  const [assignments, setAssignments] = useState([]);

  // ── Redux selectors ──
  const { myEnrollments, loading: enrollmentsLoading } = useSelector(
    (state) => state.enroll,
  );
  const { mySubmissions, loading: submissionsLoading } = useSelector(
    (state) => state.assignmentSubmission,
  );

  // ── Build a map of assignmentId → submission for quick lookup ──
  const submissionMap = {};
  mySubmissions.forEach((sub) => {
    if (sub.assignment_id) {
      submissionMap[sub.assignment_id] = sub;
    }
  });

  // ── Track whether assignments have been fetched ──
  const [assignmentsFetched, setAssignmentsFetched] = useState(false);

  // ── Fetch enrollments + submissions on mount ──
  useEffect(() => {
    dispatch(fetchMyEnrollments({ page: 1 }));
    dispatch(fetchMySubmissions());
  }, [dispatch]);

  // ── Fetch assignments once enrollments are loaded ──
  useEffect(() => {
    if (
      enrollmentsLoading ||
      myEnrollments.length === 0 ||
      assignmentsFetched
    ) {
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const courseIds = myEnrollments.map((e) => e.course_id);
        const results = await Promise.all(
          courseIds.map((courseId) =>
            assignmentService
              .getCourseAssignments({ courseId })
              .catch(() => []),
          ),
        );
        if (cancelled) return;
        // Flatten and sort by due date
        const all = results.flat().sort((a, b) => {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date) - new Date(b.due_date);
        });
        setAssignments(all);
        setAssignmentsFetched(true);
      } catch {
        if (!cancelled) {
          setAssignments([]);
          setAssignmentsFetched(true);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [enrollmentsLoading, myEnrollments, assignmentsFetched]);

  const isLoading =
    enrollmentsLoading || submissionsLoading || !assignmentsFetched;

  // ── Get submission status for an assignment ──
  function getSubmissionStatus(assignmentId) {
    const sub = submissionMap[assignmentId];
    if (!sub) return null;
    return {
      status: sub.status,
      score: sub.score,
      submittedAt: sub.submitted_at,
    };
  }

  return (
    <div className="mb-8">
      {/* ── Page heading ── */}
      <div className="mb-12">
        <h1 className="text-2xl font-bold mb-4 font-display">
          My <span className="gradient-text">Assignments</span>
        </h1>
        <span
          className="animate-pulse-teal inline-flex items-center gap-1.5 px-3 py-1
                         rounded-full text-xs font-semibold bg-teal/10 text-teal
                         border border-teal/25 font-mono"
        >
          ● STUDENT
        </span>
      </div>

      {/* ── Loading state ── */}
      {isLoading && (
        <LoadingState color="--color-teal" content="assignments..." />
      )}

      {/* ── Empty state ── */}
      {!isLoading && assignments.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No assignments yet."
          description="Assignments will appear here once your instructors publish them."
          buttonText="Browse Courses"
          noButton={false}
          onButtonClick={() => navigate("/courses")}
        />
      ) : (
        /* ── Assignment grid ── */
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {assignments.map((assignment) => {
            const submission = getSubmissionStatus(assignment.id);
            const courseName = assignment.modules?.courses?.title ?? "—";
            const moduleName = assignment.modules?.title ?? "—";
            const isOverdue =
              assignment.due_date && new Date(assignment.due_date) < new Date();

            return (
              <div
                key={assignment.id}
                onClick={() =>
                  navigate(`/dashboard/assignments/${assignment.id}`)
                }
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

                {/* ── Meta row (date, score, status) ── */}
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono">
                  {/* Due date */}
                  <span
                    className={`flex items-center gap-1 ${isOverdue && !submission ? "text-coral" : "text-slate-dark"}`}
                  >
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
                  <span className="flex items-center gap-1 text-slate-dark">
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

                  {/* Submission status */}
                  {submission ? (
                    <span
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        submission.status === "graded"
                          ? "bg-teal/15 text-teal"
                          : "bg-amber/15 text-amber"
                      }`}
                    >
                      {submission.status === "graded"
                        ? `Graded: ${submission.score}`
                        : "Submitted"}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-coral/15 text-coral">
                      Not Submitted
                    </span>
                  )}

                  {/* Late badge */}
                  {submission &&
                    getSubmissionTiming(
                      submission.submittedAt,
                      assignment.due_date,
                    )?.late && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-coral/15 text-coral border border-coral/25">
                        {getSubmissionTiming(
                          submission.submittedAt,
                          assignment.due_date,
                        ).label}
                      </span>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentAssignments;
