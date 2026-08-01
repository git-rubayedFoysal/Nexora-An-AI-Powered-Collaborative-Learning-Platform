import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseModules } from "../features/module/moduleSlice";
import { fetchModuleLessons } from "../features/lesson/lessonSlice";
import { fetchCourse } from "../features/course/courseSlice";
import lessonStorage from "../services/supabase/lesson/lesson.storage";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import {
  LearningSidebar,
  LearningHeader,
  VideoPlayer,
  EmptyLesson,
  LoadingState,
  LessonActionBar,
  LessonTabPanel,
  LessonNavigation,
  KeyboardHints,
} from "../components/index";

/**
 * LearningPage — Student learning view for a single course.
 *
 * Layout: fixed sidebar (320px, always open on desktop) + video-first content area.
 * Orchestrates state, data fetching, and delegates UI to extracted components.
 */
function LearningPage() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  // ── Local UI state ───────────────────────────────────────────────────────
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [moduleLessons, setModuleLessons] = useState({});
  const [loadingModules, setLoadingModules] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());

  // ── Redux selectors ──────────────────────────────────────────────────────
  const { modules } = useSelector((s) => s.module);
  const { selectedCourse, loading: courseLoading } = useSelector(
    (s) => s.course,
  );

  // ── Fetch course data on mount ───────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchCourseModules({ courseId }));
    dispatch(fetchCourse(courseId));
  }, [dispatch, courseId]);

  // ── Lazy-load lessons for a module ───────────────────────────────────────
  const loadModuleLessons = useCallback(
    (moduleId) => {
      setLoadingModules((prev) => {
        const next = new Set(prev);
        next.add(moduleId);
        return next;
      });

      dispatch(fetchModuleLessons({ moduleId }))
        .unwrap()
        .then((data) => {
          setModuleLessons((prev) => ({
            ...prev,
            [moduleId]: JSON.parse(JSON.stringify(data || [])),
          }));
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

  // ── Toggle module expand/collapse ────────────────────────────────────────
  const toggleModule = useCallback(
    (moduleId) => {
      const isExpanding = !expandedModules.has(moduleId);
      setExpandedModules((prev) => {
        const next = new Set(prev);
        if (next.has(moduleId)) {
          next.delete(moduleId);
        } else {
          next.add(moduleId);
        }
        return next;
      });
      if (isExpanding && !moduleLessons[moduleId]) {
        loadModuleLessons(moduleId);
      }
    },
    [expandedModules, moduleLessons, loadModuleLessons],
  );

  // ── Select lesson from sidebar ───────────────────────────────────────────
  const handleSelectLesson = useCallback((lesson) => {
    setSelectedLesson(lesson);
    setActiveTab("overview");
    setSidebarOpen(false);
  }, []);

  // ── Derived data ─────────────────────────────────────────────────────────
  const totalLessons = modules.reduce(
    (sum, mod) => sum + (mod.lesson_count || 0),
    0,
  );

  const allLessons = useMemo(() => {
    const flat = [];
    const sortedModules = [...modules].sort((a, b) => a.position - b.position);
    for (const mod of sortedModules) {
      const lessons = moduleLessons[mod.id] || [];
      flat.push(...[...lessons].sort((a, b) => a.position - b.position));
    }
    return flat;
  }, [modules, moduleLessons]);

  const currentIndex = selectedLesson
    ? allLessons.findIndex((l) => l.id === selectedLesson.id)
    : -1;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  const goToPrev = useCallback(() => {
    if (hasPrev) setSelectedLesson(allLessons[currentIndex - 1]);
  }, [hasPrev, allLessons, currentIndex]);

  const goToNext = useCallback(() => {
    if (hasNext) setSelectedLesson(allLessons[currentIndex + 1]);
  }, [hasNext, allLessons, currentIndex]);

  // ── Media URLs ───────────────────────────────────────────────────────────
  const videoUrl = selectedLesson?.video_path
    ? lessonStorage.getVideoUrl(selectedLesson.video_path)
    : null;

  const pdfUrl = selectedLesson?.pdf_path
    ? lessonStorage.getPdfUrl(selectedLesson.pdf_path)
    : null;

  // ── Mark complete toggle ─────────────────────────────────────────────────
  const handleToggleComplete = useCallback(() => {
    if (!selectedLesson) return;
    setCompletedLessonIds((prev) => {
      const next = new Set(prev);
      if (next.has(selectedLesson.id)) {
        next.delete(selectedLesson.id);
      } else {
        next.add(selectedLesson.id);
      }
      return next;
    });
  }, [selectedLesson]);

  const isCurrentCompleted = selectedLesson
    ? completedLessonIds.has(selectedLesson.id)
    : false;

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useKeyboardShortcuts(videoRef, { hasNext, hasPrev, goToNext, goToPrev });

  // ── Loading state ────────────────────────────────────────────────────────
  if (courseLoading && !selectedCourse) {
    return (
      <div className="min-h-screen pt-20 bg-navy flex items-center justify-center">
        <LoadingState content="Loading course..." />
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-17 bg-navy bg-mesh flex">
      <LearningSidebar
        modules={modules}
        moduleLessons={moduleLessons}
        expandedModules={expandedModules}
        selectedLessonId={selectedLesson?.id}
        completedLessonIds={completedLessonIds}
        onToggleModule={toggleModule}
        onSelectLesson={handleSelectLesson}
        loadingModules={loadingModules}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile: curriculum sidebar toggle */}
        <div className="lg:hidden px-4 pt-4 pb-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate hover:text-white hover:bg-white/6 transition-colors"
            aria-label="Open curriculum sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Curriculum
          </button>
        </div>

        <LearningHeader
          selectedCourse={selectedCourse}
          totalLessons={totalLessons}
          courseId={courseId}
        />

        {/* Lesson content area */}
        <div className="flex-1 px-4 lg:px-6 py-5">
          {selectedLesson ? (
            <div className="max-w-4xl mx-auto space-y-5">
              <VideoPlayer ref={videoRef} videoUrl={videoUrl} />

              <LessonActionBar
                currentIndex={currentIndex}
                totalLessons={totalLessons}
                lesson={selectedLesson}
                isCompleted={isCurrentCompleted}
                onToggleComplete={handleToggleComplete}
              />

              <LessonTabPanel
                activeTab={activeTab}
                onTabChange={setActiveTab}
                lesson={selectedLesson}
                pdfUrl={pdfUrl}
              />

              <LessonNavigation
                hasPrev={hasPrev}
                hasNext={hasNext}
                currentIndex={currentIndex}
                totalLessons={totalLessons}
                onPrev={goToPrev}
                onNext={goToNext}
              />

              <KeyboardHints />
            </div>
          ) : (
            <div className="pt-16 max-w-4xl mx-auto">
              <EmptyLesson
                icon="📖"
                title="Select a lesson"
                description="Choose a lesson from the sidebar to start learning."
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default LearningPage;
