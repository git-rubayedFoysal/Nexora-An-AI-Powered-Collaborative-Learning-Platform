/**
 * PreviewVideoModal
 *
 * Full-screen modal for previewing a lesson video.
 * Shows video player with controls, lesson title, and description.
 *
 * Props:
 *  - isOpen  — whether the modal is visible
 *  - onClose — callback to close the modal
 *  - lesson  — lesson object (title, description, video_path)
 */

import { useEffect } from "react";
import { createPortal } from "react-dom";
import lessonStorage from "../../services/supabase/lesson/lesson.storage";

function PreviewVideoModal({ isOpen, onClose, lesson }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !lesson?.video_path) return null;

  const videoUrl = lessonStorage.getVideoUrl(lesson.video_path);

  return createPortal(
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-4"
      style={{
        background: "rgba(8,12,26,0.9)",
        backdropFilter: "blur(10px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass2 w-full max-w-3xl rounded-2xl border border-white/8 shadow-[0_24px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/50 text-slate hover:text-white transition-colors"
          title="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video player */}
        <div className="relative bg-black">
          <video
            src={videoUrl}
            controls
            playsInline
            autoPlay
            className="w-full"
            preload="metadata"
          />
        </div>

        {/* Lesson info */}
        <div className="p-5">
          <h3 className="text-base font-bold text-white mb-1 font-display">
            {lesson.title}
          </h3>
          {lesson.description && (
            <p className="text-sm text-slate leading-relaxed">
              {lesson.description}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default PreviewVideoModal;
