import { useNavigate } from "react-router";
import { Button } from "../index";
import SearchBar from "./SearchBar";

/**
 * MobileMenu
 * ----------
 * Slide-down menu shown on **small screens (< lg)** for **guest** users.
 *
 * Animates open/close via `max-height` + `opacity` transitions.
 * Contains a search bar, the same nav links as the desktop header,
 * and Login / Get Started CTA buttons stacked side-by-side.
 *
 * Props:
 *  - isOpen  : boolean                            — drives the CSS transition
 *  - links   : Array<{ name: string, slug: string }> — nav items to render
 *  - onClose : () => void                         — collapses the menu
 */
function MobileMenu({ isOpen, links, onClose }) {
  const navigate = useNavigate();

  /* Navigate then close so the menu collapses immediately after a tap */
  function goTo(path) {
    navigate(path);
    onClose();
  }

  return (
    <div
      className={[
        "lg:hidden overflow-hidden transition-[max-height,opacity] duration-300",
        isOpen
          ? "max-h-screen opacity-100 pointer-events-auto"
          : "max-h-0 opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="border-t border-white/6 px-4 py-4 space-y-1">
        {/* ── Mobile search bar ── */}
        <SearchBar
          placeholder="Search courses…"
          className="mb-3"
          inputClass="w-full"
        />

        {/* ── Nav links ── */}
        {links.map((item) => (
          <a
            key={item.slug}
            href={item.slug}
            onClick={onClose}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium
                       text-slate hover:text-white hover:bg-white/5 transition-colors"
          >
            {item.name}
          </a>
        ))}

        {/* ── Login + Get Started side-by-side ── */}
        <div className="flex gap-2 pt-3">
          <Button
            type="button"
            onClick={() => goTo("/login")}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center
                       text-slate border border-white/8
                       hover:text-white hover:border-white/20 transition-colors"
          >
            Login
          </Button>

          <Button
            type="button"
            onClick={() => goTo("/signup")}
            className="flex-1 py-2.5 rounded-lg text-sm font-bold text-center text-white
                       bg-linear-to-br from-violet-600 to-violet-400
                       shadow-[0_4px_16px_rgba(124,90,247,.3)] transition-all"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
