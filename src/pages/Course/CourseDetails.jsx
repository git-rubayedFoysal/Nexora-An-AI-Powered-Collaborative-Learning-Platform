import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { fetchCourse } from "../../features/course/courseSlice";
import {
  fetchCourseEnrollments,
  fetchEnrollment,
} from "../../features/enroll/enrollSlice";
import courseStorage from "../../services/supabase/course/course.storage";
import { LoadingState } from "../../components";

/* ── small helpers ── */
function InfoChip({ icon, label }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-glass-2 border border-border">
      <span className="text-base leading-none">{icon}</span>
      <span className="text-xs text-slate font-mono">{label}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="glass rounded-2xl border border-border p-6">
      <h2 className="text-sm font-bold text-white mb-4 font-display">
        {title}
      </h2>
      {children}
    </div>
  );
}

function CourseDetails() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedCourse: course, loading } = useSelector((s) => s.course);
  const { courseEnrollments, currentEnrollment } = useSelector((s) => s.enroll);
  const { userData } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchCourse(courseId));
    dispatch(fetchEnrollment(courseId));
  }, [dispatch, courseId]);

  const isTeacher = userData?.id === course?.teacher_id;
  const isAdmin = userData?.role?.toLowerCase() === "admin";
  const isStudent = userData?.role?.toLowerCase() === "student";
  const isFree = !course?.price || course?.price === 0;

  // Fetch enrolled students only when the viewer is teacher or admin
  useEffect(() => {
    dispatch(fetchCourseEnrollments(courseId));
  }, [dispatch, courseId]);

  /* ── Loading ── */
  if (loading || !course) {
    return <LoadingState color="--color-violet" content="course..." />;
  }

  const thumbnail = course.thumbnail_url
    ? courseStorage.getThumbnailUrl(course.thumbnail_url)
    : "/placeholder-course.png";

  const statusCfg =
    {
      published: {
        label: "Published",
        cls: "bg-teal text-white border-teal/25",
      },
      draft: { label: "Draft", cls: "bg-amber text-white border-amber/25" },
      archived: {
        label: "Archived",
        cls: "bg-coral text-white border-border",
      },
    }[course.status?.toLowerCase()] ?? null;

  const studentCount = courseEnrollments.length ?? 0;
  return (
    <div className="max-w-5xl mx-auto mt-20">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-xs text-slate-dark font-mono mb-6">
        <button
          onClick={() => navigate("/courses")}
          className="hover:text-slate transition-colors"
        >
          Courses
        </button>
        <span>/</span>
        {course.category && (
          <>
            <button
              onClick={() => navigate("/courses")}
              className="hover:text-slate transition-colors"
            >
              {course.category}
            </button>
            <span>/</span>
          </>
        )}
        <span className="text-slate truncate max-w-50">{course.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ══════════════════════════════════
            LEFT — main content (2/3)
        ══════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-5">
          {/* ── Hero thumbnail ── */}
          <div className="relative rounded-2xl overflow-hidden border border-border">
            <img
              src={thumbnail}
              alt={course.title}
              onError={(e) => {
                e.currentTarget.src = "/placeholder-course.png";
              }}
              className="w-full h-56 sm:h-72 object-cover brightness-90"
            />
            {/* scrim */}
            <div
              className="absolute inset-x-0 bottom-0 h-24
                            bg-linear-to-t from-navy-2 to-transparent"
            />

            {/* status chip */}
            {statusCfg && !isStudent && (
              <>
                <span
                  className={`absolute flex items-center gap-1 top-4 right-4 font-bold tag border font-mono ${statusCfg.cls}`}
                >
                  <span
                    className={`w-1.5 h-1.5 animate-pulse rounded-full shrink-0 bg-white`}
                  />
                  {statusCfg.label}
                </span>
              </>
            )}

            {/* price over thumbnail */}
            {!currentEnrollment && (
              <div className="absolute bottom-4 left-4">
                <span
                  className={`text-2xl font-black font-mono
                ${isFree ? "text-teal" : "text-amber"}`}
                >
                  {isFree ? "Free" : `৳${course?.price}`}
                </span>
              </div>
            )}
          </div>

          {/* ── Title + meta ── */}
          <div>
            <h1 className="text-2xl font-bold text-white leading-snug mb-3 font-display">
              {course.title}
            </h1>

            {/* chips row */}
            <div className="flex flex-wrap gap-2">
              {course.category && (
                <span className="tag bg-teal-dim text-teal border border-teal/25 font-mono">
                  {course.category}
                </span>
              )}
              {course.level && (
                <span className="tag bg-violet/15 text-violet-light border border-violet/25 font-mono">
                  {course.level}
                </span>
              )}
              <span className="text-[11px] text-slate-dark font-mono self-center">
                Updated{" "}
                {new Date(course.updated_at).toLocaleDateString("en-GB", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* ── Description ── */}
          <Section title="About this course">
            <p className="text-sm text-slate leading-relaxed">
              {course.description ?? "No description available."}
            </p>
          </Section>

          {/* ── Course includes ── */}
          <Section title="This course includes">
            <div className="grid grid-cols-2 gap-3">
              <InfoChip
                icon="👥"
                label={`${studentCount} students enrolled `}
              />
              <InfoChip
                icon="🎥"
                label={`${course.lesson_count ?? 0} lessons`}
              />
              <InfoChip
                icon="⏱️"
                label={
                  course.duration ? `${course.duration} hours` : "Duration TBA"
                }
              />
              <InfoChip icon="📶" label={course.level ?? "All levels"} />
              <InfoChip icon="♾️" label="Full lifetime access" />
              <InfoChip icon="📱" label="Access on all devices" />
              <InfoChip icon="🏆" label="Certificate of completion" />
            </div>
          </Section>

          {/* ── Curriculum placeholder ──
              TODO: populate when lessons are implemented */}
          <Section title="Course Curriculum">
            <div
              className="flex flex-col items-center justify-center py-10 gap-3
                            rounded-xl border border-dashed border-border-2 bg-glass"
            >
              <span className="text-3xl">📋</span>
              <p className="text-sm font-semibold text-white">
                Curriculum coming soon
              </p>
              <p className="text-xs text-slate-dark text-center max-w-xs">
                Lessons and modules will appear here once the instructor
                publishes course content.
              </p>
            </div>
          </Section>

          {/* ── Enrolled Students — teacher & admin only ── */}
          {(isTeacher || isAdmin) && (
            <Section title={`Enrolled Students (${courseEnrollments.length})`}>
              {courseEnrollments.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-8 gap-2
                                rounded-xl border border-dashed border-border-2 bg-glass"
                >
                  <span className="text-2xl">👥</span>
                  <p className="text-sm text-slate">No students enrolled yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        {[
                          "#",
                          "Student",
                          "Email",
                          "Enrolled",
                          "Progress",
                          "Status",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left py-2.5 px-3 text-[10px] font-semibold
                                         font-mono text-slate-dark uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {courseEnrollments.map((enroll, idx) => (
                        <tr
                          key={enroll.id}
                          className="border-b border-border/50 hover:bg-glass transition-colors"
                        >
                          {/* # */}
                          <td className="py-3 px-3 font-mono text-slate-dark">
                            {String(idx + 1).padStart(2, "0")}
                          </td>
                          {/* Name */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-7 h-7 rounded-full bg-linear-to-br from-violet to-teal
                                              flex items-center justify-center text-[10px] font-bold
                                              text-white shrink-0"
                              >
                                {(enroll.users?.full_name ??
                                  "?")[0].toUpperCase()}
                              </div>
                              <span className="text-white font-medium truncate max-w-30">
                                {enroll.users?.full_name ?? "Unknown"}
                              </span>
                            </div>
                          </td>
                          {/* Email */}
                          <td className="py-3 px-3 text-slate truncate max-w-35">
                            {enroll.users?.email ?? "—"}
                          </td>
                          {/* Enrolled date */}
                          <td className="py-3 px-3 text-slate font-mono whitespace-nowrap">
                            {new Date(enroll.enrolled_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          {/* Progress bar */}
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
                          {/* Status chip */}
                          <td className="py-3 px-3">
                            <span
                              className={`tag font-mono border
                              ${
                                enroll.status === "active"
                                  ? "bg-teal-dim text-teal border-teal/25"
                                  : "bg-glass-2 text-slate border-border"
                              }`}
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
          )}
        </div>

        {/* ══════════════════════════════════
            RIGHT — sticky sidebar (1/3)
        ══════════════════════════════════ */}
        <div className="space-y-4">
          {/* ── Enroll card ── */}
          <div className="glass rounded-2xl border border-border p-6 lg:sticky lg:top-24">
            {/* Price */}
            <div className="mb-5 text-center">
              {!currentEnrollment ? (
                <div>
                  <span
                    className={`text-3xl font-black font-mono
                ${isFree ? "text-teal" : "text-amber"}`}
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
                <p className="tag bg-teal-dim border border-teal/25 text-teal mt-0.5 text-center font-bold">
                  ✔ You're already enrolled in this course.
                </p>
              )}
            </div>

            {/* CTA */}
            {isTeacher || isAdmin ? (
              // Teacher
              <button
                onClick={() => navigate(`/dashboard/edit-course/${course.id}`)}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white
               bg-amber hover:bg-amber/90 transition-all
               shadow-[0_4px_16px_rgba(245,166,35,.3)] mb-3"
              >
                Edit Course
              </button>
            ) : !currentEnrollment ? (
              // Student not enrolled
              <button
                onClick={() => navigate(`/courses/${courseId}/checkout`)}
                className="btn-primary w-full py-3 rounded-xl text-sm font-semibold text-white mb-3"
              >
                {isFree ? "Enroll for Free" : "Enroll Now"}
              </button>
            ) : (
              // Student already enrolled
              <button
                onClick={() => navigate(`/dashboard/my-learning`)}
                className="btn-primary w-full py-3 rounded-xl text-sm font-semibold text-white mb-3"
              >
                Start Learning
              </button>
            )}

            <button
              onClick={() => navigate(-1)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold
                         text-slate border border-border
                         hover:text-white hover:bg-glass-2 transition-all"
            >
              Go Back
            </button>

            {/* Quick stats */}
            <div className="mt-5 pt-5 border-t border-border space-y-3">
              {[
                {
                  icon: "📚",
                  label: "Category",
                  value: course.category ?? "—",
                },
                { icon: "📶", label: "Level", value: course.level ?? "—" },
                {
                  icon: "👥",
                  label: "Enrolled",
                  value: `${studentCount} students`,
                },
                {
                  icon: "🎥",
                  label: "Lessons",
                  value: course.lesson_count ?? 0,
                },
                {
                  icon: "⏱️",
                  label: "Duration",
                  value: course.duration ? `${course.duration}h` : "TBA",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-slate flex items-center gap-1.5">
                    <span>{row.icon}</span> {row.label}
                  </span>
                  <span className="text-xs font-semibold text-white font-mono">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Instructor card ── */}
          <div className="glass rounded-2xl border border-border sticky top-127 p-5">
            <p className="text-[10px] font-mono text-slate-dark uppercase tracking-widest mb-3">
              Instructor
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full bg-linear-to-br from-violet to-teal
                              flex items-center justify-center text-sm font-bold text-white shrink-0"
              >
                {(course.users?.full_name ?? "I")[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {course.users?.full_name ?? "Instructor"}
                </p>
                <p className="text-xs text-slate-dark">
                  {course.users?.email ?? ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
