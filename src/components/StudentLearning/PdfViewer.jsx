/**
 * PdfViewer — Pure content component for the Notes tab.
 *
 * If a PDF URL exists: shows file icon, name, and "Open Notes" link.
 * If no PDF: shows a subtle empty state.
 * No outer wrapper — parent tab panel provides the container.
 */
function PdfViewer({ pdfUrl, pdfName }) {
  if (!pdfUrl) {
    return (
      <div className="flex items-center gap-3 py-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-slate-dark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-white">No lesson notes</p>
          <p className="text-[10px] text-slate-dark mt-0.5">
            Notes will appear here once uploaded by the instructor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-10 h-10 rounded-xl bg-coral-dim border border-coral/20 flex items-center justify-center shrink-0">
        <svg
          className="w-5 h-5 text-coral"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white truncate">
          {pdfName || "Lesson Notes"}
        </p>
        <p className="text-[10px] text-slate-dark">PDF Document</p>
      </div>
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet/15 text-violet-light border border-violet/25 hover:bg-violet/25 hover:border-violet/40 transition-all"
        aria-label={`Open ${pdfName || "lesson notes"} in new tab`}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
        Open Notes
      </a>
    </div>
  );
}

export default PdfViewer;
