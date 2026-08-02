// Desktop nav links for guest users (features, courses, stats, reviews)
import { useNavigate } from "react-router";
function NavLinks({ links }) {
  const navigate = useNavigate();
  return (
    <nav className="hidden lg:flex items-center gap-7 ml-4">
      {links.map((item) => (
        <a
          key={item.slug}
          onClick={() => navigate("/")}
          href={item.slug}
          className="relative text-sm font-mono font-black text-slate hover:text-white transition-colors
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
