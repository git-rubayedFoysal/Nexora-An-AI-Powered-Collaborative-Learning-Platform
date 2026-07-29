import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourseModules,
  deleteModule,
} from "../../features/module/moduleSlice";
import { DeleteConfirmModal } from "../../components";

function CourseCurriculum({ courseId, handleModal }) {
  const dispatch = useDispatch();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { userData } = useSelector((s) => s.auth);
  const { modules } = useSelector((s) => s.module);

  const isTeacher = userData?.role?.toLowerCase() === "teacher";
  const isAdmin = userData?.role?.toLowerCase() === "admin";
  const isStudent = userData?.role?.toLowerCase() === "student";
  const isEmpty = modules.length === 0;

  useEffect(() => {
    dispatch(fetchCourseModules({ courseId }));
  }, [dispatch, courseId]);

  async function handleDelete() {
    await dispatch(deleteModule({ moduleId: deleteTarget.id }));
    setDeleteTarget(null);
  }

  if (isEmpty) {
    return (
      <>
        <div
          className="flex flex-col items-center justify-center py-10 gap-3
                        rounded-xl border border-dashed border-border-2 bg-glass"
        >
          <span className="text-3xl">📋</span>
          <p className="text-sm font-semibold text-white">No curriculum yet</p>
          <p className="text-xs text-slate-dark text-center max-w-xs">
            Lessons and modules will appear here once the instructor publishes
            course content.
          </p>

          {(isTeacher || isAdmin) && (
            <button
              className="btn-primary py-2.5 px-5 rounded-xl text-xs font-semibold text-white"
              onClick={handleModal}
            >
              + Create First Module
            </button>
          )}
        </div>
        <DeleteConfirmModal
          isOpen={Boolean(deleteTarget)}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          itemName={deleteTarget?.title}
          feature="Module"
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {modules.map((mod, idx) => (
          <div
            key={mod.id}
            className="group flex items-center justify-between gap-3 px-4 py-3
                         rounded-xl border border-white/8 bg-glass-2
                         hover:border-white/15 transition-colors"
          >
            {/* Left: index + title */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[10px] font-mono text-slate-dark w-5 text-right shrink-0">
                {String(mod.position).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {mod.title}
                </p>
                {mod.description && (
                  <p className="text-[11px] text-slate-dark truncate mt-0.5">
                    {mod.description}
                  </p>
                )}
              </div>
            </div>

            {/* Right: actions (teacher & admin only) */}
            {!isStudent && (
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Edit button */}
                <button
                  className="p-1.5 rounded-lg border border-white/10 text-slate
                             hover:text-teal hover:border-teal/30 transition-colors"
                  title="Edit module"
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
                </button>

                {/* Delete button */}
                <button
                  className="p-1.5 rounded-lg border border-white/10 text-slate
                             hover:text-coral hover:border-coral/30 transition-colors"
                  title="Delete module"
                  onClick={() => setDeleteTarget(mod)}
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
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        itemName={deleteTarget?.title}
        feature="Module"
      />
    </>
  );
}

export default CourseCurriculum;
