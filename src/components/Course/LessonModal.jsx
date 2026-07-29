import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import { Button, Input, Textarea } from "../index";
import { useSelector, useDispatch } from "react-redux";
import lessonStorage from "../../services/supabase/lesson/lesson.storage";
// import { supabase } from "../../services/supabase/supabaseClient";

import {
  createLesson,
  updateLesson,
  fetchModuleLessons,
} from "../../features/lesson/lessonSlice";

/**
 * Convert seconds to a human-readable duration string (e.g. "5m 32s").
 * Returns empty string if the value is invalid.
 */
function formatDuration(seconds) {
  if (seconds == null || Number.isNaN(seconds)) return "";
  seconds = Math.round(seconds);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }

  return `${secs}s`;
}

/**
 * LessonModal — reusable for both create and update.
 *
 * Props:
 *  - open     : boolean — controls visibility
 *  - onClose  : () => void — called after successful submit or cancel
 *  - moduleId : string — the parent module this lesson belongs to
 *  - lesson   : object | null — null = create mode, object = edit mode
 */
function LessonModal({ open, onClose, moduleId, lesson = null }) {
  // ─── Mode flag ────────────────────────────────────────────────
  const isEdit = Boolean(lesson);

  // ─── Local state ──────────────────────────────────────────────
  const [submitError, setSubmitError] = useState(""); // server/validation error banner
  const [videoFile, setVideoFile] = useState(null); // newly selected video file (create or replace)
  const [pdfFile, setPdfFile] = useState(null); // newly selected PDF file (create or replace)
  const [pickedDuration, setPickedDuration] = useState(null); // duration extracted from picked video
  const dispatch = useDispatch();
  const { lessons } = useSelector((s) => s.lesson); // used to calculate next position

  // ─── React Hook Form ──────────────────────────────────────────
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      isPreview: false,
    },
  });

  // ─── Derived preview URLs ─────────────────────────────────────
  // Prefer the newly picked file; fall back to existing lesson paths.
  // Computed inline — cheap enough that memoization isn't needed.
  const videoPreview = videoFile
    ? URL.createObjectURL(videoFile)
    : lesson?.video_path
      ? lessonStorage.getVideoUrl(lesson.video_path)
      : null;

  const pdfPreview = pdfFile
    ? URL.createObjectURL(pdfFile)
    : lesson?.pdf_path
      ? lessonStorage.getPdfUrl(lesson.pdf_path)
      : null;

  // Duration: newly picked value wins, otherwise use the saved lesson duration
  const videoDuration = pickedDuration ?? lesson?.duration ?? null;

  // ─── Form sync & cleanup ──────────────────────────────────────
  // When the modal opens in edit mode, pre-fill the form with lesson data.
  // When it closes, reset all local file state so the next open is clean.
  useEffect(() => {
    if (open && lesson) {
      reset({
        title: lesson.title ?? "",
        description: lesson.description ?? "",
        isPreview: lesson.is_preview ?? false,
      });
    } else if (open) {
      reset({ title: "", description: "", isPreview: false });
    }

    return () => {
      if (!open) {
        setVideoFile(null);
        setPdfFile(null);
        setPickedDuration(null);
        setSubmitError("");
      }
    };
  }, [open, lesson, reset]);

  // ─── Fetch lessons for position calculation ────────────────────
  // We need the current lesson count to assign the next position number.
  useEffect(() => {
    if (open) {
      dispatch(fetchModuleLessons({ moduleId }));
    }
  }, [dispatch, moduleId, open]);

  // ─── Video duration extraction ─────────────────────────────────
  // Creates a temporary hidden <video> element to read metadata.duration
  // from the selected file without playing it.
  function extractVideoDuration(file) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(video.duration);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      video.src = url;
    });
  }

  // ─── File selection handlers ───────────────────────────────────
  async function handleVideoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    // Extract and store duration so it can be sent with the lesson data
    const duration = await extractVideoDuration(file);
    setPickedDuration(Math.round(duration));
  }

  function handlePdfChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFile(file);
  }

  // ─── File removal handlers ─────────────────────────────────────
  function removeVideo() {
    setVideoFile(null);
    setPickedDuration(null);
  }

  function removePdf() {
    setPdfFile(null);
  }

  // ─── Form submission ──────────────────────────────────────────
  // Handles both create and update flows.
  // On success: resets form, clears file state, closes modal.
  // On failure: displays error in the banner.
  async function onSubmit(data) {
    setSubmitError("");
    try {
      if (isEdit) {
        // ── Update flow ──
        const lessonData = {
          title: data.title,
          description: data.description,
          is_preview: data.isPreview,
        };
        // Only update duration if a new video was picked
        if (videoFile) {
          lessonData.duration = videoDuration;
        }
        await dispatch(
          updateLesson({ lessonId: lesson.id, lessonData }),
        ).unwrap();
      } else {
        // ── Create flow ──
        // Video is required for new lessons
        if (!videoFile) {
          setSubmitError("Please upload a lesson video.");
          return;
        }
        await dispatch(
          createLesson({
            moduleId,
            title: data.title,
            description: data.description,
            videoFile,
            videoName: videoFile.name,
            pdfFile,
            pdfName: pdfFile?.name ?? null,
            isPreview: data.isPreview,
            duration: videoDuration,
            position: lessons.length + 1,
          }),
        ).unwrap();
      }

      // Success — clean up and close
      reset();
      setVideoFile(null);
      setPdfFile(null);
      setPickedDuration(null);
      onClose();
    } catch (error) {
      setSubmitError(error.message);
    }
  }

  // async function test() {
  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser();

  //   console.log("User ID:", user.id);

  //   const { data, error } = await supabase
  //     .from("courses")
  //     .select("id, teacher_id")
  //     .eq("id", "4dc8d8c6-444a-42b5-9d60-f677e9b5ae16")
  //     .single();

  //   console.log(data);
  // }

  // test();

  if (!open) return null;

  // ─── Portal: renders outside parent stacking contexts ──────────
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
      <div className="glass2 w-full max-w-2xl rounded-2xl border border-white/8 shadow-[0_24px_60px_rgba(0,0,0,0.5)] p-7 max-h-[90vh] overflow-y-auto scrollbar-none">
        {/* ── Modal Header ── */}
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
          <div>
            <h2 className="text-base font-bold text-white font-display">
              {isEdit ? "Update Lesson" : "Create Lesson"}
            </h2>
            <p className="text-[11px] text-slate-dark font-mono">
              {isEdit
                ? "Edit lesson details and files"
                : "Add a new lesson to this module"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* ── Error Banner ── */}
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

          {/* ── Lesson Title Field ── */}
          <div>
            <Input
              label="Lesson Title"
              placeholder="Enter lesson title..."
              {...register("title", {
                required: "Lesson title is required",
                minLength: { value: 5, message: "Minimum 5 characters" },
              })}
            />
            {errors?.title && (
              <p className="mt-1.5 text-xs text-coral font-mono">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* ── Lesson Description Field ── */}
          <div>
            <Textarea
              label="Lesson Description"
              placeholder="Enter lesson description..."
              rows={3}
              {...register("description", {
                required: "Description is required",
                maxLength: { value: 200, message: "Max 200 characters" },
              })}
            />
            {errors?.description && (
              <p className="mt-1.5 text-xs text-coral font-mono">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* ── Free Preview Toggle ── */}
          <div className="flex items-center justify-between rounded-xl border border-white/8 bg-glass-2 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Free Preview</p>
              <p className="text-[11px] text-slate-dark">
                Allow students to watch this lesson without enrolling
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...register("isPreview")}
              />
              <div
                className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:bg-teal transition-colors
                              after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5
                              after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all
                              peer-checked:after:translate-x-full"
              />
            </label>
          </div>

          {/* ── Video Upload Section ── */}
          <section className="glass rounded-2xl p-5 space-y-4">
            {/* Section header with title + duration badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-display">
                  Lesson Video
                </span>
                {!isEdit && (
                  <span className="text-[10px] font-mono text-coral">
                    Required
                  </span>
                )}
              </div>
              {/* Show extracted/saved duration when available */}
              {videoDuration !== null && (
                <span className="text-[10px] font-mono text-teal bg-teal-dim px-2 py-0.5 rounded-full border border-teal/25">
                  {formatDuration(videoDuration)}
                </span>
              )}
            </div>

            {/* Video player preview — shows when a video is selected or exists */}
            {videoPreview && (
              <div className="relative rounded-xl overflow-hidden border border-border">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-52 object-cover bg-black"
                />
                {/* Remove button overlay */}
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-coral/90 text-white
                             hover:bg-coral transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
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

            {/* Video drop-zone — shown when no video is selected */}
            {!videoPreview && (
              <label
                className="flex flex-col items-center justify-center gap-3 rounded-xl
                           border border-dashed border-border-2 bg-glass py-8 px-6 text-center
                           hover:border-violet/40 hover:bg-glass-2 transition-all cursor-pointer"
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
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-slate font-medium">
                    Upload a video
                  </p>
                  <p className="text-xs text-slate-dark mt-0.5">
                    MP4, WebM or MOV
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoChange}
                />
              </label>
            )}

            {/* Replace video button — shown after a video is loaded */}
            {videoPreview && (
              <label className="block">
                <div
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed
                                border-border-2 bg-glass hover:border-violet/40 hover:bg-glass-2 transition-all
                                cursor-pointer text-xs text-slate font-medium"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Replace video
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoChange}
                />
              </label>
            )}
          </section>

          {/* ── PDF Upload Section ── */}
          <section className="glass rounded-2xl p-5 space-y-4">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white font-display">
                Lesson File
              </span>
              <span className="text-[10px] font-mono text-slate-dark">
                Optional
              </span>
            </div>

            {/* PDF file card — shown when a PDF is selected or exists */}
            {pdfPreview && (
              <div className="relative flex items-center gap-3 rounded-xl border border-border bg-glass px-4 py-3">
                {/* PDF icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-coral-dim border border-coral/25">
                  <svg
                    className="w-5 h-5 text-coral"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                {/* File name + type */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white font-medium truncate">
                    {pdfFile?.name ?? lesson?.pdf_name ?? "Document"}
                  </p>
                  <p className="text-[11px] text-slate-dark">PDF file</p>
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={removePdf}
                  className="p-1.5 rounded-lg text-slate hover:text-coral hover:bg-coral-dim transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
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

            {/* PDF drop-zone — shown when no PDF is selected */}
            {!pdfPreview && (
              <label
                className="flex flex-col items-center justify-center gap-3 rounded-xl
                           border border-dashed border-border-2 bg-glass py-8 px-6 text-center
                           hover:border-teal/40 hover:bg-glass-2 transition-all cursor-pointer"
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
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-slate font-medium">
                    Upload a file
                  </p>
                  <p className="text-xs text-slate-dark mt-0.5">PDF only</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                />
              </label>
            )}

            {/* Replace PDF button — shown after a PDF is loaded */}
            {pdfPreview && (
              <label className="block">
                <div
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed
                                border-border-2 bg-glass hover:border-teal/40 hover:bg-glass-2 transition-all
                                cursor-pointer text-xs text-slate font-medium"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Replace file
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                />
              </label>
            )}
          </section>

          {/* ── Action Buttons ── */}
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

export default LessonModal;
