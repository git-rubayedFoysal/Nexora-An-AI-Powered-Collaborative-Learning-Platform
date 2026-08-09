/**
 * CourseDetails
 *
 * Full course detail page with tabbed navigation.
 * URL: /courses/:courseId
 *
 * Tabs:
 *  - Overview   — course description + stats chips
 *  - Curriculum — expandable modules with lessons
 *  - Enrolled   — student enrollment table (teacher/admin only)
 *
 * Sidebar:
 *  - Price display or enrollment status
 *  - CTA button (Edit Course / Enroll Now / Start Learning)
 *  - Quick stats (category, level, lessons, duration)
 *  - Instructor card
 */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router";
import { fetchCourse } from "../../../features/course/courseSlice";
import {
  fetchCourseEnrollments,
  fetchEnrollment,
} from "../../../features/enroll/enrollSlice";
import courseStorage from "../../../services/supabase/course/course.storage";
import { LoadingState, CreateModuleModal } from "../../../components";
import PLACEHOLDER_COURSE_IMAGE from "../../../utils/placeholderCourseImage";

import CourseHero from "./CourseHero";
import CourseMeta from "./CourseMeta";
import TabBar from "./TabBar";
import OverviewTab from "./OverviewTab";
import CurriculumTab from "./CurriculumTab";
import EnrolledTab from "./EnrolledTab";
import CourseSidebar from "./CourseSidebar";

// ─── Component ──────────────────────────────────────────────────────────────

function CourseDetails() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ── Redux selectors ──
  const { selectedCourse: course, loading } = useSelector((s) => s.course);
  const { courseEnrollments, currentEnrollment } = useSelector((s) => s.enroll);
  const { userData } = useSelector((s) => s.auth);

  // ── Tab configuration ──
  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "curriculum", label: "Curriculum" },
  ];

  // ── Role checks ──
  const isTeacher = userData?.id === course?.teacher_id;
  const isAdmin = userData?.role?.toLowerCase() === "admin";
  const isStudent = userData?.role?.toLowerCase() === "student";
  const isFree = !course?.price || course?.price === 0;
  const showEnrolledTab = isTeacher || isAdmin;

  // ── Active tab state (synced with URL hash) ──
  const initialTab = location.hash?.replace("#", "") || "overview";
  const [activeTab, setActiveTab] = useState(
    TABS.some((t) => t.id === initialTab) ||
      (initialTab === "enrolled" && showEnrolledTab)
      ? initialTab
      : "overview",
  );

  // ── Fetch course data on mount ──
  useEffect(() => {
    dispatch(fetchCourse(courseId));
    dispatch(fetchEnrollment(courseId));
  }, [dispatch, courseId]);

  useEffect(() => {
    dispatch(fetchCourseEnrollments(courseId));
  }, [dispatch, courseId]);

  // ── Create Module modal state ──
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  /** Switch active tab and update URL hash */
  function switchTab(id) {
    setActiveTab(id);
    navigate(`#${id}`, { replace: true });
  }

  // ── Loading state ──
  if (loading || !course) {
    return <LoadingState color="--color-violet" content="course..." />;
  }

  // ── Derived values ──
  const thumbnail = course.thumbnail_url
    ? courseStorage.getThumbnailUrl(course.thumbnail_url)
    : PLACEHOLDER_COURSE_IMAGE;

  const statusCfg =
    {
      published: { label: "Published", cls: "bg-teal text-white border-teal/25" },
      draft: { label: "Draft", cls: "bg-amber text-white border-amber/25" },
      archived: { label: "Archived", cls: "bg-coral text-white border-border" },
    }[course.status?.toLowerCase()] ?? null;

  const studentCount = courseEnrollments.length ?? 0;

  // ── Render ──
  return (
    <div className="max-w-5xl mx-auto mt-20 mb-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-dark font-mono mb-6 flex-wrap">
        <button onClick={() => navigate("/courses")} className="hover:text-slate transition-colors">
          Courses
        </button>
        <span>/</span>
        {course.category && (
          <>
            <button onClick={() => navigate("/courses")} className="hover:text-slate transition-colors">
              {course.category}
            </button>
            <span>/</span>
          </>
        )}
        <span className="text-slate truncate max-w-40">{course.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-2 space-y-5">
          <CourseHero
            thumbnail={thumbnail}
            title={course.title}
            statusCfg={statusCfg}
            isStudent={isStudent}
            currentEnrollment={currentEnrollment}
            isFree={isFree}
            price={course.price}
          />

          <CourseMeta course={course} />

          <TabBar
            tabs={TABS}
            activeTab={activeTab}
            onSwitch={switchTab}
            showEnrolledTab={showEnrolledTab}
            enrolledCount={courseEnrollments.length}
          />

          {activeTab === "overview" && (
            <OverviewTab
              course={course}
              isTeacher={isTeacher}
              studentCount={studentCount}
            />
          )}

          {activeTab === "curriculum" && (
            <CurriculumTab
              courseId={courseId}
              isEnrolled={Boolean(currentEnrollment)}
              isStudent={isStudent}
              onCreateModule={() => setIsOpen(true)}
            />
          )}

          <CreateModuleModal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            courseId={courseId}
          />

          {activeTab === "enrolled" && showEnrolledTab && (
            <EnrolledTab courseEnrollments={courseEnrollments} />
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <CourseSidebar
          course={course}
          currentEnrollment={currentEnrollment}
          isFree={isFree}
          isTeacher={isTeacher}
          isAdmin={isAdmin}
          studentCount={studentCount}
          courseId={courseId}
        />
      </div>
    </div>
  );
}

export default CourseDetails;
