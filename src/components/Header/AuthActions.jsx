import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout as authLogout } from "../../features/auth/authSlice";
import AvatarDropdown from "./AvatarDropdown";
import { Button } from "../index";
import authService from "../../services/supabase/auth.service";

/**
 * AuthActions
 * -----------
 * Right-side controls rendered when the user **is** logged in.
 *
 * Contains (left → right):
 *  1. Mobile search icon button (visible only on <md screens)
 *  2. Notification bell with an unread green dot
 *  3. AvatarDropdown — avatar button + slide-down profile menu
 *
 * Props:
 *  - initials    : string  — 1-2 uppercase initials for the avatar circle
 *  - displayName : string  — user's full name
 *  - displayEmail: string  — user's email address
 */
function AuthActions({ initials, displayName, displayEmail }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* Local state: controls the avatar dropdown open/close */
  const [avatarOpen, setAvatarOpen] = useState(false);

  /* Dispatch logout action, close dropdown, then redirect to /login */
  async function handleLogout() {
    setAvatarOpen(false);

    await authService.signOut();
    dispatch(authLogout());

    navigate("/login");
  }

  return (
    <div className="flex items-center gap-2 ml-auto">
      {/* ── Mobile search icon (shows a search UI on tap — not yet wired up) ── */}
      <Button
        type="button"
        className="md:hidden p-2 rounded-lg text-slate hover:text-white
                   hover:bg-white/6 transition-colors"
        aria-label="Search"
      >
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </Button>

      {/* ── Notification bell with unread indicator dot ── */}
      <Button
        type="button"
        className="relative p-2 rounded-lg text-slate hover:text-white
                   hover:bg-white/6 transition-colors"
        aria-label="Notifications"
      >
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {/* Green unread dot — border color matches the header background */}
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal border-2 border-navy" />
      </Button>

      {/* ── Avatar dropdown (profile menu) ── */}
      <AvatarDropdown
        initials={initials}
        displayName={displayName}
        displayEmail={displayEmail}
        isOpen={avatarOpen}
        onToggle={() => setAvatarOpen((prev) => !prev)}
        onClose={() => setAvatarOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default AuthActions;
