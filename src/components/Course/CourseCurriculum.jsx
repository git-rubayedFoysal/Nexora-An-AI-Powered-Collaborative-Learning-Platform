import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCourseModules,
  deleteModule,
} from "../../features/module/moduleSlice";
import {
  fetchModuleLessons,
  deleteLesson,
} from "../../features/lesson/lessonSlice";
import {
  EditModuleModal,
  DeleteConfirmModal,
  CreateLessonModal,
  EditLessonModal,
} from "..";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Convert seconds to human-readable duration (e.g. "4m 32s", "1h 5m") */
function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return "0m";
  // Get full hours from total seconds
  const h = Math.floor(seconds / 3600);
  // Get remaining minutes after removing hours
  const m = Math.floor((seconds % 3600) / 60);
  // Get leftover seconds
  const s = Math.floor(seconds % 60);
  // Format based on largest unit: hours > minutes > seconds
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * CourseCurriculum
 *
 * Renders the course curriculum with expandable modules.
 * Each module shows a row with chevron toggle + title.
 * Clicking a module expands it to show lessons (lazy-loaded).
 *
 * Roles:
 *  - Student:  sees lesson list with play/lock icons per attachment (video/PDF)
 *  - Teacher/Admin: sees edit/delete buttons per lesson + "Add Lesson" controls
 */
function CourseCurriculum({ courseId, isEnrolled = false }) {
  const dispatch = useDispatch();

  // ── Modal state ──────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null); // module to delete
  const [editTarget, setEditTarget] = useState(null); // module to edit
  const [addLessonTarget, setAddLessonTarget] = useState(null); // module to add lesson to
  const [lessonDeleteTarget, setLessonDeleteTarget] = useState(null); // lesson to delete
  const [editLessonTarget, setEditLessonTarget] = useState(null); // lesson to edit

  // ── Expand/collapse state ────────────────────────────────────────────────
  const [expandedModules, setExpandedModules] = useState(new Set()); // Set of expanded module IDs

  // ── Lesson data per module ───────────────────────────────────────────────
  // Keyed by moduleId → lessons[] array, populated lazily on expand
  const [moduleLessons, setModuleLessons] = useState({});

  // ── Per-module loading indicators ────────────────────────────────────────
  const [loadingModules, setLoadingModules] = useState(new Set());

  // ── Redux selectors ──────────────────────────────────────────────────────
  const { userData } = useSelector((s) => s.auth);
  const { modules } = useSelector((s) => s.module);

  const isStudent = userData?.role?.toLowerCase() === "student";
  const isEmpty = modules.length === 0;

  // ── Fetch all modules for this course on mount ───────────────────────────
  useEffect(() => {
    dispatch(fetchCourseModules({ courseId }));
  }, [dispatch, courseId]);

  // ── Lazy-load lessons for a single module ────────────────────────────────
  // Only runs when user first clicks to expand a module.
  // Step 1: Mark module as loading (shows spinner)
  // Step 2: Ask Redux for lessons from Supabase
  // Step 3: Store result in local cache keyed by moduleId
  // Step 4: Remove loading indicator when done (success or error)
  const loadModuleLessons = useCallback(
    (moduleId) => {
      // Step 1: Add moduleId to loading set → shows spinner
      setLoadingModules((prev) => {
        const next = new Set(prev);
        next.add(moduleId);
        return next;
      });
      // Step 2 & 3: Fetch from Supabase, store in local cache
      dispatch(fetchModuleLessons({ moduleId }))
        .unwrap()
        .then((data) => {
          setModuleLessons((prev) => ({ ...prev, [moduleId]: data || [] }));
        })
        .catch(() => {})
        .finally(() => {
          // Step 4: Remove from loading set → hides spinner
          setLoadingModules((prev) => {
            const next = new Set(prev);
            next.delete(moduleId);
            return next;
          });
        });
    },
    [dispatch],
  );

  // ── Refresh lessons for a module (after create/edit/delete) ──────────────
  // Same steps as loadModuleLessons, but called after mutations to get fresh data.
  // Step 1: Mark module as loading
  // Step 2: Fetch fresh lessons from Supabase
  // Step 3: Update local cache with new data
  // Step 4: Clear loading indicator
  const refreshModuleLessons = useCallback(
    (moduleId) => {
      // Step 1: Show spinner for this module
      setLoadingModules((prev) => {
        const next = new Set(prev);
        next.add(moduleId);
        return next;
      });
      // Step 2 & 3: Refetch and update cache
      dispatch(fetchModuleLessons({ moduleId }))
        .unwrap()
        .then((data) => {
          setModuleLessons((prev) => ({ ...prev, [moduleId]: data || [] }));
        })
        .catch(() => {})
        .finally(() => {
          // Step 4: Hide spinner
          setLoadingModules((prev) => {
            const next = new Set(prev);
            next.delete(moduleId);
            return next;
          });
        });
    },
    [dispatch],
  );

  // ── Toggle module expand/collapse ────────────────────────────────────────
  // Step 1: If already expanded → collapse it (remove from set)
  // Step 2: If collapsed → expand it (add to set)
  // Step 3: Lazy-load lessons only on first expand (if not cached yet)
  const toggleModule = useCallback(
    (moduleId) => {
      setExpandedModules((prev) => {
        const next = new Set(prev);
        // Step 1: Already expanded → collapse
        if (next.has(moduleId)) {
          next.delete(moduleId);
          return next;
        }
        // Step 2: Collapsed → expand
        next.add(moduleId);
        // Step 3: Lazy-load only on first expand
        if (!moduleLessons[moduleId]) {
          loadModuleLessons(moduleId);
        }
        return next;
      });
    },
    [moduleLessons, loadModuleLessons],
  );

  // ── Delete module handler ────────────────────────────────────────────────
  // Step 1: Delete module from Supabase via Redux
  // Step 2: Remove cached lessons for this module
  // Step 3: Remove from expanded set if it was open
  // Step 4: Close the delete modal
  async function handleDelete() {
    const deletedId = deleteTarget.id;
    // Step 1: Delete from database
    await dispatch(deleteModule({ moduleId: deletedId }));
    // Step 2: Remove lessons cache for deleted module
    setModuleLessons((prev) => {
      const next = { ...prev };
      delete next[deletedId];
      return next;
    });
    // Step 3: Remove from expanded set if it was open
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.delete(deletedId);
      return next;
    });
    // Step 4: Close modal
    setDeleteTarget(null);
  }

  // ── Delete lesson handler ────────────────────────────────────────────────
  // Step 1: Delete lesson + its video/PDF files from Supabase storage
  // Step 2: Refresh parent module's lesson list
  // Step 3: Close the delete modal
  async function handleDeleteLesson() {
    if (!lessonDeleteTarget) return;
    try {
      // Step 1: Delete lesson row + video/PDF files from storage
      await dispatch(
        deleteLesson({
          lessonId: lessonDeleteTarget.id,
          videoPath: lessonDeleteTarget.video_path,
          pdfPath: lessonDeleteTarget.pdf_path,
        }),
      ).unwrap();
      // Step 2: Refresh parent module's lessons
      refreshModuleLessons(lessonDeleteTarget.module_id);
    } catch {
      // error handled in slice
    } finally {
      // Step 3: Close modal
      setLessonDeleteTarget(null);
    }
  }

  // ── Lesson saved callback (create or edit) ───────────────────────────────
  // Called when a lesson modal closes after successful save.
  // Step 1: Refresh lessons for the module we added a lesson to
  // Step 2: Refresh lessons for the module we edited a lesson in
  // Step 3: Clear both modal target states
  function handleLessonSaved() {
    // Step 1: Refresh if we were adding a lesson
    if (addLessonTarget?.id) {
      refreshModuleLessons(addLessonTarget.id);
    }
    // Step 2: Refresh if we were editing a lesson
    if (editLessonTarget?.module_id) {
      refreshModuleLessons(editLessonTarget.module_id);
    }
    // Step 3: Clear modal targets (closes modals)
    setAddLessonTarget(null);
    setEditLessonTarget(null);
  }

  // ── Empty state ──────────────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <>
        <div
          className="flex flex-col items-center justify-center py-10 gap-3
                        rounded-xl border border-dashed border-border-2 bg-glass"
        >
          <span className="text-3xl">📋</span>
          <p className="text-sm font-semibold text-white">No curriculum yet</p>
          <p className="text-xs text-slate-dark text-center max-w-xs">
            Lessons and modules will appear here once the instructor publishes
            course content.
          </p>
        </div>
      </>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-2">
        {modules.map((mod) => {
          // Per-module computed values
          const isExpanded = expandedModules.has(mod.id);
          const lessons = moduleLessons[mod.id] || [];
          const isLoading = loadingModules.has(mod.id);
          // Sum all lesson durations for the collapsed summary badge
          const totalDuration = lessons.reduce(
            (sum, l) => sum + (l.duration || 0),
            0,
          );

          return (
            <div key={mod.id}>
              {/* ── Module Row ────────────────────────────────────────────── */}
              <div
                className="group flex items-center justify-between gap-3 px-4 py-3
                             rounded-xl border border-white/8 bg-glass-2
                             hover:border-white/15 transition-colors cursor-pointer select-none"
                onClick={() => toggleModule(mod.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleModule(mod.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                {/* Left: chevron + position number + title + summary badge */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Chevron icon, rotates 180° when expanded */}
                  <svg
                    className={`w-4 h-4 text-slate-dark shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  {/* Module position number */}
                  <span className="text-[11px] font-mono text-slate-dark w-5 font-bold text-right shrink-0">
                    {String(mod.position).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {mod.title}
                    </p>
                    {mod.description && (
                      <p className="text-[11px] text-slate-dark truncate mt-0.5">
                        {mod.description}
                      </p>
                    )}
                    {/* Lesson count + total duration summary (shown when collapsed & lessons loaded) */}
                    {lessons.length > 0 && !isExpanded && isStudent && (
                      <p className="text-[10px] text-slate-dark mt-0.5">
                        {lessons.length} lesson
                        {lessons.length !== 1 && "s"} ·{" "}
                        {formatDuration(totalDuration)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: module action buttons (teacher & admin only) */}
                {!isStudent && (
                  <div
                    className="flex items-center gap-2 shrink-0"
                    // Stop propagation so clicking buttons doesn't toggle expand
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    {/* Add Lesson — opens CreateLessonModal for this module */}
                    <button
                      className="p-2 rounded-lg border border-white/10 text-slate
                                 hover:text-violet-light hover:border-violet/30 transition-colors"
                      title="Add Lesson"
                      onClick={() => setAddLessonTarget(mod)}
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>

                    {/* Edit Module — opens EditModuleModal */}
                    <button
                      className="p-2 rounded-lg border border-white/10 text-slate
                                 hover:text-teal hover:border-teal/30 transition-colors"
                      title="Edit module"
                      onClick={() => setEditTarget(mod)}
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    {/* Delete Module — opens DeleteConfirmModal */}
                    <button
                      className="p-2 rounded-lg border border-white/10 text-slate
                                 hover:text-coral hover:border-coral/30 transition-colors"
                      title="Delete module"
                      onClick={() => setDeleteTarget(mod)}
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* ── Expanded Lessons Section ──────────────────────────────── */}
              {isExpanded && (
                <div className="ml-6 mt-1 mb-2 rounded-xl border border-white/5 bg-white/5 overflow-hidden">
                  {/* Three possible states for expanded content: */}
                  {isLoading ? (
                    /* State 1: Loading — show spinner while fetching lessons */
                    <div className="px-5 py-6 text-center">
                      <p className="text-xs text-slate-dark">
                        Loading lessons…
                      </p>
                    </div>
                  ) : lessons.length === 0 ? (
                    /* State 2: Empty — no lessons yet in this module */
                    <div className="px-5 py-6 text-center">
                      <p className="text-xs text-slate-dark">
                        No lessons in this module yet.
                      </p>
                      {/* Teacher/Admin: show "Add first lesson" link */}
                      {!isStudent && (
                        <button
                          onClick={() => setAddLessonTarget(mod)}
                          className="mt-2 text-[11px] text-violet-light hover:underline"
                        >
                          + Add first lesson
                        </button>
                      )}
                    </div>
                  ) : (
                    /* State 3: Has lessons — render lesson list */
                    <div className="divide-y divide-white/5">
                      {lessons.map((lesson) => (
                        <div key={lesson.id}>
                          {/* ── Main lesson row ──────────────────────────── */}
                          <div className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/3 transition-colors">
                            {/* Lesson position number: "01", "02", etc. */}
                            <span className="text-[10px] font-mono text-slate-dark w-5 text-right shrink-0">
                              {String(lesson.position).padStart(2, "0")}
                            </span>

                            {/* Lesson title */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-white/80 truncate">
                                {lesson.title}
                              </p>
                            </div>

                            {/* Lesson duration */}
                            <span className="text-[10px] text-slate-dark shrink-0">
                              {formatDuration(lesson.duration)}
                            </span>

                            {/* Student: play button (if enrolled or preview) or lock icon (restricted) */}
                            {isStudent && (
                              <span className="shrink-0">
                                {isEnrolled || lesson.is_preview ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log("Play preview:", lesson.id);
                                    }}
                                    className="p-1.5 rounded-md text-teal hover:bg-teal/10 transition-colors"
                                    title="Play Preview"
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </button>
                                ) : (
                                  <svg
                                    className="w-3 h-3 text-slate-dark"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  </svg>
                                )}
                              </span>
                            )}

                            {/* Teacher/Admin: edit & delete buttons per lesson */}
                            {!isStudent && (
                              <div
                                className="flex items-center gap-1 shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* Edit lesson — opens CreateLessonModal in edit mode */}
                                <button
                                  onClick={() => setEditLessonTarget(lesson)}
                                  className="p-1.5 rounded-md text-slate hover:text-teal hover:bg-teal/10 transition-colors"
                                  title="Edit Lesson"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                {/* Delete lesson — opens DeleteConfirmModal */}
                                <button
                                  onClick={() => setLessonDeleteTarget(lesson)}
                                  className="p-1.5 rounded-md text-slate hover:text-coral hover:bg-coral/10 transition-colors"
                                  title="Delete Lesson"
                                >
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>

                          {/* ── Video sub-row ──────────────────────────── */}
                          {/* Indented row below lesson — only shown if lesson has a video file */}
                          {lesson.video_path && (
                            <div className="flex items-center gap-3 pl-12 pr-5 py-1.5 hover:bg-white/2 transition-colors">
                              {/* Video camera icon (violet) */}
                              <svg
                                className="w-3 h-3 text-violet-light shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              {/* Video filename */}
                              <span className="text-[11px] text-slate truncate flex-1 min-w-0">
                                {lesson.video_name || "Video"}
                              </span>
                              {/* Student: play (enrolled) or lock (non-enrolled non-preview) */}
                              {isStudent &&
                                (isEnrolled || lesson.is_preview ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log("Play video:", lesson.id);
                                    }}
                                    className="p-1 rounded text-teal hover:bg-teal/10 transition-colors shrink-0"
                                    title="Play Video"
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </button>
                                ) : (
                                  <svg
                                    className="w-3 h-3 text-slate-dark shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  </svg>
                                ))}
                            </div>
                          )}

                          {/* ── PDF sub-row ───────────────────────────── */}
                          {/* Indented row below lesson — only shown if lesson has a PDF file */}
                          {lesson.pdf_path && (
                            <div className="flex items-center gap-3 pl-12 pr-5 py-1.5 hover:bg-white/2 transition-colors">
                              {/* PDF document icon (coral) */}
                              <svg
                                className="w-3 h-3 text-coral shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                              {/* PDF filename */}
                              <span className="text-[11px] text-slate truncate flex-1 min-w-0">
                                {lesson.pdf_name || "PDF"}
                              </span>
                              {/* Student: open (enrolled) or lock (non-enrolled non-preview) */}
                              {isStudent &&
                                (isEnrolled || lesson.is_preview ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log("Open PDF:", lesson.id);
                                    }}
                                    className="p-1 rounded text-teal hover:bg-teal/10 transition-colors shrink-0"
                                    title="Open PDF"
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  </button>
                                ) : (
                                  <svg
                                    className="w-3 h-3 text-slate-dark shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  </svg>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Add Lesson button (teacher/admin, bottom of expanded section) ── */}
                  {!isStudent && lessons.length > 0 && (
                    <div className="px-5 py-2.5 border-t border-white/5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddLessonTarget(mod);
                        }}
                        className="flex items-center gap-1.5 text-[11px] text-violet-light hover:text-violet transition-colors"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Lesson
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {/* All modals rendered at root level (outside module list).
          Each opens when its target state is non-null.
          onClose callbacks either refresh data or clear state. */}

      {/* Delete Module — confirmation dialog */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        itemName={deleteTarget?.title}
        feature="Module"
      />

      {/* Delete Lesson — confirmation dialog */}
      <DeleteConfirmModal
        isOpen={Boolean(lessonDeleteTarget)}
        onConfirm={handleDeleteLesson}
        onClose={() => setLessonDeleteTarget(null)}
        itemName={lessonDeleteTarget?.title}
        feature="Lesson"
      />

      {/* Edit Module — opens ModuleModal in edit mode */}
      <EditModuleModal
        open={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        courseId={courseId}
        module={editTarget}
      />

      {/* Add Lesson — opens LessonModal in create mode */}
      <CreateLessonModal
        open={Boolean(addLessonTarget)}
        onClose={handleLessonSaved}
        moduleId={addLessonTarget?.id}
      />

      {/* Edit Lesson — opens LessonModal in edit mode */}
      {editLessonTarget && (
        <EditLessonModal
          open={Boolean(editLessonTarget)}
          onClose={handleLessonSaved}
          moduleId={editLessonTarget.module_id}
          lesson={editLessonTarget}
        />
      )}
    </>
  );
}

export default CourseCurriculum;
