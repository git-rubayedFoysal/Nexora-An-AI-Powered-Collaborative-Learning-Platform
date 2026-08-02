function EmptyLesson({ icon = "🎬", title = "No content", description = "" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center rounded-2xl border border-dashed border-border-2 bg-glass animate-fade-up">
      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet/20 to-teal/20 border border-white/10 flex items-center justify-center text-3xl">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-white font-display">{title}</p>
        {description && (
          <p className="text-xs text-slate mt-1.5 max-w-xs">{description}</p>
        )}
      </div>
    </div>
  );
}

export default EmptyLesson;
