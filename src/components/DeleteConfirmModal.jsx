import { createPortal } from "react-dom";
import { Button } from "./index";
/**
 * DeleteConfirmModal
 *
 * Props:
 *  - isOpen    : boolean
 *  - onClose   : () => void
 *  - onConfirm : () => void
 *  - itemName  : string
 *  - loading   : boolean
 */
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName = "",
  loading = false,
  feature = "course",
}) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-4"
      style={{ background: "rgba(8,12,26,0.8)", backdropFilter: "blur(6px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass2 w-full max-w-sm rounded-2xl border border-white/8
                      shadow-[0_24px_60px_rgba(0,0,0,0.5)] p-7 text-center"
      >
        {/* Icon */}
        <div
          className="inline-flex items-center justify-center w-12 h-12
                        rounded-xl bg-coral-dim border border-coral/25 mb-5"
        >
          <svg
            className="w-6 h-6 text-coral"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        {/* Text */}
        <h2
          className="text-base font-bold text-white mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Delete {feature}?
        </h2>
        <p className="text-sm text-slate leading-relaxed mb-1">
          Are you sure you want to delete{" "}
          <span className="text-white font-semibold">"{itemName}"</span>?
        </p>
        <p className="text-xs text-slate-dark mb-6">
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold
                       text-slate border border-border
                       hover:text-white hover:bg-glass-2 transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white
                       bg-coral hover:bg-coral-light transition-all
                       shadow-[0_4px_16px_rgba(240,90,90,0.3)]
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default DeleteConfirmModal;
