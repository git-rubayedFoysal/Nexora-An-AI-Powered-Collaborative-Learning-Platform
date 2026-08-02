// Create or edit module modal — renders via portal to escape stacking contexts
import { useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import { Input, Textarea, Button } from "../index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createModule,
  updateModule,
  fetchCourseModules,
} from "../../features/module/moduleSlice";
function ModuleModal({ open, onClose, courseId, module = null }) {
  // ── Mode flag ────────────────────────────────────────────────────────
  const isEdit = Boolean(module);

  // ── Local state ──────────────────────────────────────────────────────
  const [submitError, setSubmitError] = useState("");

  // ── Redux ────────────────────────────────────────────────────────────
  const { modules } = useSelector((state) => state.module);
  const dispatch = useDispatch();

  // ── React Hook Form ──────────────────────────────────────────────────
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { title: "", description: "" },
  });

  // ── Fetch modules on open ────────────────────────────────────────────
  // Needed to calculate the next position number for new modules
  useEffect(() => {
    if (open) {
      dispatch(fetchCourseModules({ courseId }));
    }
  }, [dispatch, courseId, open]);

  // ── Sync form with module data on open ───────────────────────────────
  // Edit mode: pre-fill with existing module title + description
  // Create mode: reset to empty fields
  useEffect(() => {
    if (open) {
      if (module) {
        reset({
          title: module.title ?? "",
          description: module.description ?? "",
        });
      } else {
        reset({ title: "", description: "" });
      }
    }
  }, [open, module, reset]);

  // ── Form submission ──────────────────────────────────────────────────
  // Handles both create and update flows.
  // On success: resets form and closes modal.
  // On failure: displays error in the banner.
  const onSubmit = async (data) => {
    setSubmitError("");
    try {
      if (isEdit) {
        // ── Update flow ──
        await dispatch(
          updateModule({
            moduleId: module.id,
            moduleData: { title: data.title, description: data.description },
          }),
        ).unwrap();
      } else {
        // ── Create flow ──
        // Position = current module count + 1 (appended at the end)
        await dispatch(
          createModule({
            courseId,
            title: data.title,
            description: data.description,
            position: modules.length + 1,
          }),
        ).unwrap();
      }
      reset();
      onClose();
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  // ── Don't render when closed ─────────────────────────────────────────
  if (!open) return null;

  // ── Portal: renders outside parent stacking contexts ──────────────────
  return createPortal(
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-4"
      style={{
        background: "rgba(8,12,26,0.8)",
        backdropFilter: "blur(6px)",
      }}
      // Close modal when clicking on the backdrop (outside the modal content)
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass2 w-full max-w-lg rounded-2xl border border-white/8 shadow-[0_24px_60px_rgba(0,0,0,0.5)] p-7">
        {/* ── Modal Header ── */}
        {/* Icon changes color based on mode: violet for create, teal for edit */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border
              ${isEdit ? "bg-teal-dim border-teal/25" : "bg-violet/15 border-violet/25"}`}
          >
            {isEdit ? (
              // Pencil icon for edit mode
              <svg
                className="w-5 h-5 text-teal-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            ) : (
              // Plus icon for create mode
              <svg
                className="w-5 h-5 text-violet-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            )}
          </div>
          <h2 className="text-base font-bold text-white font-display">
            {isEdit ? "Update Module" : "Create Module"}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* ── Error Banner ── */}
          {/* Shown when createModule/updateModule thunk rejects */}
          {submitError && (
            <div className="flex items-start gap-3 rounded-2xl border border-coral/25 bg-coral-dim px-5 py-4">
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
              <p className="text-sm text-coral leading-relaxed">
                {submitError}
              </p>
            </div>
          )}

          {/* ── Module Title Field ── */}
          {/* Required, min 4 characters */}
          <div>
            <Input
              label="Module Title"
              placeholder="Enter module title..."
              {...register("title", {
                required: "Module title is required",
                minLength: { value: 4, message: "Minimum 4 characters" },
              })}
            />
            {errors?.title && (
              <p className="mt-1.5 text-xs text-coral font-mono">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* ── Module Description Field ── */}
          {/* Required, max 200 characters */}
          <div>
            <Textarea
              label="Module Description"
              placeholder="Enter module description..."
              rows={3}
              {...register("description", {
                required: "Description is required",
                maxLength: {
                  value: 200,
                  message: "Description should be less than 200 characters",
                },
              })}
            />
            {errors?.description && (
              <p className="mt-1.5 text-xs text-coral font-mono">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex gap-3 pt-1">
            {/* Cancel — closes modal without saving */}
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate
                         border border-border hover:text-white hover:bg-glass-2 transition-all
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            {/* Submit — creates or updates the module */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all
                disabled:opacity-60 disabled:cursor-not-allowed ${
                  isEdit
                    ? "bg-teal hover:bg-teal-light shadow-[0_4px_16px_rgba(15,191,138,0.3)]"
                    : "bg-violet hover:bg-violet-dark shadow-[0_4px_16px_rgba(124,90,247,0.3)]"
                }`}
            >
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update"
                  : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default ModuleModal;
