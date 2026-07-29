// Featured courses grid — fetches and displays popular courses
import { Link } from "react-router";
import { CourseCard } from "../index";
import { fetchFeatureCourses } from "../../features/course/courseSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

function CourseSection() {
  const dispatch = useDispatch();

  const { featureCourses } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(fetchFeatureCourses());
  }, [dispatch]);

  return (
    <section id="courses" className="bg-navy-3 py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-teal/25 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
            <span className="text-[11px] font-bold text-teal font-mono tracking-[0.15em]">
              POPULAR COURSES
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black font-[Outfit]">
            Start learning<span className="gradient-text"> today</span>
          </h2>
          <p className="text-slate mt-3 text-sm max-w-md mx-auto leading-relaxed">
            Explore university-grade courses built by real instructors.
          </p>
        </div>

        {/* Course grid */}
        <div
          id="course-grid"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {featureCourses.map((course) => (
            <Link to={`/courses/${course.id}`} key={course.id}>
              <CourseCard course={course} variant="guest" />
            </Link>
          ))}
        </div>

        {/* Browse all */}
        <div className="text-center mt-12">
          <Link
            to="/courses"
            className="btn-secondary px-8 py-3 rounded-xl text-sm font-semibold text-slate border border-white/10 inline-flex items-center gap-2"
          >
            Browse all courses
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
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CourseSection;
