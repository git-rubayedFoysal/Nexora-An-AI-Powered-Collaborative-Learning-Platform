/**
 * CourseSidebar
 *
 * Right sidebar (1/3 width on desktop, stacks on mobile).
 * Contains: price/enrollment status, CTA button, quick stats, instructor card.
 *
 * Props:
 *  - course            — the course object
 *  - currentEnrollment — enrollment object (null if not enrolled)
 *  - isFree            — whether the course is free
 *  - isTeacher         — whether current user is the course teacher
 *  - isAdmin           — whether current user is an admin
 *  - studentCount      — number of enrolled students
 *  - courseId          — the course ID (for navigation)
 */

import { useNavigate } from "react-router";

function CourseSidebar({
  course,
  currentEnrollment,
  isFree,
  isTeacher,
  isAdmin,
  studentCount,
  courseId,
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 lg:self-start">
      <div className="glass rounded-2xl border border-border p-5 sm:p-6">
        {/* Price / enrollment status */}
        <div className="mb-5 text-center">
          {!currentEnrollment ? (
            <div>
              <span
                className={`text-3xl font-black font-mono ${isFree ? "text-teal" : "text-amber"}`}
              >
                {isFree ? "Free" : `৳${course?.price}`}
              </span>
              {!isFree && (
                <p className="text-xs text-slate-dark mt-0.5">
                  One-time payment · Lifetime access
                </p>
              )}
            </div>
          ) : (
            <p className="tag bg-teal-dim border border-teal/25 text-teal font-bold">
              ✔ You're already enrolled in this course.
            </p>
          )}
        </div>

        {/* Primary CTA button */}
        {isTeacher || isAdmin ? (
          <button
            onClick={() => navigate(`/dashboard/edit-course/${course.id}`)}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-amber hover:bg-amber/90 transition-all shadow-[0_4px_16px_rgba(245,166,35,.3)] mb-3"
          >
            Edit Course
          </button>
        ) : !currentEnrollment ? (
          <button
            onClick={() => navigate(`/courses/${courseId}/checkout`)}
            className="btn-primary w-full py-3 rounded-xl text-sm font-semibold text-white mb-3"
          >
            {isFree ? "Enroll for Free" : "Enroll Now"}
          </button>
        ) : (
          <button
            onClick={() => navigate("/dashboard/my-learning")}
            className="btn-primary w-full py-3 rounded-xl text-sm font-semibold text-white mb-3"
          >
            Start Learning
          </button>
        )}

        {/* Go Back button */}
        <button
          onClick={() => navigate(-1)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate border border-border hover:text-white hover:bg-glass-2 transition-all"
        >
          Go Back
        </button>

        {/* Quick stats */}
        <div className="mt-5 pt-5 border-t border-border space-y-3">
          {[
            { icon: "📚", label: "Category", value: course.category ?? "—", access: "all" },
            { icon: "📶", label: "Level", value: course.level ?? "—", access: "all" },
            { icon: "👥", label: "Enrolled", value: `${studentCount} students`, access: "teacher" },
            { icon: "🎥", label: "Lessons", value: course.lesson_count ?? 0, access: "all" },
            { icon: "⏱️", label: "Duration", value: course.duration ? `${course.duration}h` : "TBA", access: "all" },
          ].map(
            (row) =>
              (row.access === "all" || isTeacher) && (
                <div key={row.label} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate flex items-center gap-1.5 shrink-0">
                    <span>{row.icon}</span> {row.label}
                  </span>
                  <span className="text-xs font-semibold text-white font-mono text-right truncate">
                    {row.value}
                  </span>
                </div>
              ),
          )}
        </div>
      </div>

      {/* Instructor card */}
      <div className="glass rounded-2xl border border-border p-5">
        <p className="text-[10px] font-mono text-slate-dark uppercase tracking-widest mb-3">
          Instructor
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet to-teal flex items-center justify-center text-sm font-bold text-white shrink-0">
            {(course.users?.full_name ?? "I")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {course.users?.full_name ?? "Instructor"}
            </p>
            <p className="text-xs text-slate-dark truncate">
              {course.users?.email ?? ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseSidebar;
