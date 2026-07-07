import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { fetchCourse, updateCourse } from "../../features/course/courseSlice";
import { CourseForm, LoadingState } from "../../components";
import { useEffect, useState } from "react";

function EditCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  console.log(courseId);

  const [submitError, setSubmitError] = useState("");

  const { loading, selectedCourse } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.auth);

  const handleEditCourse = async ({ courseData, thumbnailFile }) => {
    /*
     * FIX 2: wrapped in try/catch.
     * unwrap() re-throws the rejectWithValue payload as an error —
     * without this catch it was a silent crash.
     */
    try {
      if (loading) return;
      setSubmitError("");
      await dispatch(
        updateCourse({
          courseId,
          courseData,
          thumbnailFile,
          oldThumbnailPath: selectedCourse.thumbnail_url,
        }),
      ).unwrap();
      navigate("/dashboard/my-courses");
    } catch (err) {
      // err.message comes from rejectWithValue(error.message) in the slice
      setSubmitError(err?.message ?? "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (!courseId) return;
    dispatch(fetchCourse(courseId));
  }, [dispatch, courseId]);

  const isTeacher = userData?.role?.toLowerCase() === "teacher";

  /* ── Loading state ──
       CHANGED: removed min-h-screen — centering is relative to the outlet area,
       not the full viewport, so we use py-20 to push it away from the top naturally */
  if (loading && !selectedCourse) {
    return <LoadingState color="--color-amber" content="course..." />;
  }

  return (
    // CHANGED: same fix as CreateCourse — removed min-h-screen, relative,
    // overflow-x-hidden, py-10, and glow orbs. The <main> wrapper in the
    // layout already provides all spacing needed.
    <>
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-xs text-slate-dark font-mono mb-4">
        <button
          onClick={() => navigate("/dashboard/my-courses")}
          className="hover:text-slate transition-colors"
        >
          My Courses
        </button>
        <span className="text-slate-dark">/</span>
        <span className="text-slate truncate max-w-50">
          {selectedCourse?.title ?? courseId}
        </span>
        <span className="text-slate-dark">/</span>
        <span className="text-slate">Edit</span>
      </div>

      {/* ── Page heading ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-3 font-display">
          {selectedCourse?.title ? (
            <>
              Update{" "}
              <span className="gradient-text">{selectedCourse.title}</span>
            </>
          ) : (
            "Update Course"
          )}
        </h1>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                      text-xs font-semibold font-mono border
                      ${
                        isTeacher
                          ? "animate-pulse-amber bg-amber-dim text-amber border-amber/25"
                          : "animate-pulse-coral bg-coral-dim text-coral border-coral/25"
                      }`}
        >
          ● {userData?.role?.toUpperCase()}
        </span>
      </div>

      {/*
       * FIX 3: error banner — shown when the slice rejects.
       * Sits above the form so it's immediately visible without scrolling.
       */}
      {submitError && (
        <div
          className="flex items-start gap-3 rounded-2xl border border-coral/25
                        bg-coral-dim px-5 py-4 mb-6"
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
          <div className="flex-1">
            <p className="text-sm text-coral font-semibold mb-0.5">
              Course update failed
            </p>
            <p className="text-xs text-coral/80 leading-relaxed">
              {submitError}
            </p>
          </div>
          {/* Dismiss */}
          <button
            onClick={() => setSubmitError("")}
            className="text-coral/60 hover:text-coral transition-colors shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* ── Form shell ── */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        <CourseForm
          initialData={selectedCourse}
          loading={loading}
          submitText="Update Course"
          onSubmit={handleEditCourse}
          onCancel={() => navigate(-1)}
        />
      </div>
    </>
  );
}

export default EditCourse;
