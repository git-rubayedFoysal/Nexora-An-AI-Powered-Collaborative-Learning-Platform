/**
 * AssignmentItem
 *
 * Single clickable assignment row inside a ModuleAccordion.
 * Shows position number, title, and assignment icon.
 * Styled with amber to distinguish from lesson items.
 *
 * Props:
 *  - assignment — the assignment object (id, position, title)
 *  - onClick    — callback when clicked
 */

import { useNavigate } from "react-router";

function AssignmentItem({ assignment, onClick }) {
  const navigate = useNavigate();

  function handleClick() {
    if (onClick) {
      onClick(assignment);
    } else {
      navigate(`/dashboard/assignments/${assignment.id}`);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={[
        "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left transition-colors",
        "text-amber/80 hover:text-amber hover:bg-amber/5 border-l-2 border-transparent",
      ].join(" ")}
    >
      <div className="flex gap-2 items-center">
        <span className="text-[10px] font-mono text-amber/50 w-5 text-right shrink-0">
          {String(assignment.position).padStart(2, "0")}
        </span>

        {/* Assignment icon */}
        <svg
          className="w-3 h-3 shrink-0 text-amber"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>

        <div className="flex-1 min-w-0">
          <p className="text-xs truncate">{assignment.title}</p>
        </div>
      </div>

      {/* Assignment badge */}
      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber/15 text-amber shrink-0">
        ASG
      </span>
    </button>
  );
}

export default AssignmentItem;
