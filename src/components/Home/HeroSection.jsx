import { Link } from "react-router";
import imgLink from "../../assets/Online-learning-amico.svg";

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh"></div>
      <div className="absolute inset-0 hero-grid-bg opacity-60"></div>

      {/* Glow orbs */}
      <div className="glow-orb w-96 h-96 bg-violet/30 top-10 -left-32 animate-float"></div>
      <div
        className="glow-orb w-80 h-80 bg-teal/20 bottom-10 right-0 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-19 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center justify-between">
          {/* Left: Copy */}
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet/25 mb-8 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
              <span className="text-[11px] font-bold text-teal font-mono tracking-[0.15em]">
                AI-POWERED LEARNING PLATFORM
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 animate-fade-up delay-100 font-[Outfit]">
              Learn
              <br />
              <span className="gradient-text">Smarter.</span>
              <br />
              <span className="text-white/90">Teach Better.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-slate-light leading-relaxed mb-10 max-w-lg animate-fade-up delay-200">
              Nexora brings together AI tutoring, real-time collaboration, and
              smart analytics — so students learn faster and teachers spend less
              time on admin.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-14 animate-fade-up delay-300">
              <Link
                to="/signup"
                className="btn-primary px-8 py-3.5 rounded-xl text-sm font-bold text-white inline-flex items-center justify-center gap-2"
              >
                Get Started Free
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <a
                href="#features"
                className="btn-secondary px-8 py-3.5 rounded-xl text-sm font-semibold text-slate border border-white/10 inline-flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Watch Demo
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 flex-col sm:flex-row animate-fade-up delay-400">
              <div className="flex -space-x-2.5">
                {[
                  { label: "RF", from: "from-violet", to: "to-violet-light" },
                  { label: "SK", from: "from-teal", to: "to-teal-light" },
                  { label: "TM", from: "from-coral", to: "to-coral-light" },
                  { label: "+3", from: "from-violet/60", to: "to-teal/60" },
                ].map(({ label, from, to }) => (
                  <div
                    key={label}
                    className={`w-8 h-8 rounded-full border-2 border-navy bg-linear-to-br ${from} ${to} flex items-center justify-center text-[10px] font-bold text-white`}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  2,400+ learners
                </div>
                <div className="text-xs text-slate">already on Nexora</div>
              </div>
              <div className="h-5 w-px bg-white/10 hidden sm:block"></div>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-3.5 h-3.5 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-slate font-mono">4.9/5</span>
              </div>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="relative hidden lg:flex items-center justify-center animate-fade-up delay-300">
            <div className="glow-orb w-72 h-72 bg-violet/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <img
              className="relative w-full object-contain max-w-lg drop-shadow-2xl"
              src={imgLink}
              alt="heroImg"
            />
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 inset-x-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16"
        >
          <path
            d="M0 80L60 68C120 56 240 32 360 24C480 16 600 24 720 32C840 40 960 48 1080 44C1200 40 1320 24 1380 16L1440 8V80H0Z"
            fill="#0d1225"
          />
        </svg>
      </div>
    </section>
  );
}

export default HeroSection;
