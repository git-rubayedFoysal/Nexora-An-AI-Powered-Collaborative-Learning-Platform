/**
 * GradeCenter
 *
 * Teacher-only page that displays all student submissions across every
 * assignment the teacher owns. Fetches assignments first, then fetches
 * submissions per assignment using fetchAssignmentSubmissions.
 *
 * Provides filtering by assignment, status, and student search,
 * plus a modal for grading individual submissions.
 */

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { fetchMyAssignments } from "../../features/assignment/assignmentSlice";
import {
  fetchAssignmentSubmissions,
  gradeSubmission,
} from "../../features/assignment/assignmentSubmissionSlice";
import {
  LoadingState,
  EmptyState,
  SearchBar,
  Button,
} from "../../components/index";
import getSubmissionTiming from "../../utils/submissionTiming";
import GradeSubmissionModal from "./GradeSubmissionModal";
import formatDate from "../../utils/formatDate";

// ── Tab config ──
const TABS = [
  { key: "all", label: "All" },
  { key: "ungraded", label: "Ungraded" },
  { key: "graded", label: "Graded" },
];

function GradeCenter() {
  const dispatch = useDispatch();
  const { myAssignments, loading: assignmentsLoading } = useSelector(
    (state) => state.assignment,
  );
  const { assignmentSubmissions, loading: submissionsLoading } = useSelector(
    (state) => state.assignmentSubmission,
  );

  const [statusFilter, setStatusFilter] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [gradeTarget, setGradeTarget] = useState(null);
  const [subsFetched, setSubsFetched] = useState(false);

  const loading = assignmentsLoading || submissionsLoading;

  // ── Fetch assignments on mount, then fetch submissions per assignment ──
  useEffect(() => {
    dispatch(fetchMyAssignments()).then((action) => {
      const assignments = action.payload;
      if (assignments && assignments.length > 0) {
        assignments.forEach((a) => {
          dispatch(fetchAssignmentSubmissions({ assignmentId: a.id }));
        });
      }
      setSubsFetched(true);
    });
  }, [dispatch]);

  // ── Derived: unique assignment list for the dropdown ──
  const assignmentOptions = useMemo(() => {
    return myAssignments.map((a) => ({
      id: a.id,
      title: a.title,
      courseTitle: a.modules?.courses?.title || "",
    }));
  }, [myAssignments]);

  // ── Filter submissions ──
  const filtered = useMemo(() => {
    let list = assignmentSubmissions;

    if (statusFilter === "ungraded") {
      list = list.filter((s) => s.status !== "graded");
    } else if (statusFilter === "graded") {
      list = list.filter((s) => s.status === "graded");
    }

    if (assignmentFilter !== "all") {
      list = list.filter((s) => s.assignment_id === assignmentFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.users?.full_name?.toLowerCase().includes(q) ||
          s.users?.email?.toLowerCase().includes(q),
      );
    }

    return list;
  }, [assignmentSubmissions, statusFilter, assignmentFilter, search]);

  // ── Stats ──
  const total = assignmentSubmissions.length;
  const gradedCount = assignmentSubmissions.filter(
    (s) => s.status === "graded",
  ).length;
  const ungradedCount = total - gradedCount;
  const avgScore = useMemo(() => {
    const graded = assignmentSubmissions.filter(
      (s) => s.score != null && s.assignments?.max_score,
    );
    if (graded.length === 0) return null;
    const sum = graded.reduce(
      (acc, s) => acc + (s.score / s.assignments.max_score) * 100,
      0,
    );
    return Math.round(sum / graded.length);
  }, [assignmentSubmissions]);

  // ── Handlers ──
  async function handleGrade({ score, feedback }) {
    try {
      await dispatch(
        gradeSubmission({ submissionId: gradeTarget.id, score, feedback }),
      ).unwrap();

      setGradeTarget(null);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return (
    <div className="mb-8">
      {/* ── Page heading ── */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-4 font-display">
          Grade <span className="gradient-text">Center</span>
        </h1>
        <span
          className="animate-pulse-amber inline-flex items-center gap-1.5 px-3 py-1
                     rounded-full text-xs font-semibold bg-amber/10 text-amber
                     border border-amber/25 font-mono"
        >
          ● TEACHER
        </span>
      </div>

      {/* ── Loading ── */}
      {loading && !subsFetched && (
        <LoadingState color="--color-teal" content="submissions..." />
      )}

      {/* ── Empty state ── */}
      {subsFetched && total === 0 && !loading ? (
        <EmptyState
          icon="✅"
          title="No submissions yet"
          description="Once students submit assignments, their work will appear here for grading."
          noButton
        />
      ) : (
        subsFetched &&
        total > 0 && (
          <>
            {/* ── Stats cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total" value={total} color="text-white" />
              <StatCard
                label="Ungraded"
                value={ungradedCount}
                color="text-amber"
              />
              <StatCard label="Graded" value={gradedCount} color="text-teal" />
              <StatCard
                label="Avg Score"
                value={avgScore != null ? `${avgScore}%` : "—"}
                color="text-violet-light"
              />
            </div>

            {/* ── Filters bar ── */}
            <div className="glass rounded-2xl p-4 border border-white/6 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                {/* Status tabs */}
                <div className="flex rounded-lg bg-white/5 border border-white/6 overflow-hidden">
                  {TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setStatusFilter(tab.key)}
                      className={`px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                        statusFilter === tab.key
                          ? "bg-teal/15 text-teal"
                          : "text-slate hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Assignment dropdown */}
                <select
                  value={assignmentFilter}
                  onChange={(e) => setAssignmentFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg text-xs bg-white/5 border border-white/8
                             text-white outline-none transition-all
                             focus:border-teal focus:ring-2 focus:ring-teal/20 cursor-pointer"
                >
                  <option value="all">All Assignments</option>
                  {assignmentOptions.map((a) => (
                    <option
                      key={a.id}
                      value={a.id}
                      style={{ backgroundColor: "var(--color-navy-3)" }}
                    >
                      {a.title}
                      {a.courseTitle ? ` (${a.courseTitle})` : ""}
                    </option>
                  ))}
                </select>

                {/* Search */}
                <SearchBar
                  placeholder="Search student…"
                  className="flex-1 min-w-50"
                  value={search}
                  onChange={setSearch}
                />
              </div>
            </div>

            {/* ── Results count ── */}
            <p className="text-xs text-slate-dark mb-3 font-mono">
              {filtered.length} submission{filtered.length !== 1 && "s"}
            </p>

            {/* ── Submissions table ── */}
            {filtered.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No matching submissions"
                description="Try adjusting your filters or search query."
                noButton
              />
            ) : (
              <div className="glass rounded-2xl border border-white/6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        {[
                          "Student",
                          "Course",
                          "Assignment",
                          "Submitted",
                          "Late",
                          "Status",
                          "Score",
                          "",
                        ].map((h) => (
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
                      {filtered.map((s, i, arr) => {
                        const isGraded = s.status === "graded";
                        return (
                          <tr
                            key={s.id}
                            onClick={() => setGradeTarget(s)}
                            className="nx-tr cursor-pointer hover:bg-white/3 transition-colors"
                          >
                            <td
                              className={`py-3 px-4 text-white font-medium ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                            >
                              {s.users?.full_name || "—"}
                            </td>
                            <td
                              className={`py-3 px-4 text-slate truncate max-w-32 ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                            >
                              {s.assignments?.modules?.courses?.title || "—"}
                            </td>
                            <td
                              className={`py-3 px-4 text-slate truncate max-w-40 ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                            >
                              {s.assignments?.title || "—"}
                            </td>
                            <td
                              className={`py-3 px-4 text-slate-dark ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                            >
                              {formatDate(s.submitted_at)}
                            </td>
                            <td
                              className={`py-3 px-4 ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                            >
                              {(() => {
                                const timing = getSubmissionTiming(
                                  s.submitted_at,
                                  s.assignments?.due_date,
                                );
                                return timing?.late ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-coral/15 text-coral border border-coral/25">
                                    {timing.label}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-dark">
                                    On time
                                  </span>
                                );
                              })()}
                            </td>
                            <td
                              className={`py-3 px-4 ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                            >
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  isGraded
                                    ? "bg-teal/15 text-teal"
                                    : "bg-amber/15 text-amber"
                                }`}
                              >
                                {isGraded ? "Graded" : "Ungraded"}
                              </span>
                            </td>
                            <td
                              className={`py-3 px-4 font-mono ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                            >
                              {s.score != null
                                ? `${s.score} / ${s.assignments?.max_score || "—"}`
                                : "—"}
                            </td>
                            <td
                              className={`py-3 px-4 ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                            >
                              <Button
                                type="submit"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setGradeTarget(s);
                                }}
                                className="px-3 py-1.5 rounded-lg text-[10px] font-semibold
                                           bg-teal/10 text-teal border border-teal/25
                                           hover:bg-teal/20 transition-all"
                              >
                                {isGraded ? "Re-grade" : "Grade"}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )
      )}

      {/* ── Grade modal ── */}
      <GradeSubmissionModal
        key={gradeTarget?.id}
        isOpen={Boolean(gradeTarget)}
        onClose={() => setGradeTarget(null)}
        onGrade={handleGrade}
        submission={gradeTarget}
        loading={loading}
      />
    </div>
  );
}

// ── Stat card sub-component ──
function StatCard({ label, value, color = "text-white" }) {
  return (
    <div className="glass rounded-2xl p-4 border border-white/6">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-dark mb-1">
        {label}
      </p>
      <p className={`text-xl font-bold font-display ${color}`}>{value}</p>
    </div>
  );
}

export default GradeCenter;
