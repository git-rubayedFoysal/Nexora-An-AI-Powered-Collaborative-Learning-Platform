/**
 * CourseHero
 *
 * Hero section with course thumbnail image, status badge, and price overlay.
 *
 * Props:
 *  - thumbnail       — resolved image URL
 *  - title           — course title (for alt text)
 *  - statusCfg       — status badge config { label, cls } or null
 *  - isStudent       — whether current user is a student
 *  - currentEnrollment — enrollment object (null if not enrolled)
 *  - isFree          — whether the course is free
 *  - price           — course price
 */

function CourseHero({
  thumbnail,
  title,
  statusCfg,
  isStudent,
  currentEnrollment,
  isFree,
  price,
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-border">
      <img
        src={thumbnail}
        alt={title}
        onError={(e) => {
          e.currentTarget.src = "/placeholder-course.png";
        }}
        className="w-full h-48 sm:h-72 object-cover brightness-90"
      />
      {/* Gradient fade at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-navy-2 to-transparent" />

      {/* Status badge (teacher/admin only) */}
      {statusCfg && !isStudent && (
        <span
          className={`absolute flex items-center gap-1 top-3 right-3 font-bold tag border font-mono ${statusCfg.cls}`}
        >
          <span className="w-1.5 h-1.5 animate-pulse rounded-full shrink-0 bg-white" />
          {statusCfg.label}
        </span>
      )}

      {/* Price tag (shown when not enrolled) */}
      {!currentEnrollment && (
        <div className="absolute bottom-3 left-4">
          <span
            className={`text-2xl font-black font-mono ${isFree ? "text-teal" : "text-amber"}`}
          >
            {isFree ? "Free" : `৳${price}`}
          </span>
        </div>
      )}
    </div>
  );
}

export default CourseHero;
