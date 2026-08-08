/**
 * AssignmentRow
 *
 * Renders a single assignment inside an expanded module panel.
 * Shows position number, title, due date, and navigates to the detail page on click.
 *
 * Props:
 *  - assignment — the assignment object (id, position, title, due_date, max_score)
 */

import { useNavigate } from "react-router";
import formatDate from "../../../utils/formatDate";
import { AssignmentIcon } from "./CourseIcons";

function AssignmentRow({ assignment }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/dashboard/assignments/${assignment.id}`)}
      className="flex items-center gap-3 px-5 py-2.5 bg-amber/5 border-l-2 border-amber/40 hover:bg-amber/10 transition-colors cursor-pointer"
    >
      {/* Position number: "01", "02", etc. */}
      <span className="text-[10px] font-mono text-amber/60 w-5 text-right shrink-0">
        {String(assignment.position).padStart(2, "0")}
      </span>

      {/* Assignment icon */}
      <AssignmentIcon className="w-3 h-3 text-amber shrink-0" />

      {/* Assignment title */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-amber/90 truncate font-medium">{assignment.title}</p>
      </div>

      {/* Assignment badge */}
      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber/15 text-amber shrink-0">
        ASG
      </span>

      {/* Due date */}
      <span className="text-[10px] text-amber/50 shrink-0">
        Due: {formatDate(assignment.due_date)}
      </span>
    </div>
  );
}

export default AssignmentRow;
