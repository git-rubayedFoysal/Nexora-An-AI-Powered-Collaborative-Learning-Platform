import { useMemo } from "react"; // FIX 1: removed useState — not needed
import { NavLink } from "react-router"; // kept NavLink (your approach, better than keys)
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout as storeLogout } from "../../features/auth/authSlice";
import authService from "../../services/supabase/auth/auth.service";

/* ─────────────────────────────────────────────
   NAV CONFIG — one source of truth per role
   Defined outside the component so the object
   is never re-created on every render.
───────────────────────────────────────────── */

const MENUS = {
  student: {
    accentClass: "bg-teal/10 text-teal border-l-2 border-teal",
    sections: [
      {
        title: "MAIN",
        items: [
          { name: "Dashboard", path: "/dashboard", icon: "🏠" },
          {
            name: "My Courses",
            path: "/dashboard/courses",
            icon: "📚",
            badge: "4",
            badgeColor: "bg-teal/15 text-teal",
          },
          {
            name: "Assignments",
            path: "/dashboard/assignments",
            icon: "📝",
            badge: "2",
            badgeColor: "bg-amber/15 text-amber",
          },
          { name: "Quizzes", path: "/quizzes", icon: "❓" },
          { name: "Lectures", path: "/lectures", icon: "🎥" },
        ],
      },
      {
        title: "TOOLS",
        items: [
          { name: "AI Tutor", path: "/ai-tutor", icon: "🤖" },
          {
            name: "Chat",
            path: "/dashboard/chat",
            icon: "💬",
            badge: "5",
            badgeColor: "bg-violet/20 text-violet-light",
          },
          { name: "Analytics", path: "/analytics", icon: "📊" },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          {
            name: "Notifications",
            path: "/dashboard/notifications",
            icon: "🔔",
            badge: "3",
            badgeColor: "bg-teal/15 text-teal",
          },
          { name: "Profile", path: "/dashboard/profile", icon: "👤" },
        ],
      },
    ],
  },

  teacher: {
    accentClass: "bg-amber/10 text-amber border-l-2 border-amber", // FIX 4: amber accent, not teal
    sections: [
      {
        title: "TEACHING",
        items: [
          { name: "Dashboard", path: "/dashboard", icon: "🏠" },
          {
            name: "My Courses",
            path: "/dashboard/courses",
            icon: "📚",
            badge: "3",
            badgeColor: "bg-amber/15 text-amber",
          },
          {
            name: "Assignments",
            path: "/dashboard/assignments",
            icon: "📝",
            badge: "8",
            badgeColor: "bg-coral/15 text-coral",
          },
          { name: "Quiz Builder", path: "/dashboard/quizzes", icon: "❓" },
          { name: "Lectures", path: "/dashboard/lectures", icon: "🎥" },
        ],
      },
      {
        title: "GRADING",
        items: [
          {
            name: "Grade Center",
            path: "/dashboard/grade",
            icon: "✅",
            badge: "8",
            badgeColor: "bg-amber/15 text-amber",
          },
          { name: "Whiteboard", path: "/dashboard/whiteboard", icon: "🎨" },
          { name: "Analytics", path: "/dashboard/analytics", icon: "📊" },
          { name: "Chat", path: "/dashboard/chat", icon: "💬" },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          {
            name: "Notifications",
            path: "/dashboard/notifications",
            icon: "🔔",
          },
          { name: "Profile", path: "/dashboard/profile", icon: "👤" },
        ],
      },
    ],
  },

  admin: {
    accentClass: "bg-coral/10 text-coral border-l-2 border-coral", // FIX 4: coral accent
    sections: [
      {
        title: "PLATFORM",
        items: [
          { name: "Dashboard", path: "/dashboard", icon: "🏠" },
          {
            name: "Users",
            path: "/dashboard/users",
            icon: "👥",
            badge: "248",
            badgeColor: "bg-coral/15 text-coral",
          },
          {
            name: "Courses",
            path: "/dashboard/course",
            icon: "📚",
            badge: "12",
            badgeColor: "bg-amber/15 text-amber",
          },
          { name: "Enrollment", path: "/dashboard/enrollment", icon: "📋" },
          { name: "Statistics", path: "/dashboard/statistics", icon: "📊" },
        ],
      },
      {
        title: "SYSTEM",
        items: [
          { name: "Settings", path: "/dashboard/settings", icon: "⚙️" },
          { name: "Role & Access", path: "/dashboard/role-access", icon: "🛡️" },
          { name: "Audit Log", path: "/dashboard/log", icon: "📋" },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          {
            name: "Notifications",
            path: "/dashboard/notifications",
            icon: "🔔",
          },
        ],
      },
    ],
  },
};

/**
 * Sidebar
 * -------
 * Role-based sidebar navigation for Nexora LMS.
 * Uses React Router's <NavLink> for active-route detection.
 *
 * Props:
 *  - role     : 'student' | 'teacher' | 'admin'
 *  - isOpen   : boolean  — mobile slide-in state (controlled by parent / Header)
 *  - onClose  : () => void — called when backdrop or a nav link is tapped on mobile
 */
function Sidebar({ role = "student", isOpen = false, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const config = useMemo(
    () => MENUS[role?.toLowerCase()] ?? MENUS.student,
    [role],
  );

  async function handleLogout() {
    await authService.signOut();
    dispatch(storeLogout());
    navigate("/login");
  }

  return (
    <>
      {/*
       * Mobile backdrop overlay — tapping it closes the sidebar.
       * Only rendered when isOpen is true on small screens.
       */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed left-0 bottom-0 w-55 bg-navy-2",
          "border-r border-white/6 pt-4 pb-6 overflow-y-auto flex flex-col z-40 top-16 lg:top-0",
          // Mobile: slide in/out via transform; desktop: always visible
          "transition-transform duration-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <nav className="px-3 space-y-1 flex-1">
          {config.sections.map((section) => (
            /*
             * FIX 2: was <key="..."> on a Fragment (<>) — React silently
             * ignores keys on fragments, causing list-key warnings in dev.
             * Replaced with a real <div key={...}>.
             */
            <div key={section.title}>
              <div className="px-2 text-[10px] font-black text-slate-dark uppercase tracking-widest mb-2 mt-4 font-mono first:mt-2">
                {section.title}
              </div>

              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "nav-item flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? config.accentClass
                        : "text-slate hover:text-white hover:bg-white/6",
                    ].join(" ")
                  }
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}

          {/* Sign out — always at the bottom */}
          <div className="mt-4">
            <button
              onClick={handleLogout}
              className="nav-item flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate hover:text-white hover:bg-white/6 transition-colors cursor-pointer"
            >
              <span className="text-base leading-none">🚪</span>
              Sign out
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
