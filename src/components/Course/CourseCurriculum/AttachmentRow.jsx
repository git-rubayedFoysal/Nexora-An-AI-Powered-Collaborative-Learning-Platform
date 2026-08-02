/**
 * AttachmentRow
 *
 * Renders a single video or PDF attachment sub-row beneath a lesson.
 * Shows the file icon, filename, and a play/lock action for video only.
 *
 * Props:
 *  - lesson          — the lesson object (has title, video_path, pdf_path, is_preview)
 *  - type            — "video" | "pdf"
 *  - isEnrolled      — whether the student is enrolled in the course
 *  - onPlayPreview   — callback to open the preview video modal (video only)
 */

import { VideoIcon, PdfIcon, PlayIcon, LockIcon } from "./CourseIcons";

function AttachmentRow({ lesson, type, isEnrolled, onPlayPreview }) {
  const isVideo = type === "video";
  const Icon = isVideo ? VideoIcon : PdfIcon;
  const iconColor = isVideo ? "text-violet-light" : "text-coral";
  const label = isVideo ? "Video" : "PDF";

  return (
    <div className="flex items-center gap-3 pl-12 pr-5 py-1.5 hover:bg-white/2 transition-colors">
      <Icon className={`w-3 h-3 ${iconColor} shrink-0`} />
      <span className="text-[11px] text-slate truncate flex-1 min-w-0">
        {lesson.title || label}
      </span>
      {/* Play/lock buttons only for video */}
      {isVideo &&
        (isEnrolled || lesson.is_preview ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onPlayPreview) onPlayPreview(lesson);
            }}
            className="p-1 rounded text-teal hover:bg-teal/10 transition-colors shrink-0"
            title="Play Video"
          >
            <PlayIcon className="w-3 h-3" />
          </button>
        ) : (
          <LockIcon className="w-3 h-3 text-slate-dark shrink-0" />
        ))}
    </div>
  );
}

export default AttachmentRow;
