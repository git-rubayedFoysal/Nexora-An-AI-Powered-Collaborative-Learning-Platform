/**
 * Determine whether a submission is late and compute a human-readable label.
 *
 * @param {string|null} submittedAt - ISO timestamp of the submission
 * @param {string|null} dueDate     - ISO timestamp of the assignment deadline
 * @returns {{ late: boolean, label: string } | null}
 *   null when inputs are missing, otherwise an object with `late` flag and
 *   a short label like "2h 15m late" or "1d 3h late".
 */
function getSubmissionTiming(submittedAt, dueDate) {
  if (!submittedAt || !dueDate) return null;

  const submitted = new Date(submittedAt);
  const due = new Date(dueDate);

  if (Number.isNaN(submitted.getTime()) || Number.isNaN(due.getTime()))
    return null;

  if (submitted <= due) return { late: false, label: "" };

  const diffMs = submitted.getTime() - due.getTime();
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 && days === 0) parts.push(`${minutes}m`);

  return { late: true, label: `${parts.join(" ")} late` };
}

export default getSubmissionTiming;
