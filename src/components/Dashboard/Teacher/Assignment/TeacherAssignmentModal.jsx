/**
 * TeacherAssignmentModal
 *
 * Portal-based modal for creating or editing an assignment.
 * Covers the full lifecycle: course/module selection, form fields,
 * attachment handling, and submission with optimistic Redux sync.
 *
 * Responsibilities:
 *  - Fetch the teacher's courses, modules, and existing module assignments on open
 *  - Validate form inputs via react-hook-form (title, description, instructions, due date, max score)
 *  - Dispatch createAssignment or updateAssignment thunks on submit
 *  - Manage attachment upload state (create mode) or display existing attachment (edit mode)
 *  - Render inside a React Portal so the backdrop covers the entire viewport
 *
 * Props:
 *  - open         — controls modal visibility
 *  - onClose      — callback when the modal is dismissed
 *  - assignment   — assignment object to edit, or null for create mode
 */

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Textarea } from "../../../index";
import { fetchAllTeacherCourses } from "../../../../features/course/courseSlice";
import { fetchCourseModules } from "../../../../features/module/moduleSlice";
import {
  createAssignment,
  updateAssignment,
  fetchModuleAssignments,
} from "../../../../features/assignment/assignmentSlice";
import toDatetimeLocal from "../../../../utils/toDatetimeLocal";
import AttachmentSection from "./AttachmentSection";

function TeacherAssignmentModal({ open, onClose, assignment = null }) {
  // ── Edit mode flag ──
  const isEdit = Boolean(assignment);

  // ── Local state ──
  const dispatch = useDispatch();
  const [courseId, setCourseId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [submitError, setSubmitError] = useState("");

  // ── Redux selectors ──
  const { allTeacherCourses } = useSelector((state) => state.course);
  const { modules } = useSelector((state) => state.module);
  const { moduleAssignments } = useSelector((state) => state.assignment);

  // ── React Hook Form ──
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // In edit mode the course/module are locked to the assignment's own values
  const effectiveCourseId = isEdit
    ? (assignment.modules?.course_id ?? "")
    : courseId;
  const effectiveModuleId = isEdit ? (assignment.module_id ?? "") : moduleId;

  // ── Effects: fetch dependent data on open ──

  // Load the teacher's courses when the modal opens
  useEffect(() => {
    if (open) {
      dispatch(fetchAllTeacherCourses());
    }
  }, [dispatch, open]);

  // Load the modules for the selected course
  useEffect(() => {
    if (open && effectiveCourseId) {
      dispatch(fetchCourseModules({ courseId: effectiveCourseId }));
    }
  }, [dispatch, open, effectiveCourseId]);

  // Load existing assignments so we can calculate the next position number
  useEffect(() => {
    if (open && effectiveModuleId) {
      dispatch(fetchModuleAssignments({ moduleId: effectiveModuleId }));
    }
  }, [dispatch, open, effectiveModuleId]);

  // Fill the form when editing, clear it when creating
  useEffect(() => {
    if (!open) return;

    reset({
      title: assignment?.title ?? "",
      description: assignment?.description ?? "",
      instructions: assignment?.instructions ?? "",
      dueDate: assignment?.due_date ? toDatetimeLocal(assignment.due_date) : "",
      maxScore: assignment?.max_score ?? "",
    });
  }, [open, assignment, reset]);

  // ── Handlers ──

  // Pick a course and reset the module selection back to empty
  function handleCourseChange(e) {
    setCourseId(e.target.value);
    setModuleId("");
  }

  // Save the assignment to the database
  async function onSubmit(data) {
    setSubmitError("");
    try {
      if (isEdit) {
        await dispatch(
          updateAssignment({
            assignmentId: assignment.id,
            assignmentData: {
              title: data.title,
              description: data.description,
              instructions: data.instructions,
              due_date: new Date(data.dueDate).toISOString(),
              max_score: Number(data.maxScore),
            },
          }),
        ).unwrap();
      } else {
        if (!effectiveCourseId || !effectiveModuleId) {
          setSubmitError("Please select a course and a module.");
          return;
        }

        await dispatch(
          createAssignment({
            moduleId: effectiveModuleId,
            title: data.title,
            description: data.description,
            instructions: data.instructions,
            attachmentName: attachmentFile?.name ?? null,
            attachmentFile: attachmentFile ?? null,
            dueDate: new Date(data.dueDate).toISOString(),
            maxScore: Number(data.maxScore),
            position: moduleAssignments.length + 1,
          }),
        ).unwrap();
      }

      reset();
      setAttachmentFile(null);
      onClose();
    } catch (error) {
      setSubmitError(error.message);
    }
  }

  if (!open) return null;

  // ── Render via Portal so the backdrop covers the full viewport ──
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
        {/* Header with icon */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border
              ${isEdit ? "bg-teal-dim border-teal/25" : "bg-violet/15 border-violet/25"}`}
          >
            {isEdit ? (
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
              {isEdit ? "Update Assignment" : "Create Assignment"}
            </h2>
            <p className="text-[11px] text-slate-dark font-mono">
              {isEdit
                ? "Edit assignment details"
                : "Add a new assignment to a module"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* ── Submit error banner ── */}
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

          {/* ── Course selection ── */}
          <div>
            <label className="block text-[11px] font-semibold text-slate uppercase tracking-wider mb-1.5">
              Course
            </label>
            <select
              className="nx-input w-full px-3.5 py-3 rounded-lg text-sm bg-white/5 border-2 border-[#3e3e3e] text-white transition-all"
              value={effectiveCourseId}
              onChange={handleCourseChange}
              disabled={isEdit}
            >
              <option style={{ backgroundColor: "var(--color-navy-3)", color: "#e8eaf6" }} value="">Select Course...</option>
              {allTeacherCourses.map((course) => (
                <option
                  style={{
                    backgroundColor: "var(--color-navy-3)",
                    color: "#e8eaf6",
                  }}
                  key={course.id}
                  value={course.id}
                >
                  {course.title}
                </option>
              ))}
            </select>
            {isEdit && (
              <p className="mt-1.5 text-[11px] text-slate-dark font-mono">
                Course cannot be changed when editing.
              </p>
            )}
          </div>

          {/* ── Module selection ── */}
          <div>
            <label className="block text-[11px] font-semibold text-slate uppercase tracking-wider mb-1.5">
              Module
            </label>
            <select
              className="nx-input w-full px-3.5 py-3 rounded-lg text-sm bg-white/5 border-2 border-[#3e3e3e] text-white transition-all"
              value={effectiveModuleId}
              onChange={(e) => setModuleId(e.target.value)}
              disabled={isEdit}
            >
              <option style={{ backgroundColor: "var(--color-navy-3)", color: "#e8eaf6" }} value="">Select Module...</option>
              {modules.map((mod) => (
                <option
                  style={{
                    backgroundColor: "var(--color-navy-3)",
                    color: "#e8eaf6",
                  }}
                  key={mod.id}
                  value={mod.id}
                >
                  {mod.title}
                </option>
              ))}
            </select>
          </div>

          {/* ── Assignment title ── */}
          <div>
            <Input
              label="Assignment Title"
              placeholder="Enter assignment title..."
              {...register("title", {
                required: "Assignment title is required",
                minLength: { value: 5, message: "Minimum 5 characters" },
              })}
            />
            {errors?.title && (
              <p className="mt-1.5 text-xs text-coral font-mono">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* ── Description ── */}
          <div>
            <Textarea
              label="Assignment Description"
              placeholder="Enter assignment description..."
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

          {/* ── Instructions ── */}
          <div>
            <Textarea
              label="Assignment Instructions"
              placeholder="Enter assignment instructions..."
              rows={3}
              {...register("instructions", {
                required: "Instructions is required",
                maxLength: { value: 200, message: "Max 200 characters" },
              })}
            />
            {errors?.instructions && (
              <p className="mt-1.5 text-xs text-coral font-mono">
                {errors.instructions.message}
              </p>
            )}
          </div>

          {/* ── Due date + max score ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Due Date"
                type="datetime-local"
                {...register("dueDate", { required: "Due date is required" })}
              />
              {errors?.dueDate && (
                <p className="mt-1.5 text-xs text-coral font-mono">
                  {errors.dueDate.message}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Max Score"
                type="number"
                min={1}
                placeholder="e.g. 100"
                {...register("maxScore", {
                  required: "Max score is required",
                  min: { value: 1, message: "Must be at least 1" },
                })}
              />
              {errors?.maxScore && (
                <p className="mt-1.5 text-xs text-coral font-mono">
                  {errors.maxScore.message}
                </p>
              )}
            </div>
          </div>

          {/* Attachment — upload on create, read-only info on edit */}
          <AttachmentSection
            isEdit={isEdit}
            assignment={assignment}
            attachmentFile={attachmentFile}
            setAttachmentFile={setAttachmentFile}
            setSubmitError={setSubmitError}
          />

          {/* ── Action buttons ── */}
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

export default TeacherAssignmentModal;
