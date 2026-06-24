import { Logo } from "../index";

function Footer() {
  return (
    <footer className="bg-navy-2 border-t border-white/5 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top footer */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <Logo />
            </div>
            <p className="text-sm text-slate leading-relaxed mb-6 max-w-xs">
              AI-powered collaborative learning platform for universities. Built
              with React, Supabase, and Gemini.
            </p>

            {/* Social */}
            <div className="flex items-center gap-2">
              {[
                {
                  title: "GitHub",
                  path: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z",
                },
                {
                  title: "Twitter/X",
                  path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
                },
                {
                  title: "LinkedIn",
                  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                },
                {
                  title: "YouTube",
                  path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
                },
              ].map(({ title, path }) => (
                <a
                  key={title}
                  href="#"
                  title={title}
                  className="social-icon text-slate w-9 h-9 rounded-lg glass border border-white/8 flex items-center justify-center hover:border-violet/40"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            {
              heading: "Platform",
              links: [
                "Features",
                "Courses",
                "AI Tutor",
                "Whiteboard",
                "Analytics",
              ],
              hrefs: ["#features", "#courses", "#", "#", "#"],
            },
            {
              heading: "Roles",
              links: [
                "For Students",
                "For Teachers",
                "For Admins",
                "University Plans",
              ],
              hrefs: ["#", "#", "#", "#"],
            },
            {
              heading: "Company",
              links: [
                "About",
                "Blog",
                "Privacy Policy",
                "Terms of Service",
                "Contact",
              ],
              hrefs: ["#", "#", "#", "#", "#"],
            },
          ].map(({ heading, links, hrefs }) => (
            <div key={heading}>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.18em] mb-5 font-mono">
                {heading}
              </p>
              <ul className="space-y-3">
                {links.map((label, i) => (
                  <li key={label}>
                    <a
                      href={hrefs[i]}
                      className="text-sm text-slate hover:text-white transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-center sm:text-left text-slate">
            © {new Date().getFullYear()} NexoraLMS. Designed and Developed by
            <span className="text-violet-light"> Team Nexora.</span>
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate/50">
            <span>Built with</span>
            {["React", "Supabase", "Gemini AI"].map((tech, i, arr) => (
              <span key={tech} className="flex items-center gap-1.5">
                <span className="text-white/70 font-medium">{tech}</span>
                {i < arr.length - 1 && <span className="text-white/20">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
