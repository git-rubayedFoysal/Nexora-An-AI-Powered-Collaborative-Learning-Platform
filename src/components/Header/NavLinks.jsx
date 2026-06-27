import { useNavigate } from "react-router";

/**
 * NavLinks
 * --------
 * Renders the horizontal navigation links shown in the desktop header
 * for **unauthenticated** (guest) users only.
 *
 * Each link uses an animated underline that grows from left-to-right
 * on hover via a Tailwind `after:` pseudo-element trick.
 *
 * Props:
 *  - links: Array<{ name: string, slug: string }>
 */
function NavLinks({ links }) {
  const navigate = useNavigate();
  return (
    <nav className="hidden lg:flex items-center gap-6 ml-4">
      {links.map((item) => (
        <a
          key={item.slug}
          onClick={() => navigate("/")}
          href={item.slug}
          className="relative text-sm font-medium text-slate hover:text-white transition-colors
                     after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0
                     after:rounded-full after:bg-linear-to-r after:from-violet-500 after:to-teal-400
                     after:transition-[width] after:duration-250 hover:after:w-full"
        >
          {item.name}
        </a>
      ))}
    </nav>
  );
}

export default NavLinks;
