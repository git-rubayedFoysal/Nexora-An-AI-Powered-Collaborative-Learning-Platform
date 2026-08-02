/**
 * CourseMeta
 *
 * Course title + meta tags (category, level, updated date).
 *
 * Props:
 *  - course — the course object
 */

function CourseMeta({ course }) {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-3 font-display">
        {course.title}
      </h1>
      <div className="flex flex-wrap gap-2">
        {course.category && (
          <span className="tag bg-teal-dim text-teal border border-teal/25 font-mono">
            {course.category}
          </span>
        )}
        {course.level && (
          <span className="tag bg-violet/15 text-violet-light border border-violet/25 font-mono">
            {course.level}
          </span>
        )}
        <span className="text-[11px] text-slate-dark font-mono self-center">
          Updated{" "}
          {new Date(course.updated_at).toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}

export default CourseMeta;
