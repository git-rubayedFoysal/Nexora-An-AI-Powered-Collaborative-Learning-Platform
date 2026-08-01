import { forwardRef } from "react";
import { EmptyLesson } from "../index";

/**
 * VideoPlayer — Native HTML5 video player with forwardRef for keyboard control.
 *
 * Accepts a forwarded ref so parent (LearningPage) can access the <video> element
 * for play/pause/seek via keyboard shortcuts.
 * Falls back to EmptyLesson if no video URL is provided.
 */
const VideoPlayer = forwardRef(function VideoPlayer({ videoUrl }, ref) {
  if (!videoUrl) {
    return (
      <EmptyLesson
        icon="🎬"
        title="No video available"
        description="This lesson does not have a video yet."
      />
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-white/8 bg-black shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
      <video
        ref={ref}
        src={videoUrl}
        controls
        playsInline
        className="w-full"
        preload="metadata"
      >
        <track kind="captions" label="English" srcLang="en" />
      </video>
    </div>
  );
});

export default VideoPlayer;
