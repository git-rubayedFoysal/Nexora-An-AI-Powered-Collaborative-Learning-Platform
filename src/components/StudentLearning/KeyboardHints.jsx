const SHORTCUTS = [
  { key: "Space", action: "play/pause" },
  { key: "←", action: "-10s" },
  { key: "→", action: "+10s" },
  { key: "N", action: "next" },
  { key: "P", action: "prev" },
];

/**
 * KeyboardHints — Desktop-only keyboard shortcut hints below the video.
 */
function KeyboardHints() {
  return (
    <div className="hidden lg:flex items-center justify-center gap-4 pt-2">
      {SHORTCUTS.map((hint) => (
        <div key={hint.key} className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 border border-white/8 text-slate-dark">
            {hint.key}
          </kbd>
          <span className="text-[9px] text-slate-dark">{hint.action}</span>
        </div>
      ))}
    </div>
  );
}

export default KeyboardHints;
