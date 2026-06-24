import { useNavigate } from "react-router";
import { Button } from "../index";
import SearchBar from "./SearchBar";

/**
 * GuestActions
 * ------------
 * Right-side controls rendered when the user is **not** logged in.
 *
 * Contains:
 *  - A compact search bar (hidden on small screens, visible md+)
 *  - "Login" ghost button  (hidden on xs screens)
 *  - "Get Started" CTA button (always visible)
 *  - Hamburger / close icon to toggle the mobile menu
 *
 * Props:
 *  - mobileOpen   : boolean  — current mobile menu state (open/closed)
 *  - onMenuToggle : () => void — callback to flip the mobile menu
 */
function GuestActions({ mobileOpen, onMenuToggle }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3">
      {/* ── Compact search bar (desktop / tablet, hidden on mobile) ── */}
      <SearchBar
        placeholder="Search…"
        className="hidden md:flex"
        inputClass="w-44"
      />

      {/* ── Login ghost button ── */}
      <Button
        type="button"
        onClick={() => navigate("/login")}
        className="hidden md:inline-flex items-center px-4 py-2 rounded-lg
                   text-sm font-medium text-slate border border-white/8
                   hover:text-white hover:bg-violet-500/10 hover:border-violet-500
                   transition-all duration-200"
      >
        Login
      </Button>

      {/* ── Get Started gradient CTA ── */}
      <Button
        type="button"
        onClick={() => navigate("/signup")}
        className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
                   text-sm font-semibold text-white
                   bg-linear-to-br from-violet-600 to-violet-400
                   shadow-[0_4px_20px_rgba(124,90,247,.35)]
                   hover:-translate-y-px hover:shadow-[0_6px_28px_rgba(124,90,247,.5)]
                   transition-all duration-200"
      >
        Get Started
        {/* Arrow icon */}
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
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </Button>

      {/* ── Hamburger / close toggle (mobile only, lg:hidden) ── */}
      <Button
        type="button"
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-slate hover:text-white
                   hover:bg-white/6 transition-colors"
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          /* ✕ close icon */
          <svg
            className="w-5 h-5"
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
        ) : (
          /* ☰ hamburger icon */
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </Button>
    </div>
  );
}

export default GuestActions;
