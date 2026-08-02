/**
 * InfoChip
 *
 * Small label with icon + text, used in the course stats grid.
 *
 * Props:
 *  - icon  — emoji or text icon
 *  - label — description text
 */

function InfoChip({ icon, label }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-glass-2 border border-border">
      <span className="text-base leading-none">{icon}</span>
      <span className="text-xs text-slate font-mono">{label}</span>
    </div>
  );
}

/**
 * Section
 *
 * Glass container with a title, used for tab content wrappers.
 *
 * Props:
 *  - title    — section heading
 *  - children — content
 */

function Section({ title, children }) {
  return (
    <div className="glass rounded-2xl border border-border p-5 sm:p-6">
      <h2 className="text-sm font-bold text-white mb-4 font-display">
        {title}
      </h2>
      {children}
    </div>
  );
}

/**
 * OverviewTab
 *
 * Course overview content: description + stats chips grid.
 *
 * Props:
 *  - course       — the course object
 *  - isTeacher    — whether current user is the course teacher
 *  - studentCount — number of enrolled students
 */

function OverviewTab({ course, isTeacher, studentCount }) {
  return (
    <>
      <Section title="About this course">
        <p className="text-sm text-slate leading-relaxed">
          {course.description ?? "No description available."}
        </p>
      </Section>

      <Section title="This course includes">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {isTeacher && (
            <InfoChip
              icon="👥"
              label={`${studentCount} students enrolled`}
            />
          )}
          <InfoChip
            icon="🎥"
            label={`${course.lesson_count ?? 0} lessons`}
          />
          <InfoChip
            icon="⏱️"
            label={
              course.duration
                ? `${course.duration} hours`
                : "Duration TBA"
            }
          />
          <InfoChip icon="📶" label={course.level ?? "All levels"} />
          <InfoChip icon="♾️" label="Full lifetime access" />
          <InfoChip icon="📱" label="Access on all devices" />
          <InfoChip icon="🏆" label="Certificate of completion" />
        </div>
      </Section>
    </>
  );
}

export { InfoChip, Section };
export default OverviewTab;
