import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { fetchPublishedCourses } from "../../features/course/courseSlice";
import { CourseCard, EmptyState, LoadingState } from "../../components";

function PublicCourses() {
  const dispatch = useDispatch();

  const { courses, loading } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(fetchPublishedCourses());
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      {/* ══════════════════════════════════
          HERO / SEARCH HEADER
      ══════════════════════════════════ */}
      <div className="relative overflow-hidden pt-25 px-4 text-center">
        {/* Ambient blobs */}

        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 font-display">
            Browse <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-slate mb-8 text-sm sm:text-base">
            Learn new skills from expert instructors
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════
          COURSE GRID
      ══════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Loading */}
        {loading && <LoadingState color="--color-violet" content="courses…" />}

        {/* Empty state */}
        {!loading && courses.length === 0 && (
          <EmptyState
            icon="📚"
            title="No courses available yet"
            description="Check back later for new courses."
          />
        )}

        {/* Grid */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link to={`/courses/${course.id}`} key={course.id}>
                <CourseCard key={course.id} course={course} variant="guest" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicCourses;
