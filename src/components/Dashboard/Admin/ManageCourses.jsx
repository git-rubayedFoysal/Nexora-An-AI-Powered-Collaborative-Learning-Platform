import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  fetchAllCourses,
  deleteCourse,
} from "../../../features/course/courseSlice";
import {
  CourseCard,
  DeleteConfirmModal,
  LoadingState,
  EmptyState,
  SearchBar,
} from "../../index";

function AllCourses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { allCourses, loading, totalCourses } = useSelector(
    (state) => state.course,
  );

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
    dispatch(fetchAllCourses({ page, search: debouncedSearch }));
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
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4 font-display">
            Manage <span className="gradient-text">Courses</span>
          </h1>
          <span
            className="animate-pulse-amber inline-flex items-center gap-1.5 px-3 py-1
                           rounded-full text-xs font-semibold bg-coral/10 text-coral
                           border border-coral/25 font-mono"
          >
            ● ADMIN
          </span>
        </div>

        <div className="max-w-xs w-full">
          <SearchBar
            placeholder="Search courses..."
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      {loading && <LoadingState color="--color-violet" content="course..." />}

      {allCourses.length === 0 && !loading ? (
        <EmptyState
          icon="🎓"
          title="You haven't created any courses yet."
          description="Start building your first course and share your knowledge."
          buttonText="Create Course"
          noButton={false}
          onButtonClick={() => navigate("/dashboard/create-course")}
        />
      ) : (
        <>
          {/* ── Course grid ── */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {allCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                variant="admin"
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
        allCourses.length > 0 &&
        allCourses.length < totalCourses && (
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

export default AllCourses;
