import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { fetchPublishedCourses } from "../../features/course/courseSlice";
import {
  CourseCard,
  EmptyState,
  LoadingState,
  SearchBar,
} from "../../components";

function PublicCourses() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { courses, loading, totalCourses } = useSelector(
    (state) => state.course,
  );

  // Fetch courses when the page changes
  useEffect(() => {
    dispatch(fetchPublishedCourses({ page, search: debouncedSearch }));
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
    <div className="min-h-screen">
      {/* ══════════════════════════════════
          HERO / SEARCH HEADER
      ══════════════════════════════════ */}
      <div className="relative overflow-hidden pt-25 px-4 text-center">
        {/* Ambient blobs */}

        <div className="relative z-10 max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 font-display">
            Explore <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-slate mb-4 text-sm sm:text-base">
            Discover expert-led courses and start learning at your own pace.
          </p>
          <div className="px-8">
            <SearchBar
              placeholder="Search courses..."
              onChange={setSearch}
              value={search}
              className="mx-auto max-w-xl"
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          COURSE GRID
      ══════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 my-10">
        {/* Loading */}
        {loading && <LoadingState color="--color-violet" content="courses…" />}

        {/* Empty state */}
        {!loading && courses.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No courses available yet"
            description="Check back later for new courses."
          />
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link to={`/courses/${course.id}`} key={course.id}>
                  <CourseCard key={course.id} course={course} variant="guest" />
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Load more button */}
        {!loading && courses.length > 0 && courses.length < totalCourses && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 rounded-lg border-2 border-teal text-teal font-bold font-mono hover:bg-teal-dim hover:text-white transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
      {/* End of course grid */}
    </div>
  );
}

export default PublicCourses;
