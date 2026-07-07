import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useState } from "react";
import { createCourse } from "../../features/course/courseSlice";
import { CourseForm, LoadingState } from "../../components";

function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.auth);

  /*
   * FIX 1: local error state to surface failures in the UI.
   * Previously unwrap() threw on rejection but there was no catch,
   * so the error disappeared and the button stayed in loading forever.
   */
  const [submitError, setSubmitError] = useState("");

  const handleCreateCourse = async ({ courseData, thumbnailFile }) => {
    /*
     * FIX 2: wrapped in try/catch.
     * unwrap() re-throws the rejectWithValue payload as an error —
     * without this catch it was a silent crash.
     */
    try {
      setSubmitError("");
      await dispatch(createCourse({ courseData, thumbnailFile })).unwrap();
      navigate("/dashboard/my-courses");
    } catch (err) {
      // err.message comes from rejectWithValue(error.message) in the slice
      setSubmitError(err?.message ?? "Something went wrong. Please try again.");
    }
  };

  const isTeacher = userData?.role?.toLowerCase() === "teacher";

  if (loading) {
    return <LoadingState color="--color-amber" />;
  }

  return (
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
        <span className="text-slate">Create Course</span>
      </div>

      {/* ── Page heading ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-3 font-display">
          Create a <span className="gradient-text">New Course</span>
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
              Course creation failed
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
          initialData={null}
          loading={loading}
          submitText="Create Course"
          onSubmit={handleCreateCourse}
          onCancel={() => navigate(-1)}
        />
      </div>
    </>
  );
}

export default CreateCourse;
