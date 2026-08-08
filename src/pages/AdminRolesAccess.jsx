/**
 * AdminRolesAccess
 *
 * Admin page for managing roles and permissions.
 * Shows role breakdown, permission matrix, and role management.
 */

import { useSelector, useDispatch } from "react-redux";
import { fetchUserStats } from "../features/auth/authSlice";
import { useEffect } from "react";

const ROLE_PERMISSIONS = [
  { permission: "Browse courses", student: true, teacher: true, admin: true },
  {
    permission: "Enroll in courses",
    student: true,
    teacher: false,
    admin: true,
  },
  {
    permission: "View enrolled courses",
    student: true,
    teacher: true,
    admin: true,
  },
  {
    permission: "Submit assignments",
    student: true,
    teacher: false,
    admin: true,
  },
  { permission: "Take quizzes", student: true, teacher: false, admin: true },
  { permission: "Track progress", student: true, teacher: false, admin: true },
  { permission: "Create courses", student: false, teacher: true, admin: true },
  {
    permission: "Edit own courses",
    student: false,
    teacher: true,
    admin: true,
  },
  {
    permission: "Delete own courses",
    student: false,
    teacher: true,
    admin: true,
  },
  {
    permission: "Create assignments",
    student: false,
    teacher: true,
    admin: true,
  },
  {
    permission: "Grade submissions",
    student: false,
    teacher: true,
    admin: true,
  },
  {
    permission: "View grade center",
    student: false,
    teacher: true,
    admin: true,
  },
  {
    permission: "Manage all courses",
    student: false,
    teacher: false,
    admin: true,
  },
  { permission: "Manage users", student: false, teacher: false, admin: true },
  {
    permission: "Manage enrollments",
    student: false,
    teacher: false,
    admin: true,
  },
  { permission: "Assign roles", student: false, teacher: false, admin: true },
  {
    permission: "View platform stats",
    student: false,
    teacher: false,
    admin: true,
  },
  {
    permission: "Access audit logs",
    student: false,
    teacher: false,
    admin: true,
  },
];

function AdminRolesAccess() {
  const dispatch = useDispatch();
  const { totalUsers, totalStudents, totalTeachers, totalAdmins } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    dispatch(fetchUserStats());
  }, [dispatch]);

  const total = totalUsers || 0;
  const studentPct = total > 0 ? Math.round((totalStudents / total) * 100) : 0;
  const teacherPct = total > 0 ? Math.round((totalTeachers / total) * 100) : 0;
  const adminPct = total > 0 ? Math.round((totalAdmins / total) * 100) : 0;

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-6 font-display">
        Roles & <span className="gradient-text">Access</span>
      </h1>

      {/* Role Distribution */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          {
            label: "Students",
            count: totalStudents || 0,
            pct: studentPct,
            color: "text-teal",
            bg: "bg-teal/10",
            icon: "🟢",
          },
          {
            label: "Teachers",
            count: totalTeachers || 0,
            pct: teacherPct,
            color: "text-amber",
            bg: "bg-amber/10",
            icon: "🟡",
          },
          {
            label: "Admins",
            count: totalAdmins || 0,
            pct: adminPct,
            color: "text-coral",
            bg: "bg-coral/10",
            icon: "🔴",
          },
        ].map((r) => (
          <div
            key={r.label}
            className={`${r.bg} rounded-2xl p-5 border border-white/6 text-center`}
          >
            <div className="text-3xl mb-2">{r.icon}</div>
            <div className={`text-3xl font-black font-mono ${r.color}`}>
              {r.count}
            </div>
            <div className="text-xs text-slate font-medium mt-1">{r.label}</div>
            <div className="prog mt-2">
              <div
                className={`prog-fill ${r.color.replace("text-", "bg-")}`}
                style={{ width: `${r.pct}%` }}
              />
            </div>
            <div className="text-[10px] text-slate font-mono mt-1">
              {r.pct}%
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="glass rounded-2xl border border-white/6 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/6">
          <h2 className="text-sm font-bold text-white">Permission Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/6">
                <th className="text-left py-3 px-4 font-semibold text-slate-dark w-60 sticky left-0 bg-navy-2 z-10">
                  Permission
                </th>
                <th className="text-center py-3 px-4 font-semibold text-teal w-32 sticky left-60 bg-navy-2 z-10">
                  Student
                </th>
                <th className="text-center py-3 px-4 font-semibold text-amber w-32 sticky left-92 bg-navy-2 z-10">
                  Teacher
                </th>
                <th className="text-center py-3 px-4 font-semibold text-coral w-32 sticky left-124 bg-navy-2 z-10">
                  Admin
                </th>
              </tr>
            </thead>
            <tbody>
              {ROLE_PERMISSIONS.map((p, i) => (
                <tr
                  key={p.permission}
                  className={i % 2 === 0 ? "bg-white/3" : ""}
                >
                  <td className="py-3 px-4 text-slate sticky left-0 bg-navy-2 z-10 border-r border-white/4">
                    {p.permission}
                  </td>
                  <td className="py-3 px-4 text-center sticky left-60 bg-navy-2 z-10 border-r border-white/4">
                    <span
                      className={p.student ? "text-teal" : "text-slate-dark"}
                    >
                      {p.student ? "✓" : "✗"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center sticky left-92 bg-navy-2 z-10 border-r border-white/4">
                    <span
                      className={p.teacher ? "text-amber" : "text-slate-dark"}
                    >
                      {p.teacher ? "✓" : "✗"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center sticky left-124 bg-navy-2 z-10">
                    <span
                      className={p.admin ? "text-coral" : "text-slate-dark"}
                    >
                      {p.admin ? "✓" : "✗"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminRolesAccess;
