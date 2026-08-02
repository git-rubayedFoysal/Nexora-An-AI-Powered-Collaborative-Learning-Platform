// Shown when there's no data to display (e.g., no courses, no results)
function EmptyState({
  icon = "",
  title = "",
  description = "",
  buttonText = "",
  onButtonClick = () => {},
  noButton = true,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-25 gap-4 text-center">
      <div
        className="w-16 h-16 rounded-2xl bg-glass-2 border border-border
                            flex items-center justify-center text-3xl mb-2"
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white font-display">{title}</h3>
      <p className="text-sm text-slate">{description}</p>
      <button
        onClick={onButtonClick}
        className={`${noButton === true ? "hidden" : ""} mt-2 px-5 py-3 rounded-lg cursor-pointer text-xs font-semibold
                         bg-violet/15 text-violet-light border border-violet/25
                         hover:bg-violet/25 transition-all`}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default EmptyState;
