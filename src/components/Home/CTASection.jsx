import { Link } from "react-router";

function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden bg-navy-3">
      <div className="glow-orb w-96 h-96 bg-violet/25 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="glow-orb w-64 h-64 bg-teal/15 bottom-0 right-20"></div>

      <div className="relative max-w-3xl mx-auto text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet/25 mb-7">
          <span className="w-2 h-2 rounded-full bg-violet animate-pulse"></span>
          <span className="text-xs font-semibold text-violet-light font-mono tracking-wider">
            START FOR FREE
          </span>
        </div>
        <h2 className="text-5xl lg:text-6xl font-black mb-5 leading-tight font-[Outfit]">
          Ready to learn
          <br />
          <span className="gradient-text">smarter?</span>
        </h2>
        <p className="text-lg text-slate-light mb-10 max-w-lg mx-auto">
          Join 2,400+ students and educators on Nexora. No credit card. No
          friction. Just learning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="btn-primary px-10 py-4 rounded-xl text-base font-bold text-white inline-flex items-center gap-2 justify-center"
          >
            Create Free Account
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <a
            href="#features"
            className="btn-secondary px-10 py-4 rounded-xl text-base font-semibold text-slate border border-white/1 inline-flex items-center gap-2 justify-center"
          >
            Explore Features
          </a>
        </div>
        <p className="text-xs text-slate mt-5">
          Free for students · No credit card required
        </p>
      </div>
    </section>
  );
}

export default CTASection;
