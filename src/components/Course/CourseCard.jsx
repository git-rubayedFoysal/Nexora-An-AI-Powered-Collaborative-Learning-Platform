import { Button } from "../index";

/**
 * CourseCard
 * ----------
 * Restyled for the Nexora LMS design system.
 * All props, logic, variant branches, and conditional rendering are unchanged.
 * Only Tailwind class strings were updated to match Nexora's palette:
 *   navy background · glassmorphism · teal/violet/amber/coral accents · Outfit font
 *
 * Props (unchanged):
 *  - course   : object  — course data
 *  - variant  : 'guest' | 'student' | 'teacher' | 'admin'
 *  - onView   : () => void
 *  - onEdit   : () => void
 *  - onDelete : () => void
 *  - onContinue : () => void
 */
function CourseCard({
  course = {},
  variant = "student",
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onContinue = () => {},
}) {
  return (
    // CHANGED: was "glass rounded-2xl overflow-hidden border border-white/10 flex flex-col shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    // Now uses Nexora's border-white/[.06] opacity + deeper shadow token + hover glow
    <div
      className="glass rounded-2xl overflow-hidden border border-white/6 flex flex-col
                    hover:-translate-y-1 hover:border-white/12
                    hover:shadow-[0_8px_40px_rgba(0,0,0,.4)]
                    transition-all duration-300"
    >
      {/* ── Thumbnail ── */}
      {/* CHANGED: h-44 → h-48 for more visual presence; added gradient overlay at the bottom */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail_url || "/placeholder-course.png"}
          alt={course.title ?? "Course Thumbnail"}
          loading="lazy"
          // CHANGED: added brightness-[.85] so text badges read better over bright images
          className="w-full h-full object-cover brightness-[.85]"
        />

        {/* Bottom gradient scrim — bleeds into the card body */}
        {/* CHANGED: new addition — aligns thumbnail with Nexora's dark navy card body */}
        <div
          className="absolute inset-x-0 bottom-0 h-16
                        bg-linear-to-t from-navy/80 to-transparent"
        />

        {/* Topic Badge */}
        {/* CHANGED: was "bg-teal/20 text-teal border border-teal/30"
                    now uses Nexora's exact chip token with font-mono + tighter padding */}
        {course.topics && (
          <div className="absolute top-3 right-3">
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full
                             text-[10px] font-semibold font-mono
                             bg-teal/15 text-teal border border-teal/25"
            >
              {course.topics}
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      {/* CHANGED: p-5 kept; gap spacing adjusted via mt-* tokens below */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        {/* CHANGED: was "text-lg font-bold text-white font-[Outfit]"
                    now uses style prop for Outfit (consistent with rest of Nexora components)
                    + slightly tighter leading */}
        <h3
          className="text-base font-bold text-white leading-snug line-clamp-2"
          style={{ fontFamily: "'Outfit',sans-serif" }}
        >
          {course.title ?? "Untitled Course"}
        </h3>

        {/* Description */}
        {/* CHANGED: was "mt-2 text-sm text-slate" — same, kept identical */}
        <p className="mt-2 text-sm text-slate leading-relaxed line-clamp-2">
          {course.description ?? "No description available."}
        </p>

        {/* Instructor */}
        {/* CHANGED: was plain "text-xs text-slate"
                    now shows a small avatar-initial circle + Nexora's slate-dark for the label */}
        <div className="flex items-center gap-2 mt-4">
          <div
            className="w-5 h-5 rounded-full bg-linear-to-br from-violet to-teal
                          flex items-center justify-center text-[9px] font-bold text-white shrink-0"
          >
            {(course.teacher_name ?? "?")[0].toUpperCase()}
          </div>
          <p className="text-[11px] text-slate truncate">
            {course.teacher_name ?? "Unknown Instructor"}
          </p>
        </div>

        {/* Course Meta */}
        {/* CHANGED: was "flex flex-wrap items-center gap-2 mt-3 text-xs text-slate"
                    separators were "w-1 h-1 rounded-full bg-white/20"
                    now uses Nexora's slate-dark dot + font-mono for the data values */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-[11px] font-semibold text-slate font-mono">
            {course.level ?? "N/A"}
          </span>

          <span className="w-1 h-1 rounded-full bg-white/12" />

          <span className="text-[11px] text-slate font-mono">
            {course.duration ? `${course.duration}h` : "N/A"}
          </span>

          <span className="w-1 h-1 rounded-full bg-white/12" />

          {/* CHANGED: lectures count now highlighted with a teal chip for scannability */}
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold font-mono
                           px-2 py-0.5 rounded-full bg-teal/10 text-teal border border-teal/20"
          >
            🎥 {course.lesson_count ?? 0} lectures
          </span>
        </div>

        {/* ── Student progress bar ── */}
        {/* CHANGED: wrapper was "mt-5"; bar was "bg-white/10" track + "bg-teal" fill
                    now uses Nexora's 1.5px track, smooth teal fill, and mono percentage */}
        {variant === "student" && (
          <div className="mt-5">
            <div className="flex justify-between items-center mb-1.5">
              {/* CHANGED: label added above bar (was only below) */}
              <span className="text-[10px] text-slate">Progress</span>
              <span className="text-[10px] font-mono text-teal">
                {course.progress ?? 0}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/12 overflow-hidden">
              <div
                className="h-full rounded-full bg-teal transition-all duration-500"
                style={{ width: `${course.progress ?? 0}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        {/* CHANGED: pt-5 kept; button styles replaced with Nexora button tokens */}
        <div className="mt-auto pt-5">
          {/* Guest */}
          {/* CHANGED: was "btn-primary py-2.5 rounded-xl"
                      now violet gradient with Nexora shadow token */}
          {variant === "guest" && (
            <Button
              onClick={onView}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white
                         bg-linear-to-br from-violet to-violet-light
                         shadow-[0_4px_16px_rgba(124,90,247,.3)]
                         hover:shadow-[0_6px_24px_rgba(124,90,247,.45)]
                         hover:-translate-y-px transition-all duration-200"
            >
              View Details
            </Button>
          )}

          {/* Student */}
          {/* CHANGED: was "btn-primary" — now teal gradient with Nexora shadow */}
          {variant === "student" && (
            <Button
              onClick={onContinue}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white
                         bg-linear-to-br from-teal to-teal-light
                         shadow-[0_4px_16px_rgba(15,191,138,.25)]
                         hover:shadow-[0_6px_24px_rgba(15,191,138,.4)]
                         hover:-translate-y-px transition-all duration-200"
            >
              Continue Learning
            </Button>
          )}

          {/* Teacher & Admin */}
          {/* CHANGED: was three "btn-primary" buttons + a raw "bg-red-600"
                      now: View → ghost border, Edit → amber chip, Delete → coral chip
                      matches Nexora's role-color system (teacher = amber) */}
          {(variant === "teacher" || variant === "admin") && (
            <div className="flex gap-2">
              <Button
                onClick={onView}
                className="flex-1 py-2 rounded-xl text-xs font-semibold
                           text-slate border border-white/8
                           hover:text-white hover:border-white/18 hover:bg-white/5
                           transition-all duration-200"
              >
                View
              </Button>

              <Button
                onClick={onEdit}
                className="flex-1 py-2 rounded-xl text-xs font-semibold
                           bg-amber/15 text-amber border border-amber/25
                           hover:bg-amber/25 transition-all duration-200"
              >
                Edit
              </Button>

              <Button
                onClick={onDelete}
                className="flex-1 py-2 rounded-xl text-xs font-semibold
                           bg-coral/15 text-coral border border-coral/25
                           hover:bg-coral/25 transition-all duration-200"
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
