import { Input } from "./index";

// Search input with a magnifier icon and a clear button
function SearchBar({
  placeholder = "Search…",
  className = "",
  inputClass = "",
  value,
  onChange,
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Magnifier icon on the left side */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pl-9 pr-4 py-2 rounded-lg text-sm
                   bg-white/5 border border-white/8 text-white placeholder:text-slate-dark
                   outline-none transition-all
                   focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                   ${inputClass}`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2
                     w-5 h-5 flex items-center justify-center
                     rounded-full text-slate hover:text-violet-500
                      transition"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
