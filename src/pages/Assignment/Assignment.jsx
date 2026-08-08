/**
 * TeacherAssignments
 *
 * Page component for the teacher's assignment dashboard.
 * Manages state (modals, targets) and composes AssignmentCard,
 * TeacherAssignmentModal, and DeleteConfirmModal.
 *
 * Responsibilities:
 *  - Fetch all assignments for the authenticated teacher on mount
 *  - Handle create, edit, delete operations
 *  - Render loading/empty states and assignment grid
 */

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchMyAssignments,
  deleteAssignment,
} from "../../features/assignment/assignmentSlice";
import {
  Button,
  DeleteConfirmModal,
  LoadingState,
  EmptyState,
  TeacherAssignmentModal,
} from "../../components/index";
import AssignmentCard from "../../components/Dashboard/Teacher/Assignment/AssignmentCard";

function TeacherAssignments() {
  const dispatch = useDispatch();

  // ── Modal / target state ──
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Redux selectors ──
  const { myAssignments, loading } = useSelector((state) => state.assignment);

  // ── Fetch assignments on mount ──
  useEffect(() => {
    dispatch(fetchMyAssignments());
  }, [dispatch]);

  // ── Handlers ──
  function handleCreate() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function handleEdit(assignment) {
    setEditTarget(assignment);
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
    setEditTarget(null);
  }

  async function handleDelete() {
    try {
      await dispatch(
        deleteAssignment({
          assignmentId: deleteTarget.id,
          attachmentPath: deleteTarget.attachment_path,
        }),
      ).unwrap();
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="mb-8">
      {/* ── Page heading ── */}
      <div className="mb-12 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4 font-display">
            My <span className="gradient-text">Assignments</span>
          </h1>
          <span
            className="animate-pulse-amber inline-flex items-center gap-1.5 px-3 py-1
                           rounded-full text-xs font-semibold bg-amber/10 text-amber
                           border border-amber/25 font-mono"
          >
            ● TEACHER
          </span>
        </div>

        <Button
          onClick={handleCreate}
          className="btn-ghost flex items-center gap-2 bg-amber/10 text-amber
                     border border-amber/25 px-5 py-2.5 text-sm shrink-0"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Assignment
        </Button>
      </div>

      {/* ── Loading state ── */}
      {loading && (
        <LoadingState color="--color-amber" content="assignments..." />
      )}

      {/* ── Empty state ── */}
      {myAssignments.length === 0 && !loading ? (
        <EmptyState
          icon="📝"
          title="You haven't created any assignments yet."
          description="Create your first assignment and start collecting student work."
          buttonText="Create Assignment"
          noButton={false}
          onButtonClick={handleCreate}
        />
      ) : (
        /* ── Assignment grid ── */
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {myAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      <TeacherAssignmentModal
        open={modalOpen}
        onClose={handleModalClose}
        assignment={editTarget}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.title}
        loading={loading}
        feature="assignment"
      />
    </div>
  );
}

export default TeacherAssignments;
