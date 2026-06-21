import { Link } from "react-router";

function Logo({ width = "100px" }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 shrink-0 ${width}`}>
      <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet to-violet-light flex items-center justify-center font-black text-white text-base shadow-[0_0_20px_rgba(124,90,247,.4)]">
        N
      </div>
      <span className="font-bold text-lg tracking-tight">
        Nexora<span className="text-violet-light">LMS</span>
      </span>
    </Link>
  );
}

export default Logo;
