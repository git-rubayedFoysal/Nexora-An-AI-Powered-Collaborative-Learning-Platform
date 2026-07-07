import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, Textarea } from "../index";
import courseStorage from "../../services/supabase/course/course.storage";

const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const COURSE_STATUS_CREATE = ["draft", "published"];
const COURSE_STATUS_EDIT = ["draft", "published", "archived"];
/**
 * CourseForm — aligned to index.css tokens
 * Logic, props, validation unchanged.
 * Now uses: .glass, .glass2, .btn-primary, .btn-ghost, .btn-secondary,
 *           .prog/.prog-fill, color tokens (coral-dim, amber-dim, border…)
 */
function CourseForm({
  initialData = {},
  loading = false,
  submitText = "Create Course",
  onSubmit,
  onCancel = () => {},
}) {
  const isEditing = Boolean(initialData?.id ?? initialData?.title);
  const statusOptions = isEditing ? COURSE_STATUS_EDIT : COURSE_STATUS_CREATE;

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      level: "Beginner",
      price: "",
      status: "draft",
    },
  });

  /* ── Handlers */
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setThumbnailFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (data) => {
    setSubmitError("");
    if (!thumbnailFile && !initialData?.thumbnail_url) {
      setSubmitError("Course thumbnail is required.");
      return;
    }
    try {
      await onSubmit({ courseData: data, thumbnailFile });
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  useEffect(() => {
    reset({
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      level: initialData?.level || "Beginner",
      price: initialData?.price ?? "",
      status: initialData?.status || "draft",
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThumbnailFile(null);

    if (initialData?.thumbnail_url) {
      setPreview(courseStorage.getThumbnailUrl(initialData.thumbnail_url));
    } else {
      setPreview(null);
    }
  }, [initialData, reset, isEditing]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6 text-white"
    >
      {/* ── Error banner — coral-dim token from @theme ── */}
      {submitError && (
        <div
          className="flex items-start gap-3 rounded-2xl border border-coral/25
                        bg-coral-dim px-5 py-4"
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
          <p className="text-sm text-coral leading-relaxed">{submitError}</p>
        </div>
      )}

      {/* ══════════════════════════
          Basic Information
      ══════════════════════════ */}
      {/* .glass defined in index.css → background: glass, backdrop-filter, border: border */}
      <section className="glass rounded-2xl p-6 space-y-6">
        {/* Section label — matches sidebar section title pattern */}
        <div className="pb-2 border-b border-border">
          <span
            className="text-[10px] font-semibold font-mono text-slate-dark
                           uppercase tracking-widest"
          >
            Basic Information
          </span>
        </div>

        {/* Title */}
        <div>
          <Input
            label="Course Title"
            placeholder="Enter course title..."
            disabled={loading}
            {...register("title", {
              required: "Course title is required",
              minLength: { value: 5, message: "Minimum 5 characters" },
            })}
          />
          {errors?.title && (
            <p className="mt-1.5 text-xs text-coral font-mono">
              {errors?.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <Textarea
            label="Course Description"
            disabled={loading}
            rows={7}
            placeholder="Write a detailed description..."
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 30,
                message: "Description should be at least 30 characters",
              },
            })}
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-coral font-mono">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Category + Level */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <Input
              label="Category"
              placeholder="e.g. Web Development"
              disabled={loading}
              list="course-category"
              {...register("category", { required: "Category is required" })}
            />
            <datalist id="course-category">
              <option value="Web Development" />
              <option value="AI & Machine Learning" />
              <option value="Data Science" />
              <option value="Cyber Security" />
              <option value="Cloud Computing" />
              <option value="DevOps" />
              <option value="Database" />
              <option value="Programming" />
            </datalist>
            {errors.category && (
              <p className="mt-1.5 text-xs text-coral font-mono">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <Select
              label="Level"
              options={COURSE_LEVELS}
              disabled={loading}
              {...register("level", { required: "Level is required" })}
            />
            {errors.level && (
              <p className="mt-1.5 text-xs text-coral font-mono">
                {errors.level.message}
              </p>
            )}
          </div>
        </div>

        {/* Price + Status */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <Input
              label="Price (BDT)"
              type="number"
              disabled={loading}
              min={0}
              step="0.01"
              placeholder="0.0 — enter 0 for free"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 0, message: "Price cannot be negative" },
              })}
            />
            {/* BUG FIX (carried from previous session): was errors.description */}
            {errors.price && (
              <p className="mt-1.5 text-xs text-coral font-mono">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <Select
              label="Status"
              options={statusOptions}
              disabled={loading}
              {...register("status")}
            />
            {/* BUG FIX (carried from previous session): was errors.description */}
            {errors.status && (
              <p className="mt-1.5 text-xs text-coral font-mono">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════
          Thumbnail
      ══════════════════════════ */}
      <section className="glass rounded-2xl p-6 space-y-5">
        <div className="pb-2 border-b border-border">
          <span
            className="text-[10px] font-semibold font-mono text-slate-dark
                           uppercase tracking-widest"
          >
            Course Thumbnail
          </span>
        </div>

        {/* Preview — uses navy-2 scrim token */}
        {preview && (
          <div className="relative w-full h-52 rounded-xl overflow-hidden border border-border">
            <img
              src={preview}
              alt="Course Thumbnail"
              className="w-full h-full object-cover brightness-90"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-12
                            bg-linear-to-t from-navy-2/70 to-transparent"
            />
            <span
              className="absolute bottom-3 right-3 text-[10px] font-semibold font-mono
                             px-2.5 py-1 rounded-full bg-glass-2 text-white
                             border border-border-2 backdrop-blur-sm"
            >
              Click below to change
            </span>
          </div>
        )}

        {/* Drop-zone — shown when no preview */}
        {!preview && (
          <div
            className="flex flex-col items-center justify-center gap-3
                          rounded-xl border border-dashed border-border-2
                          bg-glass py-10 px-6 text-center
                          hover:border-violet/40 hover:bg-glass-2
                          transition-all duration-200 cursor-pointer"
          >
            <svg
              className="w-8 h-8 text-slate-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="text-sm text-slate font-medium">
                Upload a thumbnail
              </p>
              <p className="text-xs text-slate-dark mt-0.5">
                PNG, JPG or GIF — recommended 16:9
              </p>
            </div>
            <Input
              type="file"
              disabled={loading}
              accept="image/*"
              onChange={handleThumbnailChange}
            />
          </div>
        )}

        {/* Replace input when preview exists */}
        {preview && (
          <Input
            type="file"
            disabled={loading}
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        )}
      </section>

      {/* ══════════════════════════
          Actions
      ══════════════════════════ */}
      <div className="flex justify-end gap-3 pt-2 border-t border-border">
        {/* Cancel — .btn-secondary / .btn-ghost from index.css */}
        <Button
          type="button"
          disabled={loading}
          onClick={onCancel} /* BUG FIX (carried): was onSubmit={onCancel} */
          className="btn-ghost px-6 py-2.5 rounded-xl text-sm font-semibold
                     border border-border
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cancel
        </Button>

        {/* Submit — .btn-primary from index.css (violet gradient + shadow) */}
        <Button
          type="submit"
          disabled={loading}
          className="btn-primary inline-flex items-center gap-2 px-6 py-2.5
                     rounded-xl text-sm font-semibold text-white
                     disabled:opacity-40 disabled:cursor-not-allowed
                     disabled:transform-none disabled:shadow-none"
        >
          {loading ? (
            <>
              {/* animate-spin is Tailwind default; the @keyframes are in index.css if needed */}
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
              Saving…
            </>
          ) : (
            submitText
          )}
        </Button>
      </div>
    </form>
  );
}

export default CourseForm;
