import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Logo, Button } from "../index";
import AuthActions from "../Header/AuthActions";
import { useSelector } from "react-redux";

function DashboardHeader({ mobileOpen, onMenuToggle }) {
  const [scrolled, setScrolled] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const user = userData?.user_metadata;

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("")
    : "U";
  const displayName = user?.full_name || "User";
  const displayEmail = user?.email || "";

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 16);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 right-0 left-0 lg:left-55 z-50 transition-all duration-300",
        scrolled ? "shadow-[0_4px_32px_rgba(0,0,0,.45)]" : "",
      ].join(" ")}
    >
      {/* ── Glass bar ── */}
      <div className="glass border-b border-white/6">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-17 gap-4">
            {/* ── Logo ── */}
            <div className="flex">
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 shrink-0"
              >
                <Logo />
              </Link>
            </div>

            {/* Navbar for auth users */}
            <div className="flex">
              <AuthActions
                initials={initials}
                displayName={displayName}
                displayEmail={displayEmail}
              />
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
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
