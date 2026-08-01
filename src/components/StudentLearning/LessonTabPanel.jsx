import { PdfViewer } from "../index";

/**
 * LessonTabPanel — Toggle between lesson overview and PDF notes.
 */
function LessonTabPanel({ activeTab, onTabChange, lesson, pdfUrl }) {
  return (
    <div>
      <div className="flex gap-1 p-1 rounded-xl bg-white/3 border border-white/6 mb-4">
        <button
          onClick={() => onTabChange("overview")}
          className={[
            "flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-colors",
            activeTab === "overview"
              ? "bg-violet/15 text-violet-light"
              : "text-slate hover:text-white",
          ].join(" ")}
        >
          Overview
        </button>
        <button
          onClick={() => onTabChange("notes")}
          className={[
            "flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-colors",
            activeTab === "notes"
              ? "bg-violet/15 text-violet-light"
              : "text-slate hover:text-white",
          ].join(" ")}
        >
          Notes
          {lesson.pdf_name && (
            <span className="ml-1.5 text-[9px] opacity-60">•</span>
          )}
        </button>
      </div>

      <div className="glass2 rounded-2xl p-5 border border-white/8 min-h-30">
        {activeTab === "overview" ? (
          lesson.description ? (
            <p className="text-sm text-slate-light leading-relaxed">
              {lesson.description}
            </p>
          ) : (
            <p className="text-xs text-slate-dark">
              No description available for this lesson.
            </p>
          )
        ) : (
          <PdfViewer pdfUrl={pdfUrl} pdfName={lesson.pdf_name} />
        )}
      </div>
    </div>
  );
}

export default LessonTabPanel;
