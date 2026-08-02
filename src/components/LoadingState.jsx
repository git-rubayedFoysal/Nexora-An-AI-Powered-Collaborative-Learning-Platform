// Spinning loader with optional text label
function LoadingState({ color = "", content = "" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div
        className="w-10 h-10 rounded-full border-4 border-border"
        style={{
          borderTopColor: `var(${color})`,
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p className="text-sm text-slate font-mono">Loading {content}</p>
    </div>
  );
}

export default LoadingState;
