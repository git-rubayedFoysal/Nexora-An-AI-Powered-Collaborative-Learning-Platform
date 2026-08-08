/**
 * TeacherContent
 *
 * Dashboard home for teachers.
 * Shows real stats, teacher's courses, and quick actions.
 *
 * Props:
 *  - role — user role string
 *  - user — user display name
 */

import { getGreeting } from "../../../utils/greeting";
import {
  fetchCourseStats,
  fetchAllTeacherCourses,
} from "../../../features/course/courseSlice";
import { fetchMyAssignments } from "../../../features/assignment/assignmentSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function TeacherContent({ role, user }) {
  const greeting = getGreeting();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { publishedCourses, draftCourses, allTeacherCourses } = useSelector(
    (state) => state.course,
  );
  const { myAssignments } = useSelector((state) => state.assignment);

  useEffect(() => {
    dispatch(fetchCourseStats());
    dispatch(fetchAllTeacherCourses());
    dispatch(fetchMyAssignments());
  }, [dispatch]);

  const courseCount = publishedCourses || 0;
  const assignmentCount = myAssignments.length;

  return (
    <>
      {/* Greeting */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold mb-2 font-display">
          Good {greeting}, <span className="gradient-text">{user}</span> 📋
        </h1>
        <span className="animate-pulse-amber inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber/10 text-amber border border-amber/25 font-mono">
          ● {role.toUpperCase()}
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          {
            icon: "📚",
            value: courseCount,
            label: "Active courses",
            valueColor: "text-amber",
          },
          {
            icon: "📝",
            value: assignmentCount,
            label: "Assignments",
            valueColor: "text-coral",
          },
          {
            icon: "👥",
            value: allTeacherCourses.length,
            label: "Total courses",
            valueColor: "text-violet-light",
          },
          {
            icon: "📋",
            value: draftCourses || 0,
            label: "Draft courses",
            valueColor: "text-teal",
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

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[
          {
            icon: "➕",
            label: "New Course",
            path: "/dashboard/create-course",
          },
          {
            icon: "📝",
            label: "Assignments",
            path: "/dashboard/assignments",
          },
          {
            icon: "✅",
            label: "Grade Center",
            path: "/dashboard/grade",
          },
          {
            icon: "📚",
            label: "My Courses",
            path: "/dashboard/my-courses",
          },
        ].map((a) => (
          <button
            key={a.label}
            className="feature-card glass rounded-2xl p-4 text-center border border-white/6 cursor-pointer"
            onClick={() => navigate(a.path)}
          >
            <div className="text-2xl mb-2">{a.icon}</div>
            <div className="text-xs font-semibold text-slate">{a.label}</div>
          </button>
        ))}
      </div>

      {/* My Courses */}
      <div className="glass rounded-2xl p-5 border border-white/6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold">My Courses</h2>
          {allTeacherCourses.length > 0 && (
            <button
              onClick={() => navigate("/dashboard/my-courses")}
              className="text-xs text-violet-light hover:text-violet transition-colors cursor-pointer"
            >
              View all →
            </button>
          )}
        </div>
        {allTeacherCourses.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-slate-dark mb-3">
              No courses yet. Create your first course to get started.
            </p>
            <button
              onClick={() => navigate("/dashboard/create-course")}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber/15 text-amber border border-amber/25 hover:bg-amber/25 transition-colors cursor-pointer"
            >
              + Create Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {allTeacherCourses.slice(0, 6).map((course) => (
              <div
                key={course.id}
                onClick={() => navigate("/dashboard/my-courses")}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/6 hover:border-white/12 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center text-lg shrink-0">
                  📚
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {course.title}
                  </div>
                  <div className="text-[10px] text-slate-dark">
                    View details →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default TeacherContent;
