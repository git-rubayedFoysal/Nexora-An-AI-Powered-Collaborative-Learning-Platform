import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourse } from "../../features/course/courseSlice";
import { enrollCourse } from "../../features/enroll/enrollSlice";
import courseStorage from "../../services/supabase/course/course.storage";

function Checkout() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedCourse: course, loading: courseLoading } = useSelector(
    (s) => s.course,
  );
  const { loading: enrollLoading } = useSelector((s) => s.enroll);

  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    dispatch(fetchCourse(courseId));
  }, [dispatch, courseId]);

  const isFree = !course?.price || course.price === 0;
  const thumbnail = course?.thumbnail_url
    ? courseStorage.getThumbnailUrl(course.thumbnail_url)
    : "/placeholder-course.png";

  async function handleEnroll() {
    setSubmitError("");
    try {
      await dispatch(enrollCourse(courseId)).unwrap();
      navigate("/enrollment-success", {
        state: {
          courseId,
          courseTitle: course.title,
          courseSlug: course.id,
        },
      });
    } catch (err) {
      setSubmitError(err?.message ?? "Enrollment failed. Please try again.");
    }
  }

  /* ── Loading ── */
  if (courseLoading || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-4 border-border"
          style={{
            borderTopColor: "var(--color-violet)",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p className="text-sm text-slate font-mono">Loading checkout…</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 text-xs text-slate-dark font-mono mb-8">
          <button
            onClick={() => navigate("/courses")}
            className="hover:text-slate transition-colors"
          >
            Courses
          </button>
          <span>/</span>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="hover:text-slate transition-colors truncate max-w-40"
          >
            {course.title}
          </button>
          <span>/</span>
          <span className="text-slate">Checkout</span>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* ══════════════════════════
              LEFT — Order summary (3/5)
          ══════════════════════════ */}
          <div className="md:col-span-3 space-y-5">
            <div>
              <h1 className="text-2xl font-bold font-display mb-1">
                Complete your <span className="gradient-text">Enrollment</span>
              </h1>
              <p className="text-sm text-slate">
                Review your order before enrolling
              </p>
            </div>

            {/* Course card */}
            <div className="glass rounded-2xl border border-border p-4 flex gap-4">
              <img
                src={thumbnail}
                alt={course.title}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-course.png";
                }}
                className="w-20 h-20 rounded-xl object-cover shrink-0 brightness-90"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 font-display mb-1">
                  {course.title}
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-1">
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
                </div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate font-mono">
                  <span>🎥 {course.lesson_count ?? 0} lessons</span>
                  {course.duration > 0 && <span>⏱️ {course.duration}h</span>}
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="glass rounded-2xl border border-border p-5 space-y-3">
              <h2 className="text-xs font-semibold font-mono text-slate-dark uppercase tracking-widest mb-4">
                Order Summary
              </h2>

              {/* Original price */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate">Original price</span>
                <span className="text-sm font-mono text-white">
                  {isFree ? "৳0" : `৳${course.price}`}
                </span>
              </div>

              {/*
               * 100% discount applied to ALL courses.
               * TODO: when payment gateway is added, remove this section
               * for paid courses and replace with real payment UI.
               * Free courses keep this block permanently.
               * The route, state, and enrollment flow stay identical.
               */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-teal">Discount</span>
                  <span className="tag bg-teal-dim text-teal border border-teal/25 font-mono text-[10px]">
                    100% OFF
                  </span>
                </div>
                <span className="text-sm font-mono text-teal">
                  -{isFree ? "৳0" : `৳${course.price}`}
                </span>
              </div>

              <div className="border-t border-border pt-3 flex justify-between items-center">
                <span className="text-sm font-bold text-white">Total</span>
                <span className="text-xl font-black font-mono text-teal">
                  ৳0
                </span>
              </div>

              {!isFree && (
                <p className="text-[11px] text-slate-dark leading-relaxed pt-1">
                  🎉 This course is currently available at no cost.
                  {/* TODO: replace this message with payment UI when gateway is integrated */}
                </p>
              )}
            </div>

            {/* What you get */}
            <div className="glass rounded-2xl border border-border p-5">
              <h2 className="text-xs font-semibold font-mono text-slate-dark uppercase tracking-widest mb-4">
                What you get
              </h2>
              <ul className="space-y-2.5">
                {[
                  "Full lifetime access to all course content",
                  "Access on desktop, tablet, and mobile",
                  "Certificate of completion",
                  "All future course updates included",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-slate"
                  >
                    <svg
                      className="w-4 h-4 text-teal shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ══════════════════════════
              RIGHT — Enroll CTA (2/5)
          ══════════════════════════ */}
          <div className="md:col-span-2 mt-19">
            <div className="glass rounded-2xl border border-border p-6 md:sticky md:top-24 space-y-4">
              <div className="text-center pb-4 border-b border-border">
                <p className="text-xs text-slate-dark font-mono mb-1">
                  You pay today
                </p>
                <p className="text-4xl font-black font-mono text-teal">৳0</p>
              </div>

              {/* Error banner */}
              {submitError && (
                <div
                  className="flex items-start gap-2.5 rounded-xl border border-coral/25
                                bg-coral-dim px-4 py-3"
                >
                  <svg
                    className="w-4 h-4 text-coral shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs text-coral leading-relaxed">
                    {submitError}
                  </p>
                </div>
              )}

              {/* Enroll button */}
              <button
                onClick={handleEnroll}
                disabled={enrollLoading}
                className="btn-primary w-full py-3.5 rounded-xl text-sm font-semibold
                           text-white disabled:opacity-60 disabled:cursor-not-allowed
                           disabled:hover:translate-y-0 inline-flex items-center
                           justify-center gap-2"
              >
                {enrollLoading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                      />
                    </svg>
                    Enrolling…
                  </>
                ) : (
                  "Continue Enrollment"
                )}
              </button>

              <button
                onClick={() => navigate(`/courses/${courseId}`)}
                disabled={enrollLoading}
                className="w-full py-2.5 rounded-xl text-xs font-semibold
                           text-slate border border-border
                           hover:text-white hover:bg-glass-2 transition-all
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Back to course
              </button>

              <p className="text-[10px] text-slate-dark text-center leading-relaxed">
                By enrolling you agree to our{" "}
                <span className="text-slate cursor-pointer hover:text-white transition-colors">
                  Terms of Service
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
