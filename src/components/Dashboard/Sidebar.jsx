// Role-based sidebar navigation — different menus for student/teacher/admin
import { useMemo } from "react";
import { NavLink } from "react-router";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout as storeLogout } from "../../features/auth/authSlice";
import authService from "../../services/supabase/auth/auth.service";

// Menu config — one source of truth per role

const MENUS = {
  student: {
    accentClass: "bg-teal/10 text-teal border-l-2 border-teal",
    sections: [
      {
        title: "MAIN",
        items: [
          { name: "Dashboard", path: "/dashboard", icon: "🏠", end: true },
          {
            name: "My Learning",
            path: "/dashboard/my-learning",
            icon: "📚",
          },
          {
            name: "Assignments",
            path: "/dashboard/assignments",
            icon: "📝",
          },
          { name: "Quizzes", path: "/quizzes", icon: "❓", comingSoon: true },
          { name: "Lectures", path: "/lectures", icon: "🎥", comingSoon: true },
        ],
      },
      {
        title: "TOOLS",
        items: [
          { name: "AI Tutor", path: "/ai-tutor", icon: "🤖", comingSoon: true },
          { name: "Chat", path: "/dashboard/chat", icon: "💬", comingSoon: true },
          { name: "Analytics", path: "/analytics", icon: "📊", comingSoon: true },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          { name: "Notifications", path: "/dashboard/notifications", icon: "🔔", comingSoon: true },
          { name: "Profile", path: "/dashboard/profile", icon: "👤" },
        ],
      },
    ],
  },

  teacher: {
    accentClass: "bg-amber/10 text-amber border-l-2 border-amber",
    sections: [
      {
        title: "TEACHING",
        items: [
          { name: "Dashboard", path: "/dashboard", icon: "🏠", end: true },
          {
            name: "My Courses",
            path: "/dashboard/my-courses",
            icon: "📚",
          },
          {
            name: "Assignments",
            path: "/dashboard/assignments",
            icon: "📝",
          },
          { name: "Quiz Builder", path: "/dashboard/quizzes", icon: "❓", comingSoon: true },
          { name: "Lectures", path: "/dashboard/lectures", icon: "🎥", comingSoon: true },
        ],
      },
      {
        title: "GRADING",
        items: [
          {
            name: "Grade Center",
            path: "/dashboard/grade",
            icon: "✅",
          },
          { name: "Whiteboard", path: "/dashboard/whiteboard", icon: "🎨", comingSoon: true },
          { name: "Analytics", path: "/dashboard/analytics", icon: "📊", comingSoon: true },
          { name: "Chat", path: "/dashboard/chat", icon: "💬", comingSoon: true },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          { name: "Notifications", path: "/dashboard/notifications", icon: "🔔", comingSoon: true },
          { name: "Profile", path: "/dashboard/profile", icon: "👤" },
        ],
      },
    ],
  },

  admin: {
    accentClass: "bg-coral/10 text-coral border-l-2 border-coral",
    sections: [
      {
        title: "PLATFORM",
        items: [
          { name: "Dashboard", path: "/dashboard", icon: "🏠", end: true },
          { name: "Users", path: "/dashboard/users", icon: "👥" },
          {
            name: "Courses",
            path: "/dashboard/manage-courses",
            icon: "📚",
          },
          { name: "Enrollment", path: "/dashboard/enrollment", icon: "📋" },
          { name: "Statistics", path: "/dashboard/statistics", icon: "📊", comingSoon: true },
        ],
      },
      {
        title: "SYSTEM",
        items: [
          { name: "Settings", path: "/dashboard/settings", icon: "⚙️", comingSoon: true },
          { name: "Role & Access", path: "/dashboard/role-access", icon: "🛡️" },
          { name: "Audit Log", path: "/dashboard/log", icon: "📋", comingSoon: true },
        ],
      },
      {
        title: "ACCOUNT",
        items: [
          { name: "Notifications", path: "/dashboard/notifications", icon: "🔔", comingSoon: true },
        ],
      },
    ],
  },
};

/**
 * Sidebar — role-based navigation with mobile slide-in.
 * Active item gets accent color + left border.
 * Inactive items have no background, only hover effect.
 */
function Sidebar({ role = "student", isOpen = false, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get menu config for current role
  const config = useMemo(
    () => MENUS[role?.toLowerCase()] ?? MENUS.student,
    [role],
  );

  /* Sign out handler */
  async function handleLogout() {
    await authService.signOut();
    dispatch(storeLogout());
    navigate("/login");
  }

  return (
    <>
      {/* Mobile backdrop */}
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
          "transition-transform duration-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <nav className="px-3 space-y-1 flex-1">
          {config.sections.map((section) => (
            <div key={section.title}>
              <div className="px-2 text-[10px] font-black text-slate-dark uppercase tracking-widest mb-2 mt-4 font-mono first:mt-2">
                {section.title}
              </div>

              {section.items.map((item) =>
                item.comingSoon ? (
                  <div
                    key={item.path}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl
                               text-sm font-medium text-slate-dark/50 cursor-not-allowed
                               select-none"
                    title="Coming soon"
                  >
                    <span className="text-base leading-none opacity-40">{item.icon}</span>
                    <span className="truncate opacity-50">{item.name}</span>
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-semibold
                                     bg-white/5 text-slate-dark/40 border border-white/5 shrink-0">
                      Soon
                    </span>
                  </div>
                ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  end={item.end ?? false}
                  className={({ isActive }) =>
                    [
                      "nav-item flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl",
                      "text-sm font-medium transition-colors",
                      isActive
                        ? config.accentClass
                        : "text-slate hover:text-white hover:bg-white/6",
                    ].join(" ")
                  }
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </NavLink>
                ),
              )}
            </div>
          ))}

          {/* Sign out */}
          <div className="mt-4">
            <button
              onClick={handleLogout}
              className="nav-item flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl
                         text-sm font-medium text-slate hover:text-white hover:bg-white/6
                         transition-colors cursor-pointer"
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
