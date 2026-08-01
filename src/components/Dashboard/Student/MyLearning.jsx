// Student's enrolled courses list — pagination, explore more button
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchMyEnrollments } from "../../../features/enroll/enrollSlice";
import { EmptyState, LoadingState, CourseCard, Button } from "../../index";
import { useEffect, useState } from "react";

function MyLearning() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { myEnrollments, loading, totalCourses } = useSelector(
    (state) => state.enroll,
  );

  // Fetch my enrollments when the page changes
  useEffect(() => {
    dispatch(fetchMyEnrollments({ page }));
  }, [dispatch, page]);

  // Handle "Load More" button click
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="mb-8">
      {/* ── Page heading ── */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4 font-display">
            My <span className="gradient-text">Learning</span>
          </h1>
          <span
            className="animate-pulse-teal inline-flex items-center gap-1.5 px-3 py-1
                           rounded-full text-xs font-semibold bg-teal/10 text-teal
                           border border-teal/25 font-mono"
          >
            ● STUDENT
          </span>
        </div>

        <Button
          onClick={() => navigate("/courses")}
          className="btn-ghost flex items-center gap-2 bg-teal/10 text-teal
                     border border-teal/25 px-5 py-2.5 text-sm shrink-0"
        >
          Explore More
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
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Button>
      </div>

      {loading && <LoadingState color="--color-violet" content="course..." />}

      {myEnrollments.length === 0 && !loading ? (
        <EmptyState
          icon="🎓"
          title="You haven't enrolled any courses yet."
          description="Explore our course catalog and start learning something new today. your first course and share your knowledge."
          buttonText="Explore Course"
          noButton={false}
          onButtonClick={() => navigate("/courses")}
        />
      ) : (
        <>
          {/* ── Course grid ── */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {myEnrollments.map((enrollment) => (
              <CourseCard
                key={enrollment.id}
                course={{
                  ...enrollment.courses,
                  progress: enrollment.progress,
                  enrollmentStatus: enrollment.status,
                  enrolledAt: enrollment.enrolled_at,
                }}
                variant="student"
                onContinue={() =>
                  navigate(`/my-learning/${enrollment.course_id}`)
                }
              />
            ))}
          </div>
        </>
      )}

      {/* Load more button */}
      {!loading &&
        myEnrollments.length > 0 &&
        myEnrollments.length < totalCourses && (
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
  );
}

export default MyLearning;
