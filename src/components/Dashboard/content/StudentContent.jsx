/**
 * StudentContent
 *
 * Dashboard home for students.
 * Shows real stats, enrolled courses, and upcoming assignments.
 *
 * Props:
 *  - role — user role string
 *  - user — user display name
 */

import { getGreeting } from "../../../utils/greeting";
import { fetchMyEnrollments } from "../../../features/enroll/enrollSlice";
import { fetchMySubmissions } from "../../../features/assignment/assignmentSubmissionSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import assignmentService from "../../../services/supabase/assignment/assignment.service";

function StudentContent({ role, user }) {
  const greeting = getGreeting();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { myEnrollments, totalCourses } = useSelector(
    (state) => state.enroll,
  );
  const { mySubmissions } = useSelector(
    (state) => state.assignmentSubmission,
  );

  const [dueSoon, setDueSoon] = useState([]);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    dispatch(fetchMyEnrollments({ page: 1 }));
    dispatch(fetchMySubmissions());
  }, [dispatch]);

  // Fetch assignments for enrolled courses to find due-soon ones
  useEffect(() => {
    if (myEnrollments.length === 0) return;

    let cancelled = false;

    async function load() {
      try {
        const courseIds = myEnrollments.map((e) => e.course_id);
        const results = await Promise.all(
          courseIds.map((id) =>
            assignmentService.getCourseAssignments({ courseId: id }).catch(() => []),
          ),
        );
        if (cancelled) return;

        const submittedIds = new Set(mySubmissions.map((s) => s.assignment_id));
        const now = new Date();

        const upcoming = results
          .flat()
          .filter((a) => a.due_date && new Date(a.due_date) > now && !submittedIds.has(a.id))
          .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
          .slice(0, 4);

        setDueSoon(upcoming);
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setDataReady(true);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [myEnrollments, mySubmissions]);

  // ── Derived stats ──
  const enrolledCount = totalCourses || myEnrollments.length;
  const submittedCount = mySubmissions.length;
  const gradedCount = mySubmissions.filter((s) => s.status === "graded").length;
  const avgProgress =
    myEnrollments.length > 0
      ? Math.round(
          myEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) /
            myEnrollments.length,
        )
      : 0;

  return (
    <>
      {/* Greeting */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold mb-2 font-display">
          Good {greeting}, <span className="gradient-text">{user}</span> 👋
        </h1>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal/10 text-teal border animate-pulse-teal border-teal/25 font-mono">
          ● {role.toUpperCase()}
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          {
            icon: "📚",
            value: enrolledCount,
            label: "Enrolled courses",
            valueColor: "text-teal",
          },
          {
            icon: "📝",
            value: submittedCount,
            label: "Submissions",
            valueColor: "text-violet-light",
          },
          {
            icon: "✅",
            value: gradedCount,
            label: "Graded",
            valueColor: "text-amber",
          },
          {
            icon: "📊",
            value: `${avgProgress}%`,
            label: "Avg progress",
            valueColor: "text-coral",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="stat-card glass rounded-2xl p-5 border border-white/6"
          >
            <div className="text-2xl mb-3">{card.icon}</div>
            <div
              className={`text-3xl font-black mb-1 font-mono ${card.valueColor}`}
            >
              {card.value}
            </div>
            <div className="text-xs text-slate font-medium">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Courses + Due Soon */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Enrolled Courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">My Courses</h2>
            {myEnrollments.length > 0 && (
              <button
                onClick={() => navigate("/dashboard/my-learning")}
                className="text-xs text-violet-light hover:text-violet transition-colors cursor-pointer"
              >
                View all →
              </button>
            )}
          </div>
          {myEnrollments.length === 0 ? (
            <div className="glass rounded-2xl p-6 border border-white/6 text-center">
              <p className="text-xs text-slate-dark">
                No enrolled courses yet. Browse courses to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {myEnrollments.slice(0, 4).map((enrollment) => {
                const course = enrollment.courses;
                const progress = enrollment.progress || 0;
                return (
                  <div
                    key={enrollment.id}
                    onClick={() => navigate(`/my-learning/${course?.id}`)}
                    className="course-card glass rounded-2xl overflow-hidden border border-white/6 cursor-pointer hover:border-white/12 transition-colors"
                  >
                    <div className="p-3.5">
                      <div className="text-xs font-bold text-white mb-0.5 line-clamp-1">
                        {course?.title || "Course"}
                      </div>
                      <div className="text-[10px] text-slate mb-2">
                        {course?.users?.full_name || "Instructor"}
                      </div>
                      <div className="prog mb-1">
                        <div
                          className="prog-fill bg-teal"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate font-mono">
                        {progress}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Due Soon */}
        <div className="glass rounded-2xl p-5 border border-white/6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">Due Soon</h2>
            {dueSoon.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-coral/15 text-coral font-semibold">
                {dueSoon.length} pending
              </span>
            )}
          </div>
          {!dataReady ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-12 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : dueSoon.length === 0 ? (
            <p className="text-xs text-slate-dark text-center py-4">
              No upcoming deadlines. 🎉
            </p>
          ) : (
            <div>
              {dueSoon.map((assignment, i) => {
                const due = new Date(assignment.due_date);
                const now = new Date();
                const daysLeft = Math.ceil(
                  (due - now) / (1000 * 60 * 60 * 24),
                );
                const badgeClass =
                  daysLeft <= 2
                    ? "bg-coral/15 text-coral"
                    : daysLeft <= 5
                      ? "bg-amber/15 text-amber"
                      : "bg-teal/15 text-teal";

                return (
                  <div
                    key={assignment.id}
                    onClick={() =>
                      navigate(`/dashboard/assignments/${assignment.id}`)
                    }
                    className={`flex items-center gap-3 py-2.5 cursor-pointer hover:bg-white/3 rounded-lg px-2 transition-colors ${
                      i < dueSoon.length - 1 ? "border-b border-white/5" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center text-sm shrink-0">
                      📝
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">
                        {assignment.title}
                      </div>
                      <div className="text-[10px] text-slate">
                        {assignment.modules?.courses?.title || ""}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${badgeClass}`}
                    >
                      {daysLeft <= 0
                        ? "Today"
                        : daysLeft === 1
                          ? "1 day"
                          : `${daysLeft} days`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentContent;
