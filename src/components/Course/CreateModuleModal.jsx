import { useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import { Input, Textarea, Button } from "../index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createModule,
  fetchCourseModules,
} from "../../features/module/moduleSlice";

function CreateModuleModal({ open, onClose, courseId }) {
  const [submitError, setSubmitError] = useState("");
  const { modules } = useSelector((state) => state.module);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (open) {
      dispatch(fetchCourseModules({ courseId }));
    }
  }, [dispatch, courseId, open]);

  useEffect(() => {
    if (!open) {
      reset({ title: "", description: "" });
    }
  }, [open, reset]);

  const create = async (data) => {
    setSubmitError("");
    try {
      await dispatch(
        createModule({
          courseId,
          title: data.title,
          description: data.description,
          position: modules.length + 1,
        }),
      ).unwrap();
      reset();
      onClose();
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-4"
      style={{
        background: "rgba(8,12,26,0.8)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass2 w-full max-w-lg rounded-2xl border border-white/8 shadow-[0_24px_60px_rgba(0,0,0,0.5)] p-7">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-violet/15 border border-violet/25">
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
          </div>
          <h2 className="text-base font-bold text-white font-display">
            Create Module
          </h2>
        </div>

        <form onSubmit={handleSubmit(create)} className="space-y-5">
          {/* Error banner */}
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

          {/* Module Title */}
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

          {/* Module Description */}
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

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
                         bg-violet hover:bg-violet-dark transition-all
                         shadow-[0_4px_16px_rgba(124,90,247,0.3)]
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default CreateModuleModal;
