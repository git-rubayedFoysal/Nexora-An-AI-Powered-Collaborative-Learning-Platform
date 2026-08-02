// Teacher's course list — search, pagination, create/edit/delete
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  fetchTeacherCourses,
  deleteCourse,
} from "../../../features/course/courseSlice";
import {
  Button,
  CourseCard,
  DeleteConfirmModal,
  LoadingState,
  EmptyState,
  SearchBar,
} from "../../index";

function MyCourses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const { teacherCourses, loading, totalCourses } = useSelector(
    (state) => state.course,
  );

  const handelClick = () => navigate("/dashboard/create-course");

  async function handleDelete() {
    try {
      await dispatch(
        deleteCourse({
          courseId: deleteTarget.id,
          filePath: deleteTarget.thumbnail_url,
        }),
      ).unwrap();
    } finally {
      setDeleteTarget(null);
    }
  }

  // Fetch courses when the page changes
  useEffect(() => {
    dispatch(fetchTeacherCourses({ page, search: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  // Fetch courses when the search term changes, with a debounce of 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage((prev) => (prev === 1 ? prev : 1));
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Handle "Load More" button click
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="mb-8">
      {/* ── Page heading ── */}
      <div className="mb-12 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4 font-display">
            My <span className="gradient-text">Courses</span>
          </h1>
          <span
            className="animate-pulse-amber inline-flex items-center gap-1.5 px-3 py-1
                           rounded-full text-xs font-semibold bg-amber/10 text-amber
                           border border-amber/25 font-mono"
          >
            ● TEACHER
          </span>
        </div>

        <div className="max-w-xs w-full">
          <SearchBar
            placeholder="Search courses..."
            value={search}
            onChange={setSearch}
          />
        </div>

        <Button
          onClick={handelClick}
          className="btn-ghost flex items-center gap-2 bg-amber/10 text-amber
                     border border-amber/25 px-5 py-2.5 text-sm shrink-0"
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
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Course
        </Button>
      </div>

      {loading && <LoadingState color="--color-violet" content="courses..." />}

      {teacherCourses.length === 0 && !loading ? (
        <EmptyState
          icon="🎓"
          title="You haven't created any courses yet."
          description="Start building your first course and share your knowledge."
          buttonText="Create Course"
          noButton={false}
          onButtonClick={handelClick}
        />
      ) : (
        <>
          {/* ── Course grid ── */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {teacherCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                variant="teacher"
                onView={() => navigate(`/courses/${course.id}`)}
                onEdit={() => navigate(`/dashboard/edit-course/${course.id}`)}
                // FIX: removed duplicate onDelete — the second one was overriding
                // this one with an empty function, so setDeleteTarget never ran
                onDelete={() => setDeleteTarget(course)}
              />
            ))}
          </div>
        </>
      )}

      {/* Load more button */}
      {!loading &&
        teacherCourses.length > 0 &&
        teacherCourses.length < totalCourses && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 rounded-lg border-2 border-teal text-teal font-bold font-mono hover:bg-teal-dim hover:text-white transition-colors"
            >
              Load More
            </button>
          </div>
        )}

      {/*
       * FIX: moved outside the map — one modal for the whole page.
       * Inside the map was creating one modal per card; only the last
       * one in the list would ever get isOpen=true correctly.
       */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.title}
        loading={loading}
      />
    </div>
  );
}

export default MyCourses;
