// Main header — shows logo, nav links, and auth/guest controls
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { Logo } from "../index";

import NavLinks from "./NavLinks";
import GuestActions from "./GuestActions";
import AuthActions from "./AuthActions";
import MobileMenu from "./MobileMenu";

function Header() {
  const userData = useSelector((state) => state.auth.userData);

  const authStatus = userData ? true : false;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* ── Close avatar dropdown on outside click ── */
  function onClose() {
    setMobileOpen(false);
  }

  /* ── Navbar scroll shadow ── */
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 16);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close mobile menu on auth change */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [authStatus]);

  function onMenuToggle() {
    setMobileOpen((prev) => !prev);
  }

  /* Build avatar initials from user name */
  const initials = userData?.full_name
    ? userData?.full_name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("")
    : "U";

  const displayName = userData?.full_name ?? "User";
  const displayEmail = userData?.email ?? "";

  /* Guest nav links */
  const navLinks = [
    { name: "Features", slug: "#features" },
    { name: "Courses", slug: "#courses" },
    { name: "Stats", slug: "#stats" },
    { name: "Reviews", slug: "/#reviews" },
  ];

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "shadow-[0_4px_32px_rgba(0,0,0,.45)]" : "",
      ].join(" ")}
    >
      {/* Glass header bar */}
      <div className="glass border-b border-white/6">
        {/* start auth nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-17 gap-4 justify-between">
            <div className="flex items-center gap-14">
              {/* Logo */}
              <Logo />

              {/* Desktop nav links (guests only) */}
              <NavLinks links={navLinks} />
            </div>

            {/* Right side: guest actions (login, get started) */}

            {!authStatus && (
              <GuestActions
                mobileOpen={mobileOpen}
                onMenuToggle={onMenuToggle}
              />
            )}

            {/* Right side: auth actions (notifications, avatar) */}

            {authStatus && (
              <AuthActions
                initials={initials}
                displayName={displayName}
                displayEmail={displayEmail}
                mobileOpen={mobileOpen}
                onMenuToggle={onMenuToggle}
              />
            )}

            {/* end auth nav */}
          </div>
        </div>

        {/* Mobile slide-down menu (guests only) */}
        <MobileMenu isOpen={mobileOpen} links={navLinks} onClose={onClose} />
      </div>
    </header>
  );
}

export default Header;
