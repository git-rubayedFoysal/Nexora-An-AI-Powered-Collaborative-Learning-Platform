import { Input } from "../index";

/**
 * SearchBar
 * ---------
 * A reusable search input with a magnifier icon positioned absolutely
 * inside the input via `pl-9` padding offset.
 *
 * Used in three places:
 *   1. Centre of the desktop authenticated header
 *   2. Right side of the desktop guest header (narrower, w-44)
 *   3. Inside the mobile slide-down menu
 *
 * Props:
 *  - placeholder : string  — placeholder text shown inside the input
 *  - className   : string  — additional Tailwind classes for the wrapper <div>
 *  - inputClass  : string  — additional Tailwind classes for the <Input> itself
 */
function SearchBar({
  placeholder = "Search…",
  className = "",
  inputClass = "",
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Magnifier icon — non-interactive, sits on top of the input */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8892a4] pointer-events-none"
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
        type="search"
        placeholder={placeholder}
        className={`pl-9 pr-4 py-2 rounded-lg text-sm
                   bg-white/5 border border-white/8 text-white placeholder:text-[#545d72]
                   outline-none transition-all
                   focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
                   ${inputClass}`}
      />
    </div>
  );
}

export default SearchBar;
