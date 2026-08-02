/**
 * EnrolledTab
 *
 * Enrolled Students tab content (teacher/admin only).
 * Shows a table of enrolled students with name, email, date, progress, and status.
 * Empty state when no students are enrolled.
 *
 * Props:
 *  - courseEnrollments — array of enrollment objects
 */

import { Section } from "./OverviewTab";

function EnrolledTab({ courseEnrollments }) {
  return (
    <Section title={`Enrolled Students (${courseEnrollments.length})`}>
      {courseEnrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2 rounded-xl border border-dashed border-border-2 bg-glass">
          <span className="text-2xl">👥</span>
          <p className="text-sm text-slate">No students enrolled yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs min-w-120">
            <thead>
              <tr className="border-b border-border">
                {["#", "Student", "Email", "Enrolled", "Progress", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left py-2.5 px-3 text-[10px] font-semibold font-mono text-slate-dark uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {courseEnrollments.map((enroll, idx) => (
                <tr
                  key={enroll.id}
                  className="border-b border-border/50 hover:bg-glass transition-colors"
                >
                  <td className="py-3 px-3 font-mono text-slate-dark">
                    {String(idx + 1).padStart(2, "0")}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-violet to-teal flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {(enroll.users?.full_name ?? "?")[0].toUpperCase()}
                      </div>
                      <span className="text-white font-medium truncate max-w-25">
                        {enroll.users?.full_name ?? "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate truncate max-w-30">
                    {enroll.users?.email ?? "—"}
                  </td>
                  <td className="py-3 px-3 text-slate font-mono whitespace-nowrap">
                    {new Date(enroll.enrolled_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2 min-w-20">
                      <div className="prog flex-1">
                        <div
                          className="prog-fill bg-teal"
                          style={{ width: `${enroll.progress ?? 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-teal w-7 text-right">
                        {enroll.progress ?? 0}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`tag font-mono border ${enroll.status === "active" ? "bg-teal-dim text-teal border-teal/25" : "bg-glass-2 text-slate border-border"}`}
                    >
                      {enroll.status ?? "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}

export default EnrolledTab;
