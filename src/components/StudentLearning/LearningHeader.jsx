import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { fetchEnrollment } from "../../features/enroll/enrollSlice";

/**
 * LearningHeader — Compact sticky header below the main navbar.
 *
 * Left: back arrow + course title + instructor.
 * Right: lesson count + progress bar.
 */
function LearningHeader({ selectedCourse, totalLessons, courseId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentEnrollment } = useSelector((s) => s.enroll);

  useEffect(() => {
    dispatch(fetchEnrollment(courseId));
  }, [dispatch, courseId]);

  return (
    <div className="sticky top-17 z-40 glass border-b border-white/6">
      <div className="flex items-center justify-between h-12 px-4 lg:px-6">
        {/* Left: back arrow + course title + instructor */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/dashboard/my-learning")}
            className="p-1.5 -ml-1.5 rounded-lg text-slate hover:text-white hover:bg-white/6 transition-colors shrink-0"
            aria-label="Back to My Learning"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white font-display truncate">
              {selectedCourse?.title}
            </h1>
            {selectedCourse?.users?.full_name && (
              <p className="text-[11px] text-slate truncate">
                by {selectedCourse.users.full_name}
              </p>
            )}
          </div>
        </div>
        {/* Right: lesson count + progress bar */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[10px] font-mono text-slate-dark">
            {totalLessons} lesson{totalLessons !== 1 && "s"}
          </span>
          <div className="flex items-center gap-2 w-24">
            <div className="prog flex-1 h-1.5">
              <div
                className="prog-fill bg-teal"
                style={{ width: `${currentEnrollment?.progress ?? 0}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-teal font-bold shrink-0">
              {Math.round(currentEnrollment?.progress ?? 0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearningHeader;
