import { Button } from "../index";
import courseStorage from "../../services/supabase/course/course.storage";

/* ── Status chip config — one source of truth ── */
const STATUS_CONFIG = {
  published: {
    label: "Published",
    cls: "bg-teal/70 text-white border-teal",
    dot: "bg-white",
  },
  draft: {
    label: "Draft",
    cls: "bg-amber/70 text-white border-amber",
    dot: "bg-white",
  },
  archived: {
    label: "Archived",
    cls: "bg-coral/70 text-white border-coral",
    dot: "bg-white",
  },
};

function CourseCard({
  course = {},
  variant = "student",
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onContinue = () => {},
}) {
  const statusCfg = STATUS_CONFIG[course.status?.toLowerCase()] ?? null;

  const publicUrl = course.thumbnail_url
    ? courseStorage.getThumbnailUrl(course.thumbnail_url)
    : "/placeholder-course.png";

  return (
    <div className="course-card glass rounded-2xl overflow-hidden border border-border flex flex-col">
      {/* ── Thumbnail ── */}
      <div className="relative max-h-50 overflow-hidden">
        <img
          src={publicUrl}
          alt={course.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-course.png";
          }}
          className="w-full h-full object-cover brightness-90"
        />

        {/* Scrim */}
        <div
          className="absolute inset-x-0 bottom-0 h-16
                        bg-linear-to-t from-navy-2/80 to-transparent"
        />

        {/*
         * CHANGED: was topic badge here (top-right of thumbnail).
         * Now shows status chip for teacher/admin, nothing for student/guest.
         * Topics moved to the card body — below description.
         */}
        {(variant === "teacher" || variant === "admin") && statusCfg && (
          <div className="absolute top-3 right-3">
            <span
              className={`tag shadow border font-mono flex items-center gap-1.5 ${statusCfg.cls}`}
            >
              <span
                className={`w-1.5 h-1.5 animate-pulse rounded-full shrink-0 ${statusCfg.dot}`}
              />
              {statusCfg.label}
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3
          className="text-base font-bold text-white leading-snug line-clamp-2
                       font-display"
        >
          {course.title ?? "Untitled Course"}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-slate leading-relaxed line-clamp-2">
          {course.description ?? "No description available."}
        </p>

        {/*
         * CHANGED: topics moved here — below description, visible for all variants.
         * Previously sat as a thumbnail overlay badge.
         */}
        {course.category && (
          <div className="mt-3">
            <span className="tag bg-teal-dim text-teal border border-teal/25 font-mono">
              {course.category}
            </span>
          </div>
        )}

        {/* Instructor */}
        {variant !== "teacher" && (
          <div className="flex items-center gap-2 mt-4">
            <div
              className="w-5 h-5 rounded-full bg-linear-to-br from-violet to-teal
                          flex items-center justify-center text-[9px] font-bold
                          text-white shrink-0"
            >
              {(course.users?.full_name ?? "?")[0].toUpperCase()}
            </div>
            <p className="text-[11px] text-slate truncate">
              {course.users?.full_name ?? "Unknown Instructor"}
            </p>
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-[11px] font-semibold text-slate font-mono">
            {course.level ?? "N/A"}
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="text-[11px] text-slate font-mono">
            {course.duration ? `${course.duration} hrs` : "Not set"}
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="tag bg-teal-dim text-teal border border-teal/20 font-mono">
            🎥 {course.lesson_count ?? 0} Lessons
          </span>
        </div>

        {variant !== "student" && (
          <div className="mt-3 flex items-center justify-between">
            <span
              className={`text-sm font-semibold ${
                course.price === 0 ? "text-teal" : "text-amber"
              }`}
            >
              {course.price === 0 ? "Free" : `৳${course.price}`}
            </span>
          </div>
        )}

        {/* Progress — student only */}
        {variant === "student" && (
          <div className="mt-5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-slate">Progress</span>
              <span className="text-[10px] font-mono text-teal">
                {course.progress ?? 0}%
              </span>
            </div>
            <div className="prog">
              <div
                className="prog-fill bg-teal"
                style={{ width: `${course.progress ?? 0}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="mt-auto pt-5">
          {variant === "student" && (
            <Button
              onClick={onContinue}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white
                         bg-linear-to-br from-teal to-teal-light
                         shadow-[0_4px_16px_rgba(15,191,138,.25)]
                         hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(15,191,138,.4)]
                         transition-all duration-200"
            >
              Continue Learning
            </Button>
          )}

          {(variant === "teacher" || variant === "admin") && (
            <div className="flex gap-2">
              <Button
                onClick={onView}
                className="btn-ghost flex-1 py-2 rounded-xl text-xs font-semibold
                           border border-border"
              >
                View
              </Button>
              <Button
                onClick={onEdit}
                className="flex-1 py-2 rounded-xl text-xs font-semibold
                           bg-amber-dim text-amber border border-amber/25
                           hover:bg-amber/20 transition-colors duration-200"
              >
                Edit
              </Button>
              <Button
                onClick={onDelete}
                className="flex-1 py-2 rounded-xl text-xs font-semibold
                           bg-coral-dim text-coral border border-coral/25
                           hover:bg-coral/20 transition-colors duration-200"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
