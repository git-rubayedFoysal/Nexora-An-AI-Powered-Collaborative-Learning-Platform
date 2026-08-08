/**
 * AssignmentDetail
 *
 * Detail page for a single assignment.
 * URL: /dashboard/assignments/:assignmentId
 *
 * Shared by teacher, admin, and student roles.
 * Fetches the assignment by ID and renders role-specific content:
 *  - Teacher/Admin: full details + submissions list + grade modal
 *  - Student: full details + submission form or submission status
 *
 * Responsibilities:
 *  - Fetch assignment data on mount
 *  - Fetch submissions (teacher) or own submission (student)
 *  - Clear assignment state on unmount to prevent stale data
 *  - Render loading/empty states and back navigation
 */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import {
  fetchAssignment,
  clearAssignment,
} from "../../features/assignment/assignmentSlice";
import {
  fetchAssignmentSubmissions,
  fetchMySubmission,
  clearAssignmentSubmissions,
  gradeSubmission,
} from "../../features/assignment/assignmentSubmissionSlice";
import { LoadingState } from "../../components/index";
import AssignmentDetailCard from "../../components/Dashboard/Teacher/Assignment/AssignmentDetailCard";
import AssignmentTeacherSection from "../../components/Dashboard/Teacher/Assignment/AssignmentTeacherSection";
import AssignmentStudentSection from "../../components/Dashboard/Teacher/Assignment/AssignmentStudentSection";
import GradeSubmissionModal from "../Grade/GradeSubmissionModal";

function AssignmentDetail() {
  const { assignmentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Local state ──
  const [gradeTarget, setGradeTarget] = useState(null);

  // ── Redux selectors ──
  const { assignment, loading } = useSelector((state) => state.assignment);
  const { assignmentSubmissions, mySubmission, loading: submissionLoading } =
    useSelector((state) => state.assignmentSubmission);
  const { userData } = useSelector((state) => state.auth);

  // ── Role detection ──
  const role = userData?.role?.toLowerCase();
  const isTeacher = role === "teacher" || role === "admin";
  const isStudent = role === "student";

  // ── Fetch assignment on mount ──
  useEffect(() => {
    dispatch(fetchAssignment({ assignmentId }));

    return () => {
      dispatch(clearAssignment());
    };
  }, [dispatch, assignmentId]);

  // ── Fetch role-specific data ──
  useEffect(() => {
    if (!assignmentId) return;

    if (isTeacher) {
      dispatch(clearAssignmentSubmissions());
      dispatch(fetchAssignmentSubmissions({ assignmentId }));
    } else if (isStudent) {
      dispatch(fetchMySubmission({ assignmentId }));
    }
  }, [dispatch, assignmentId, isTeacher, isStudent]);

  // ── Grade handler ──
  async function handleGrade({ score, feedback }) {
    try {
      await dispatch(
        gradeSubmission({ submissionId: gradeTarget.id, score, feedback }),
      ).unwrap();
      setGradeTarget(null);
    } catch (err) {
      console.error("Grade failed:", err);
    }
  }

  // ── Loading state ──
  if (loading || !assignment) {
    return (
      <div className="mb-8">
        <LoadingState color="--color-amber" content="assignment..." />
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* ── Back button ── */}
      <button
        onClick={() => navigate("/dashboard/assignments")}
        className="flex items-center gap-1.5 text-xs text-slate hover:text-white transition-colors mb-6 cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Assignments
      </button>

      {/* ── Assignment detail card (shared) ── */}
      <AssignmentDetailCard assignment={assignment} />

      {/* ── Role-specific section ── */}
      <div className="mt-5">
        {isTeacher && (
          <AssignmentTeacherSection
            submissions={assignmentSubmissions}
            maxScore={assignment.max_score}
            dueDate={assignment.due_date}
            onGrade={setGradeTarget}
          />
        )}

        {isStudent && (
          <AssignmentStudentSection
            assignmentId={assignmentId}
            mySubmission={mySubmission}
            loading={submissionLoading}
            assignment={assignment}
          />
        )}
      </div>

      {/* ── Grade modal ── */}
      {isTeacher && (
        <GradeSubmissionModal
          key={gradeTarget?.id}
          isOpen={Boolean(gradeTarget)}
          onClose={() => setGradeTarget(null)}
          onGrade={handleGrade}
          submission={gradeTarget}
          loading={submissionLoading}
        />
      )}
    </div>
  );
}

export default AssignmentDetail;
