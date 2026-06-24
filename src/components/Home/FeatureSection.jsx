function FeatureSection() {
  const featuresData = [
    {
      title: "AI Tutor",
      icon: "🤖",
      description:
        "Course-aware chatbot powered by Gemini. Ask anything — get answers grounded in your actual course context.",
      tech: "Gemini API",
    },
    {
      title: "Real-time Chat",
      icon: "💬",
      description:
        "Per-course chat rooms with live updates. Message history, unread indicators, and instant delivery via Supabase Realtime.",
      tech: "Supabase Realtime",
    },
    {
      title: "Smart Quizzes",
      icon: "❓",
      description:
        "Timed MCQ & True/False quizzes with server-side auto-grading. Scores, history, and detailed result tracking built-in.",
      tech: "Auto Grading",
    },
    {
      title: "Live Whiteboard",
      icon: "🎨",
      description:
        "Multi-user collaborative drawing powered by tldraw. Teacher controls with real-time student sync — no lag, no friction.",
      tech: "tldraw + Realtime",
    },
    {
      title: "Analytics Dashboard",
      icon: "📊",
      description:
        "Student progress, teacher class stats, admin platform metrics — all in Recharts-powered dashboards with real data.",
      tech: "Recharts",
    },
    {
      title: "File Submissions",
      icon: "📤",
      description:
        "Secure PDF, DOC, and image uploads. Late detection is automatic. Teachers grade directly with feedback in one view.",
      tech: "Supabase Storage",
    },
  ];
  return (
    <section id="features" className="bg-navy-2 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <!-- Header --> */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet/25 mb-5">
            <span className="text-xs font-semibold text-violet-light font-mono tracking-wider">
              PLATFORM FEATURES
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black mb-4 font-[Outfit]">
            Everything you need
            <br />
            <span className="gradient-text">in one place</span>
          </h2>
          <p className="text-slate-light max-w-xl mx-auto leading-relaxed">
            Built for the modern learner — from AI-powered tutoring to real-time
            collaboration tools.
          </p>
        </div>

        {/* <!-- Feature cards --> */}
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* <!-- AI Tutor --> */}
          {featuresData.map((item) => (
            <>
              <div class="feature-card glass rounded-2xl p-6 border border-white/6 cursor-default">
                <div class="w-12 h-12 rounded-xl bg-violet/20 flex items-center justify-center text-2xl mb-5 border border-violet/20">
                  {item.icon}
                </div>
                <h3 class="text-lg font-bold text-white mb-2 font-[Outfit]">
                  {item.title}
                </h3>
                <p class="text-sm text-slate leading-relaxed mb-4">
                  {item.description}
                </p>
                <span class="tag bg-violet/15 text-violet-light border border-violet/20">
                  {item.tech}
                </span>
              </div>
            </>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
