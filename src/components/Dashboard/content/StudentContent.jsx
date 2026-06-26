function StudentContent({ role, user }) {
  return (
    <>
      {/* Greeting */}
      <div className="mb-7">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "'Outfit',sans-serif" }}
        >
          Good morning, <span className="gradient-text">{user}</span> 👋
        </h1>

        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal/10 text-teal border animate-pulse-teal border-teal/25 font-mono">
          ● {role.toUpperCase()}
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          {
            icon: "📚",
            value: "4",
            label: "Enrolled courses",
            sub: "↑ 1 this month",
            subColor: "text-emerald-400",
            valueColor: "text-teal",
          },
          {
            icon: "✅",
            value: "78%",
            label: "Assignment rate",
            sub: "↑ 5% vs last week",
            subColor: "text-emerald-400",
            valueColor: "text-violet-light",
          },
          {
            icon: "📊",
            value: "84",
            label: "Quiz avg score",
            sub: "↑ 3 pts this week",
            subColor: "text-emerald-400",
            valueColor: "text-amber",
          },
          {
            icon: "🎥",
            value: "62%",
            label: "Lecture progress",
            sub: "12 lectures watched",
            subColor: "text-slate-dark",
            valueColor: "text-coral",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="stat-card glass rounded-2xl p-5 border border-white/6"
          >
            <div className="text-2xl mb-3">{card.icon}</div>
            <div
              className={`text-3xl font-black mb-1 font-mono ${card.valueColor}`}
            >
              {card.value}
            </div>
            <div className="text-xs text-slate font-medium">{card.label}</div>
            <div className={`text-[11px] mt-1 ${card.subColor}`}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[
          { icon: "🤖", label: "Ask AI Tutor" },
          { icon: "📤", label: "Submit Assignment" },
          { icon: "❓", label: "Start Quiz" },
          { icon: "💬", label: "Open Chat" },
        ].map((a) => (
          <button
            key={a.label}
            className="feature-card glass rounded-2xl p-4 text-center border border-white/6 cursor-pointer"
          >
            <div className="text-2xl mb-2">{a.icon}</div>
            <div className="text-xs font-semibold text-slate">{a.label}</div>
          </button>
        ))}
      </div>

      {/* Courses + right column */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">My Courses</h2>
            <span className="text-xs text-violet-light cursor-pointer hover:text-violet transition-colors">
              View all →
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: "🧠",
                title: "Machine Learning",
                sub: "Dr. Karim · 12 lec",
                pct: 68,
                color: "bg-teal",
                bg: "rgba(15,191,138,.15),rgba(15,191,138,.05)",
              },
              {
                icon: "⚙️",
                title: "Data Structures",
                sub: "Prof. Nasrin · 18 lec",
                pct: 45,
                color: "#7c5af7",
                bg: "rgba(124,90,247,.15),rgba(124,90,247,.05)",
              },
              {
                icon: "🌐",
                title: "Web Development",
                sub: "Dr. Hasan · 20 lec",
                pct: 82,
                color: "bg-amber",
                bg: "rgba(245,166,35,.15),rgba(245,166,35,.05)",
              },
              {
                icon: "🗄️",
                title: "Database Systems",
                sub: "Prof. Rina · 14 lec",
                pct: 30,
                color: "bg-coral",
                bg: "rgba(240,90,90,.15),rgba(240,90,90,.05)",
              },
            ].map((course) => (
              <div
                key={course.title}
                className="course-card glass rounded-2xl overflow-hidden border border-white/6"
              >
                <div
                  className="h-20 flex items-center justify-center text-3xl"
                  style={{ background: `linear-gradient(135deg,${course.bg})` }}
                >
                  {course.icon}
                </div>
                <div className="p-3.5">
                  <div className="text-xs font-bold text-white mb-0.5">
                    {course.title}
                  </div>
                  <div className="text-[10px] text-slate mb-2">
                    {course.sub}
                  </div>
                  <div className="prog mb-1">
                    <div
                      className={`prog-fill ${course.color.startsWith("bg-") ? course.color : ""}`}
                      style={{
                        width: `${course.pct}%`,
                        ...(course.color.startsWith("#")
                          ? { background: course.color }
                          : {}),
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-slate font-mono">
                    {course.pct}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-4">
          {/* Due Soon */}
          <div className="glass rounded-2xl p-5 border border-white/6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold">Due Soon</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-coral/15 text-coral font-semibold">
                2 pending
              </span>
            </div>
            <div>
              {[
                {
                  icon: "📝",
                  title: "ML Assignment #3 — Regression",
                  sub: "Machine Learning Basics",
                  badge: "2d left",
                  badgeClass: "bg-coral/15 text-coral",
                },
                {
                  icon: "📝",
                  title: "Binary Tree Implementation",
                  sub: "Data Structures",
                  badge: "5d left",
                  badgeClass: "bg-amber/15 text-amber",
                },
                {
                  icon: "📝",
                  title: "REST API Project",
                  sub: "Web Development",
                  badge: "8d left",
                  badgeClass: "bg-teal/15 text-teal",
                },
              ].map((item, i, arr) => (
                <div
                  key={item.title}
                  className={`flex items-center gap-3 py-2.5 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center text-sm shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate">{item.sub}</div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${item.badgeClass}`}
                  >
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="glass rounded-2xl p-5 border border-white/6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold">Notifications</h2>
              <span className="text-xs text-violet-light cursor-pointer">
                All →
              </span>
            </div>
            <div>
              {[
                {
                  dot: "bg-teal",
                  text: (
                    <>
                      Quiz published:{" "}
                      <span className="text-white font-medium">
                        ML Mid-term Quiz
                      </span>
                    </>
                  ),
                  time: "2 min ago",
                },
                {
                  dot: "bg-amber",
                  text: (
                    <>
                      Grade posted:{" "}
                      <span className="text-white font-medium">88/100</span> on
                      Assignment #2
                    </>
                  ),
                  time: "1 hr ago",
                },
                {
                  dot: "bg-violet",
                  text: (
                    <>
                      New message in{" "}
                      <span className="text-white font-medium">
                        Web Dev Chat
                      </span>
                    </>
                  ),
                  time: "3 hr ago",
                },
              ].map((n, i, arr) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 py-2.5 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${n.dot} mt-1.5 shrink-0`}
                  />
                  <div>
                    <div className="text-xs text-slate leading-relaxed">
                      {n.text}
                    </div>
                    <div className="text-[10px] text-slate-dark font-mono mt-0.5">
                      {n.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz performance chart */}
      <div className="glass rounded-2xl p-5 border border-white/6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold">Quiz Performance</h2>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-teal/10 text-teal font-semibold border border-teal/20">
            Last 7 quizzes
          </span>
        </div>
        <div className="flex items-end gap-2 h-24">
          {[
            {
              h: "55%",
              style: { opacity: 0.8, background: undefined },
              cls: "bg-teal/40",
            },
            {
              h: "72%",
              style: { opacity: 0.85, background: undefined },
              cls: "bg-teal/50",
            },
            {
              h: "60%",
              style: { opacity: 0.8, background: undefined },
              cls: "bg-teal/45",
            },
            {
              h: "88%",
              style: { opacity: 0.9, background: undefined },
              cls: "bg-teal/60",
            },
            {
              h: "78%",
              style: { opacity: 0.85, background: undefined },
              cls: "bg-teal/55",
            },
            {
              h: "65%",
              style: { opacity: 0.8, background: undefined },
              cls: "bg-teal/45",
            },
            {
              h: "95%",
              style: {
                opacity: 1,
                background: "linear-gradient(180deg,#7c5af7,#0fbf8a)",
              },
              cls: "",
            },
          ].map((bar, i) => (
            <div
              key={i}
              className={`bar flex-1 ${bar.cls}`}
              style={{ height: bar.h, ...bar.style }}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          {["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"].map((q) => (
            <div
              key={q}
              className="flex-1 text-center text-[9px] text-slate-dark font-mono"
            >
              {q}
            </div>
          ))}
          <div className="flex-1 text-center text-[9px] text-teal font-mono font-medium">
            Q7
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentContent;
