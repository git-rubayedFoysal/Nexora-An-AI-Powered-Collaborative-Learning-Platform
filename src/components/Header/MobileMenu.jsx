// Mobile slide-down menu for guest users (small screens only)
import { useNavigate } from "react-router";
import { Button } from "../index";
import { useSelector } from "react-redux";
function MobileMenu({ isOpen, links, onClose }) {
  const navigate = useNavigate();

  /* Navigate then close menu */
  function goTo(path) {
    navigate(path);
    onClose();
  }

  const userData = useSelector((state) => state.auth.userData);

  const authStatus = userData ? true : false;

  return (
    <div
      className={[
        "lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 bg-navy-4",
        isOpen
          ? "max-h-screen opacity-100 pointer-events-auto"
          : "max-h-0 opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="border-t border-white/6 px-4 py-4 space-y-1">
        {/* Nav links */}
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

        {/* Login + Get Started buttons */}
        {!authStatus && (
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
        )}
      </div>
    </div>
  );
}

export default MobileMenu;
