/**
 * CourseCurriculum
 *
 * Top-level orchestrator for the course curriculum section.
 * Manages state (modals, expand/collapse, lesson data) and composes
 * ModuleRow, LessonsPanel, and modal components.
 *
 * Responsibilities:
 *  - Fetch modules for this course on mount
 *  - Lazy-load lessons per module on first expand
 *  - Handle module/lesson CRUD operations
 *  - Update course stats after lesson changes
 *  - Render all modal dialogs
 *
 * Props:
 *  - courseId    — the course ID
 *  - isEnrolled — whether the current student is enrolled (for play/lock)
 */

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCourseModules,
  deleteModule,
} from "../../../features/module/moduleSlice";
import {
  fetchModuleLessons,
  deleteLesson,
} from "../../../features/lesson/lessonSlice";
import { updateCourseStats } from "../../../features/course/courseSlice";
import {
  EditModuleModal,
  DeleteConfirmModal,
  CreateLessonModal,
  EditLessonModal,
} from "../..";
import PreviewVideoModal from "../PreviewVideoModal";

import ModuleRow from "./ModuleRow";
import LessonsPanel from "./LessonsPanel";

// ─── Component ──────────────────────────────────────────────────────────────

function CourseCurriculum({ courseId, isEnrolled = false }) {
  const dispatch = useDispatch();

  // ── Modal state ──
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [addLessonTarget, setAddLessonTarget] = useState(null);
  const [lessonDeleteTarget, setLessonDeleteTarget] = useState(null);
  const [editLessonTarget, setEditLessonTarget] = useState(null);
  const [previewTarget, setPreviewTarget] = useState(null);

  // ── Expand/collapse state ──
  const [expandedModules, setExpandedModules] = useState(new Set());

  // ── Lesson data per module (keyed by moduleId) ──
  const [moduleLessons, setModuleLessons] = useState({});

  // ── Per-module loading indicators ──
  const [loadingModules, setLoadingModules] = useState(new Set());

  // ── Redux selectors ──
  const { userData } = useSelector((s) => s.auth);
  const { modules } = useSelector((s) => s.module);
  const { selectedCourse } = useSelector((s) => s.course);

  const isStudent = userData?.role?.toLowerCase() === "student";
  const isTeacher = userData?.id === selectedCourse?.teacher_id;
  const isAdmin = userData?.role?.toLowerCase() === "admin";
  const showTeacherActions = isTeacher || isAdmin;
  const isEmpty = modules.length === 0;

  // ── Fetch all modules for this course on mount ──
  useEffect(() => {
    dispatch(fetchCourseModules({ courseId }));
  }, [dispatch, courseId]);

  // ── Fetch lessons for a module (initial load + refresh) ──
  const fetchLessons = useCallback(
    (moduleId) => {
      setLoadingModules((prev) => {
        const next = new Set(prev);
        next.add(moduleId);
        return next;
      });
      dispatch(fetchModuleLessons({ moduleId }))
        .unwrap()
        .then((data) => {
          setModuleLessons((prev) => ({ ...prev, [moduleId]: data || [] }));
        })
        .catch(() => {})
        .finally(() => {
          setLoadingModules((prev) => {
            const next = new Set(prev);
            next.delete(moduleId);
            return next;
          });
        });
    },
    [dispatch],
  );

  // ── Toggle module expand/collapse ──
  const toggleModule = useCallback(
    (moduleId) => {
      setExpandedModules((prev) => {
        const next = new Set(prev);
        if (next.has(moduleId)) {
          next.delete(moduleId);
          return next;
        }
        next.add(moduleId);
        if (!moduleLessons[moduleId]) {
          fetchLessons(moduleId);
        }
        return next;
      });
    },
    [moduleLessons, fetchLessons],
  );

  // ── Delete module handler ──
  async function handleDeleteModule() {
    const deletedId = deleteTarget.id;
    await dispatch(deleteModule({ moduleId: deletedId }));
    setModuleLessons((prev) => {
      const next = { ...prev };
      delete next[deletedId];
      return next;
    });
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.delete(deletedId);
      return next;
    });
    setDeleteTarget(null);
  }

  // ── Delete lesson handler ──
  async function handleDeleteLesson() {
    if (!lessonDeleteTarget) return;
    try {
      await dispatch(
        deleteLesson({
          lessonId: lessonDeleteTarget.id,
          videoPath: lessonDeleteTarget.video_path,
          pdfPath: lessonDeleteTarget.pdf_path,
        }),
      ).unwrap();
      fetchLessons(lessonDeleteTarget.module_id);
      dispatch(updateCourseStats(courseId));
    } catch {
      // error handled in slice
    } finally {
      setLessonDeleteTarget(null);
    }
  }

  // ── Lesson saved callback (after create or edit modal closes) ──
  function handleLessonSaved() {
    if (addLessonTarget?.id) {
      fetchLessons(addLessonTarget.id);
    }
    if (editLessonTarget?.module_id) {
      fetchLessons(editLessonTarget.module_id);
    }
    dispatch(updateCourseStats(courseId));
    setAddLessonTarget(null);
    setEditLessonTarget(null);
  }

  // ── Empty state ──
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 rounded-xl border border-dashed border-border-2 bg-glass">
        <span className="text-3xl">📋</span>
        <p className="text-sm font-semibold text-white">No curriculum yet</p>
        <p className="text-xs text-slate-dark text-center max-w-xs">
          Lessons and modules will appear here once the instructor publishes
          course content.
        </p>
      </div>
    );
  }

  // ── Main render ──
  return (
    <>
      <div className="space-y-2">
        {modules.map((mod) => {
          const isExpanded = expandedModules.has(mod.id);
          const lessons = moduleLessons[mod.id] || [];
          const isLoading = loadingModules.has(mod.id);

          return (
            <div key={mod.id}>
              <ModuleRow
                mod={mod}
                isExpanded={isExpanded}
                lessons={lessons}
                isStudent={isStudent}
                showTeacherActions={showTeacherActions}
                onToggle={toggleModule}
                onAddLesson={setAddLessonTarget}
                onEditModule={setEditTarget}
                onDeleteModule={setDeleteTarget}
              />

              {isExpanded && (
                <LessonsPanel
                  mod={mod}
                  lessons={lessons}
                  isLoading={isLoading}
                  isEnrolled={isEnrolled}
                  showTeacherActions={showTeacherActions}
                  onAddLesson={setAddLessonTarget}
                  onPlayPreview={setPreviewTarget}
                  onEditLesson={setEditLessonTarget}
                  onDeleteLesson={setLessonDeleteTarget}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Modals ── */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onConfirm={handleDeleteModule}
        onClose={() => setDeleteTarget(null)}
        itemName={deleteTarget?.title}
        feature="Module"
      />
      <DeleteConfirmModal
        isOpen={Boolean(lessonDeleteTarget)}
        onConfirm={handleDeleteLesson}
        onClose={() => setLessonDeleteTarget(null)}
        itemName={lessonDeleteTarget?.title}
        feature="Lesson"
      />
      <EditModuleModal
        open={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        courseId={courseId}
        module={editTarget}
      />
      <CreateLessonModal
        open={Boolean(addLessonTarget)}
        onClose={handleLessonSaved}
        moduleId={addLessonTarget?.id}
      />
      {editLessonTarget && (
        <EditLessonModal
          open={Boolean(editLessonTarget)}
          onClose={handleLessonSaved}
          moduleId={editLessonTarget.module_id}
          lesson={editLessonTarget}
        />
      )}
      <PreviewVideoModal
        isOpen={Boolean(previewTarget)}
        onClose={() => setPreviewTarget(null)}
        lesson={previewTarget}
      />
    </>
  );
}

export default CourseCurriculum;
