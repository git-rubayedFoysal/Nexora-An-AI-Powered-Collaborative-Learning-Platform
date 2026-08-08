/**
 * AdminContent
 *
 * Dashboard home for admins.
 * Shows real platform stats, user breakdown, and course overview.
 *
 * Props:
 *  - role — user role string
 */

import { fetchCourseStats, fetchAllCourses } from "../../../features/course/courseSlice";
import { fetchUserStats } from "../../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function AdminContent({ role }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    totalUsers,
    totalStudents,
    totalTeachers,
    totalAdmins,
  } = useSelector((state) => state.auth);
  const {
    publishedCourses,
    draftCourses,
    archivedCourses,
    allCourses,
  } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(fetchCourseStats());
    dispatch(fetchUserStats());
    dispatch(fetchAllCourses({ page: 1 }));
  }, [dispatch]);

  const totalCourses = (publishedCourses || 0) + (draftCourses || 0) + (archivedCourses || 0);

  // Compute percentages for role breakdown
  const studentPct = totalUsers > 0 ? Math.round((totalStudents / totalUsers) * 100) : 0;
  const teacherPct = totalUsers > 0 ? Math.round((totalTeachers / totalUsers) * 100) : 0;
  const adminPct = totalUsers > 0 ? Math.round((totalAdmins / totalUsers) * 100) : 0;

  return (
    <>
      {/* Greeting */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold mb-2 font-display">
          Platform Overview <span className="gradient-text">⚙️</span>
        </h1>
        <span className="animate-pulse-coral inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-coral/10 text-coral border border-coral/25 font-mono">
          ● {role.toUpperCase()}
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          {
            icon: "👥",
            value: totalUsers || 0,
            label: "Total users",
            valueColor: "text-coral",
          },
          {
            icon: "📚",
            value: totalCourses,
            label: "Total courses",
            valueColor: "text-amber",
          },
          {
            icon: "🟢",
            value: totalStudents || 0,
            label: "Students",
            valueColor: "text-teal",
          },
          {
            icon: "🟡",
            value: totalTeachers || 0,
            label: "Teachers",
            valueColor: "text-violet-light",
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
            icon: "📚",
            label: "Manage Courses",
            path: "/dashboard/manage-courses",
          },
          {
            icon: "📊",
            label: "View Stats",
            path: "/dashboard/manage-courses",
          },
          {
            icon: "👥",
            label: "Users",
            path: "/dashboard",
          },
          {
            icon: "⚙️",
            label: "Settings",
            path: "/dashboard",
          },
        ].map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.path)}
            className="feature-card glass rounded-2xl cursor-pointer p-4 text-center border border-white/6"
          >
            <div className="text-2xl mb-2">{a.icon}</div>
            <div className="text-xs font-semibold text-slate">{a.label}</div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Users by Role */}
        <div className="glass rounded-2xl p-5 border border-white/6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold">Users by Role</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-coral/15 text-coral font-semibold">
              {totalUsers || 0} total
            </span>
          </div>
          <div className="space-y-4">
            {[
              {
                label: "🟢 Students",
                count: `${totalStudents || 0} · ${studentPct}%`,
                pct: studentPct,
                color: "bg-teal",
                textColor: "text-teal",
              },
              {
                label: "🟡 Teachers",
                count: `${totalTeachers || 0} · ${teacherPct}%`,
                pct: teacherPct,
                color: "bg-amber",
                textColor: "text-amber",
              },
              {
                label: "🔴 Admins",
                count: `${totalAdmins || 0} · ${adminPct}%`,
                pct: adminPct,
                color: "bg-coral",
                textColor: "text-coral",
              },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-xs mb-2">
                  <span className={`${row.textColor} font-semibold`}>
                    {row.label}
                  </span>
                  <span className="text-slate font-mono">{row.count}</span>
                </div>
                <div className="prog h-2">
                  <div
                    className={`prog-fill ${row.color}`}
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Overview */}
        <div className="glass rounded-2xl p-5 border border-white/6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">Course Overview</h2>
            <button
              onClick={() => navigate("/dashboard/manage-courses")}
              className="text-xs text-violet-light hover:text-violet transition-colors cursor-pointer"
            >
              Manage →
            </button>
          </div>

          {/* Course status breakdown */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {
                label: "Published",
                value: publishedCourses || 0,
                color: "text-teal",
                bg: "bg-teal/10",
              },
              {
                label: "Draft",
                value: draftCourses || 0,
                color: "text-amber",
                bg: "bg-amber/10",
              },
              {
                label: "Archived",
                value: archivedCourses || 0,
                color: "text-slate",
                bg: "bg-white/5",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.bg} rounded-xl p-3 text-center`}
              >
                <div className={`text-xl font-black font-mono ${s.color}`}>
                  {s.value}
                </div>
                <div className="text-[10px] text-slate mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent courses */}
          <h3 className="text-xs font-bold mb-3">Recent Courses</h3>
          {allCourses.length === 0 ? (
            <p className="text-xs text-slate-dark text-center py-3">
              No courses found.
            </p>
          ) : (
            <div className="space-y-2">
              {allCourses.slice(0, 5).map((course, i, arr) => (
                <div
                  key={course.id}
                  className={`flex items-center gap-3 py-2 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white truncate">
                      {course.title}
                    </div>
                    <div className="text-[10px] text-slate">
                      {course.users?.full_name || "Unknown teacher"}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      course.status === "published"
                        ? "bg-teal/15 text-teal"
                        : course.status === "draft"
                          ? "bg-amber/15 text-amber"
                          : "bg-white/10 text-slate"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminContent;
