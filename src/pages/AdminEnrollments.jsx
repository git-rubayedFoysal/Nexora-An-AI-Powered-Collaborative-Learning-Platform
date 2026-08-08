/**
 * AdminEnrollments
 *
 * Admin page for viewing and managing all enrollments.
 * Lists enrollments with search, pagination, and course filter.
 */

import { useState, useEffect } from "react";
import enrollService from "../services/supabase/enrollment/enroll.service";
import { Button } from "../components/index";
import formatDate from "../utils/formatDate";

function AdminEnrollments() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    let cancelled = false;
    enrollService
      .getAllEnrollments({ page, search, courseId: courseFilter })
      .then((res) => {
        if (!cancelled) {
          setEnrollments(res.enrollments);
          setTotal(res.total);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setMessage({ type: "error", text: err.message });
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [page, search, courseFilter]);

  const totalPages = Math.ceil(total / 10);

  const statusColors = {
    active: "bg-amber/15 text-amber border-amber/25",
    completed: "bg-teal/15 text-teal border-teal/25",
  };

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-6 font-display">
        Enrollment <span className="gradient-text">Management</span>
      </h1>

      {message.text && (
        <div
          className={`flex items-start gap-3 rounded-2xl p-4 mb-6 ${
            message.type === "success"
              ? "border border-teal/25 bg-teal/5"
              : "border border-coral/25 bg-coral-dim"
          }`}
        >
          <svg
            className={`w-4 h-4 shrink-0 mt-0.5 ${
              message.type === "success" ? "text-teal" : "text-coral"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                message.type === "success"
                  ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              }
            />
          </svg>
          <p className={`text-sm ${message.type === "success" ? "text-teal" : "text-coral"}`}>
            {message.text}
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="glass rounded-2xl border border-white/6 p-5 mb-5 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search student, email, or course…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setPage(1)}
            className="nx-input pl-10 pr-3 py-2 rounded-xl text-sm bg-white/5 border border-border text-white placeholder-slate-dark transition-all w-full"
          />
        </div>
        <select
          value={courseFilter}
          onChange={(e) => {
            setCourseFilter(e.target.value);
            setPage(1);
          }}
          className="nx-input py-2 rounded-xl text-sm bg-white/5 border border-border text-white cursor-pointer max-w-60"
        >
          <option value="">All Courses</option>
          {/* Course options would be populated from a courses fetch */}
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-white/6 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-xs text-slate-dark">No enrollments found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    {["Student", "Course", "Teacher", "Status", "Progress", "Enrolled", "Action"].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-slate-dark border-b border-white/6"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e, i, arr) => (
                    <tr key={e.id} className="nx-tr">
                      <td
                        className={`py-3 px-4 text-white font-medium ${
                          i < arr.length - 1 ? "border-b border-white/4" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-teal flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {(e.users?.full_name || "U")
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-sm truncate max-w-40">
                              {e.users?.full_name || "—"}
                            </div>
                            <div className="text-[10px] text-slate-dark">{e.users?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td
                        className={`py-3 px-4 text-slate truncate max-w-40 ${
                          i < arr.length - 1 ? "border-b border-white/4" : ""
                        }`}
                      >
                        {e.courses?.title || "—"}
                      </td>
                      <td
                        className={`py-3 px-4 text-slate truncate max-w-32 ${
                          i < arr.length - 1 ? "border-b border-white/4" : ""
                        }`}
                      >
                        {e.courses?.users?.full_name || "—"}
                      </td>
                      <td
                        className={`py-3 px-4 ${
                          i < arr.length - 1 ? "border-b border-white/4" : ""
                        }`}
                      >
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            statusColors[e.status] || statusColors.active
                          }`}
                        >
                          {e.status?.charAt(0).toUpperCase() + e.status?.slice(1) || "Active"}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 ${
                          i < arr.length - 1 ? "border-b border-white/4" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="prog flex-1 max-w-32">
                            <div
                              className="prog-fill bg-teal"
                              style={{ width: `${e.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate font-mono shrink-0">
                            {e.progress || 0}%
                          </span>
                        </div>
                      </td>
                      <td
                        className={`py-3 px-4 text-slate ${
                          i < arr.length - 1 ? "border-b border-white/4" : ""
                        }`}
                      >
                        {formatDate(e.enrolled_at)}
                      </td>
                      <td
                        className={`py-3 px-4 ${
                          i < arr.length - 1 ? "border-b border-white/4" : ""
                        }`}
                      >
                        <span className="text-slate-dark text-[10px]">—</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/6">
                <span className="text-xs text-slate font-mono">
                  Page {page} of {totalPages} ({total} total)
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-semibold text-slate border border-border hover:text-white hover:bg-glass-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-semibold text-slate border border-border hover:text-white hover:bg-glass-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminEnrollments;