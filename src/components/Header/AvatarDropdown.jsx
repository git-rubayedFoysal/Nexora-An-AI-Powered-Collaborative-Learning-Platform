// Avatar button with slide-down profile menu for logged-in users
import { useRef, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "../index";

// Menu items shown in the dropdown
const DROPDOWN_ITEMS = [
  {
    label: "Profile",
    to: "/dashboard/profile",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    ),
  },
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    ),
  },
];

/**
 * AvatarDropdown
 * --------------
 * The circular avatar button + slide-down panel for authenticated users.
 *
 * Behaviour:
 *  - Clicking the avatar button toggles `isOpen` (managed here via `avatarRef`
 *    and a mousedown listener that closes the panel on outside clicks).
 *  - The dropdown panel shows the user's full name + email, three nav links,
 *    and a red "Logout" button at the bottom.
 *
 * Props:
 *  - initials    : string   — 1-2 uppercase letters derived from full name
 *  - displayName : string   — full name shown next to avatar on md+ screens
 *  - displayEmail: string   — email shown in the dropdown header
 *  - isOpen      : boolean  — whether the panel is currently visible
 *  - onToggle    : () => void        — flip open/closed state
 *  - onClose     : () => void        — force-close the panel (used by Link clicks)
 *  - onLogout    : () => void        — called when "Logout" is clicked
 */
function AvatarDropdown({
  initials,
  displayName,
  displayEmail,
  isOpen,
  onToggle,
  onClose,
  onLogout,
}) {
  const avaterRef = useRef(null);

/* Close dropdown when clicking outside */
  useEffect(() => {
    function handleOutsideClick(e) {
      if (avaterRef.current && !avaterRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <div className="relative" ref={avaterRef}>
      {/* Avatar trigger button */}
      <Button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 px-1.5 py-1 rounded-lg hover:bg-white/6 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Gradient circle with initials */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center
                     text-xs font-bold text-white shrink-0
                     bg-linear-to-br from-violet-500 to-teal
                     shadow-[0_0_12px_rgba(124,90,247,.35)]"
        >
          {initials}
        </div>

        {/* Full name (desktop only) */}
        <span className="hidden md:block text-sm font-medium text-white max-w-30 truncate">
          {displayName}
        </span>

        {/* Chevron that rotates when open (desktop only) */}
        <svg
          className={[
            "hidden md:block w-4 h-4 text-slate transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {/* Dropdown panel (shown when open) */}
      {isOpen && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl py-1.5 z-50
                     border border-white/8 shadow-[0_16px_48px_rgba(0,0,0,.5)]"
          style={{
            background: "rgba(13,18,37,.95)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* User name + email header */}
          <div className="px-4 py-3 border-b border-white/6">
            <div className="text-sm font-semibold text-white truncate">
              {displayName}
            </div>
            <div className="text-xs text-slate truncate mt-0.5">
              {displayEmail}
            </div>
          </div>

          {/* Navigation links (Profile, Dashboard, Settings) */}
          {DROPDOWN_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate
                         hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {item.icon}
              </svg>
              {item.label}
            </Link>
          ))}

          {/* Logout button */}
          <div className="border-t border-white/6 mt-1 pt-1">
            <Button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm
                         text-coral hover:bg-coral/10 transition-colors"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvatarDropdown;
