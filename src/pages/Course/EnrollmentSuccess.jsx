import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

function EnrollmentSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // If someone lands here directly with no state, send them to courses
  useEffect(() => {
    if (!state?.courseId) navigate("/courses", { replace: true });
  }, [state, navigate]);

  if (!state?.courseId) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="relative z-10 w-full max-w-md text-center">
        <div
          className="glass rounded-3xl border border-border p-8 sm:p-10
                        shadow-[0_32px_80px_rgba(0,0,0,.45)]"
        >
          {/* Success icon */}
          <div
            className="inline-flex items-center justify-center w-20 h-20
                          rounded-2xl bg-teal-dim border border-teal/25 mb-6 mx-auto
                          animate-pulse-teal"
          >
            <svg
              className="w-10 h-10 text-teal"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold mb-2 font-display">
            You're <span className="gradient-text">enrolled!</span>
          </h1>
          <p className="text-sm text-slate leading-relaxed mb-1">Welcome to</p>
          <p className="text-base font-semibold text-white mb-6 leading-snug">
            {state.courseTitle}
          </p>

          {/* Divider */}
          <div className="border-t border-border mb-6" />

          {/* What's next */}
          <ul className="space-y-3 text-left mb-8">
            {[
              { icon: "🎥", text: "Watch lessons at your own pace" },
              {
                icon: "📝",
                text: "Complete assignments to reinforce learning",
              },
              { icon: "🏆", text: "Earn a certificate when you finish" },
            ].map((item) => (
              <li
                key={item.text}
                className="flex items-center gap-3 text-sm text-slate"
              >
                <span className="text-lg leading-none">{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard/my-learning")}
              className="btn-primary w-full py-3 rounded-xl text-sm font-semibold text-white
                         inline-flex items-center justify-center gap-2"
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
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Start Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnrollmentSuccess;
