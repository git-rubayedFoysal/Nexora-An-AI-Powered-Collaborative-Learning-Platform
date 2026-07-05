import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, Textarea } from "../index";

const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const COURSE_STATUS = ["draft", "published"];

function CourseForm({
  initialData = {},
  loading = false,
  submitText = "Create Course",
  onSubmit,
  onCancel = () => {},
}) {
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [preview, setPreview] = useState(initialData.thumbnail_url || null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      category: initialData.category || "",
      level: initialData.level || "",
      price: initialData.price || "",
      status: initialData.status || "draft",
    },
  });

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (data) => {
    setSubmitError("");
    if (!thumbnailFile && !initialData.thumbnail_url) {
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
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        level: initialData.level,
        price: initialData.price,
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  return (
    // CHANGED: was "space-y-8" only — added text-white so all labels inherit color
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6 text-white"
    >
      {/* ── Submit error banner ── */}
      {/* CHANGED: was "rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300"
                  now uses Nexora's coral token (coral = destructive / error color) */}
      {submitError && (
        <div
          className="flex items-start gap-3 rounded-2xl border border-coral/30
                        bg-coral/10 px-5 py-4"
        >
          {/* error icon */}
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

      {/* ══════════════════════════════════════
          SECTION — Basic Information
      ══════════════════════════════════════ */}
      {/* CHANGED: was "rounded-3xl border border-slate-800 bg-slate-950/80 p-8 space-y-6"
                  now uses Nexora's glass utility + border-white/[.06] + rounded-2xl */}
      <section className="glass rounded-2xl border border-white/6 p-6 space-y-6">
        {/* Section label */}
        {/* CHANGED: new addition — Nexora uses monospaced ALL-CAPS section labels
                    (same pattern as sidebar section titles and stat card sub-labels) */}
        <div className="flex items-center gap-3 pb-2 border-b border-white/5">
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
              maxLength: { value: 5, message: "Minimum 5 characters" },
            })}
          />
          {/* CHANGED: was "text-red-400 text-sm" → coral token + font-mono */}
          {errors.title && (
            <p className="mt-1.5 text-xs text-coral font-mono">
              {errors.title.message}
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

        {/* Category + Level row */}
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

        {/* Price + Status row */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <Input
              label="Price (BDT)"
              type="number"
              disabled={loading}
              min={0}
              placeholder="0  —  enter 0 for free"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 0, message: "Price cannot be negative" },
              })}
            />
            {/* CHANGED: was checking errors.description (copy-paste bug in original)
                        now correctly checks errors.price — logic fix inside restyle */}
            {errors.price && (
              <p className="mt-1.5 text-xs text-coral font-mono">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <Select
              label="Status"
              options={COURSE_STATUS}
              disabled={loading}
              {...register("status")}
            />
            {/* CHANGED: was checking errors.description (copy-paste bug in original)
                        now correctly checks errors.status */}
            {errors.status && (
              <p className="mt-1.5 text-xs text-coral font-mono">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION — Thumbnail
      ══════════════════════════════════════ */}
      {/* CHANGED: was "rounded-3xl border border-slate-800 bg-slate-950/80 p-8"
                  → Nexora glass card, same pattern as Basic Information section */}
      <section className="glass rounded-2xl border border-white/6 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-2 border-b border-white/5">
          <span
            className="text-[10px] font-semibold font-mono text-slate-dark
                           uppercase tracking-widest"
          >
            Course Thumbnail
          </span>
        </div>

        {/* Preview image */}
        {/* CHANGED: was "border border-slate-700" → border-white/[.08]
                    added a bottom gradient scrim (same as CourseCard thumbnail) */}
        {preview && (
          <div
            className="relative w-full h-52 rounded-xl overflow-hidden
                          border border-white/8"
          >
            <img
              src={preview}
              alt="Course Thumbnail"
              className="w-full h-full object-cover brightness-90"
            />
            {/* bottom scrim so the file picker below doesn't feel disconnected */}
            <div
              className="absolute inset-x-0 bottom-0 h-12
                            bg-linear-to-t from-navy/70 to-transparent"
            />
            {/* CHANGED: new — small "Change" chip overlaid on preview */}
            <span
              className="absolute bottom-3 right-3 text-[10px] font-semibold font-mono
                             px-2.5 py-1 rounded-full bg-white/10 text-white
                             border border-white/20 backdrop-blur-sm"
            >
              Click below to change
            </span>
          </div>
        )}

        {/* File input */}
        {/* CHANGED: wrapped in a styled drop-zone shell when no preview exists */}
        {!preview && (
          <div
            className="flex flex-col items-center justify-center gap-3
                          rounded-xl border border-dashed border-white/12
                          bg-white/2 py-10 px-6 text-center
                          hover:border-violet/40 hover:bg-violet/3
                          transition-all duration-200"
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

        {/* Show plain file input again when preview exists (to allow replacement) */}
        {preview && (
          <Input
            type="file"
            disabled={loading}
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        )}
      </section>

      {/* ══════════════════════════════════════
          ACTION BUTTONS
      ══════════════════════════════════════ */}
      {/* CHANGED: was "flex justify-end gap-4"
                  added a subtle top divider + Nexora button tokens */}
      <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
        {/* Cancel */}
        {/* CHANGED: was className="secondary" (custom class, unclear styles)
                    now explicit Nexora ghost button: slate border, hover white */}
        <Button
          type="button"
          disabled={loading}
          onClick={
            onCancel
          } /* CHANGED: was onSubmit={onCancel} — wrong event prop */
          className="px-6 py-2.5 rounded-xl text-sm font-semibold
                     text-slate border border-white/8
                     hover:text-white hover:border-white/18 hover:bg-white/5
                     transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cancel
        </Button>

        {/* Submit */}
        {/* CHANGED: was default Button (no explicit classes)
                    now violet gradient CTA matching Nexora's primary action token */}
        <Button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
                     text-sm font-semibold text-white
                     bg-linear-to-br from-violet to-violet-light
                     shadow-[0_4px_20px_rgba(124,90,247,.35)]
                     hover:shadow-[0_6px_28px_rgba(124,90,247,.5)]
                     hover:-translate-y-px transition-all duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed
                     disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {loading ? (
            <>
              {/* CHANGED: spinner added for loading state — was plain "Saving..." text */}
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
