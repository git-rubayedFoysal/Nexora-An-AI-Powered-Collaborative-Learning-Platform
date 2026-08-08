/**
 * AttachmentSection
 *
 * Renders the attachment upload/display area inside the assignment modal.
 * Handles three states:
 *  - Edit mode with existing attachment — shows read-only file card
 *  - Create mode with selected file — shows file card with remove button
 *  - Create mode without file — shows upload dropzone
 *
 * Props:
 *  - isEdit              — whether the modal is in edit mode
 *  - assignment          — the assignment object (edit mode only)
 *  - attachmentFile      — currently selected file (create mode)
 *  - setAttachmentFile   — setter to update the selected file
 *  - setSubmitError      — setter to show validation errors
 */

function AttachmentSection({
  isEdit,
  assignment,
  attachmentFile,
  setAttachmentFile,
  setSubmitError,
}) {
  return (
    <section className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-white font-display">
          Attachment
        </span>
        <span className="text-[10px] font-mono text-slate-dark">
          {isEdit ? "Existing" : "Optional"}
        </span>
      </div>

      {/* ── Edit mode: show existing attachment ── */}
      {isEdit ? (
        assignment?.attachment_name ? (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-glass px-4 py-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet/15 border border-violet/25">
              <svg
                className="w-5 h-5 text-violet-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white font-medium truncate">
                {assignment.attachment_name}
              </p>
              <p className="text-[11px] text-slate-dark">Current attachment</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-dark font-mono">
            No attachment uploaded.
          </p>
        )
      ) : /* ── Create mode: show selected file or dropzone ── */
      attachmentFile ? (
        <div className="relative flex items-center gap-3 rounded-xl border border-border bg-glass px-4 py-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet/15 border border-violet/25">
            <svg
              className="w-5 h-5 text-violet-light"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white font-medium truncate">
              {attachmentFile.name}
            </p>
            <p className="text-[11px] text-slate-dark">
              {attachmentFile.size.toLocaleString()} bytes
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAttachmentFile(null)}
            className="p-1.5 rounded-lg text-slate hover:text-coral hover:bg-coral-dim transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <label
          className="flex flex-col items-center justify-center gap-3 rounded-xl
                     border border-dashed border-border-2 bg-glass py-8 px-6 text-center
                     hover:border-violet/40 hover:bg-glass-2 transition-all cursor-pointer"
        >
          <svg
            className="w-8 h-8 text-slate-dark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <div>
            <p className="text-sm text-slate font-medium">
              Upload an attachment
            </p>
            <p className="text-xs text-slate-dark mt-0.5">
              Any file type, max 20 MB
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 10 * 1024 * 1024) {
                  setSubmitError("Attachment must be under 10 MB.");
                  return;
                }
                setAttachmentFile(file);
                setSubmitError("");
              }
            }}
          />
        </label>
      )}
    </section>
  );
}

export default AttachmentSection;
