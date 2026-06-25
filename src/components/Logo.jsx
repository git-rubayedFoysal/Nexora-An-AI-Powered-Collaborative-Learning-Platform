import { Link } from "react-router";

function Logo({ width = "100px" }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 shrink-0 ${width}`}>
      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet to-violet-light flex items-center justify-center font-black text-white text-lg shadow-[0_0_24px_rgba(124,90,247,.4)] font-[Outfit]">
        N
      </div>
      <span className="hidden md:block font-bold text-xl tracking-tight font-[Outfit]">
        Nexora<span className="text-violet-light">LMS</span>
      </span>
    </Link>
  );
}

export default Logo;
