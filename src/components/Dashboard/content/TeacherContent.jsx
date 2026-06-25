function TeacherContent({ role, user }) {
  return (
    <>
      <div className="mb-7">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "'Outfit',sans-serif" }}
        >
          Good morning, <span className="gradient-text">{user}</span> 📋
        </h1>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass bg-amber/10 text-amber border border-amber/25 mb-8 animate-pulse-amber font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse"></span>
          <span className="text-[11px] font-bold text-amber font-mono tracking-[0.15em]">
            {role.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          {
            icon: "📚",
            value: "3",
            label: "Active courses",
            sub: "87 students enrolled",
            subColor: "text-slate-dark",
            valueColor: "text-amber",
          },
          {
            icon: "📋",
            value: "8",
            label: "Ungraded submissions",
            sub: "across 3 courses",
            subColor: "text-slate-dark",
            valueColor: "text-coral",
          },
          {
            icon: "📊",
            value: "76%",
            label: "Class quiz avg",
            sub: "↑ 4% this week",
            subColor: "text-emerald-400",
            valueColor: "text-violet-light",
          },
          {
            icon: "✅",
            value: "91%",
            label: "Submission rate",
            sub: "↑ 2% vs last assign",
            subColor: "text-emerald-400",
            valueColor: "text-teal",
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
          { icon: "➕", label: "New Course" },
          { icon: "📝", label: "New Assignment" },
          { icon: "❓", label: "Build Quiz" },
          { icon: "🎨", label: "Whiteboard" },
        ].map((a) => (
          <button
            key={a.label}
            className="feature-card glass rounded-2xl p-4 text-center border border-white/6"
          >
            <div className="text-2xl mb-2">{a.icon}</div>
            <div className="text-xs font-semibold text-slate">{a.label}</div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Grade Center */}
        <div className="glass rounded-2xl p-5 border border-white/6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">Grade Center</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-coral/15 text-coral font-semibold">
              8 pending
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  {["Student", "Assignment", "Status"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-dark border-b border-white/6"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { student: "Arif H.", assign: "ML Assign #3", graded: false },
                  {
                    student: "Nadia R.",
                    assign: "Binary Tree Lab",
                    graded: false,
                  },
                  {
                    student: "Kamal S.",
                    assign: "ML Assign #3",
                    graded: false,
                  },
                  {
                    student: "Sadia K.",
                    assign: "REST API Project",
                    graded: true,
                  },
                  {
                    student: "Tanvir M.",
                    assign: "Binary Tree Lab",
                    graded: true,
                  },
                ].map((row, i, arr) => (
                  <tr key={i} className="nx-tr">
                    <td
                      className={`py-2.5 px-3 text-slate ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                    >
                      {row.student}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-slate truncate max-w-25 ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                    >
                      {row.assign}
                    </td>
                    <td
                      className={`py-2.5 px-3 ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                    >
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.graded ? "bg-teal/15 text-teal" : "bg-amber/15 text-amber"}`}
                      >
                        {row.graded ? "Graded" : "Ungraded"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-4">
          {/* Course Performance */}
          <div className="glass rounded-2xl p-5 border border-white/6">
            <h2 className="text-sm font-bold mb-4">Course Performance</h2>
            {[
              {
                icon: "🧠",
                name: "Machine Learning",
                pct: 78,
                color: "bg-amber",
                textColor: "text-amber",
                students: 32,
              },
              {
                icon: "⚙️",
                name: "Data Structures",
                pct: 72,
                color: "",
                textColor: "text-violet-light",
                students: 28,
                fillStyle: { background: "#7c5af7" },
              },
              {
                icon: "🌐",
                name: "Web Development",
                pct: 81,
                color: "bg-teal",
                textColor: "text-teal",
                students: 27,
              },
            ].map((c, i, arr) => (
              <div
                key={c.name}
                className={`flex items-center gap-3 py-2.5 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
              >
                <div className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center text-sm shrink-0">
                  {c.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white font-medium">{c.name}</span>
                    <span className={`${c.textColor} font-mono`}>{c.pct}%</span>
                  </div>
                  <div className="prog">
                    <div
                      className={`prog-fill ${c.color}`}
                      style={{ width: `${c.pct}%`, ...(c.fillStyle ?? {}) }}
                    />
                  </div>
                  <div className="text-[10px] text-slate mt-0.5">
                    {c.students} students
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="glass rounded-2xl p-5 border border-white/6">
            <h2 className="text-sm font-bold mb-4">Recent Activity</h2>
            {[
              {
                dot: "bg-amber",
                text: (
                  <>
                    <span className="text-white font-medium">Arif H.</span>{" "}
                    submitted ML Assignment #3
                  </>
                ),
                time: "2 hr ago",
              },
              {
                dot: "bg-violet",
                text: (
                  <>
                    <span className="text-white font-medium">5 students</span>{" "}
                    completed Mid-term Quiz
                  </>
                ),
                time: "4 hr ago",
              },
              {
                dot: "bg-teal",
                text: (
                  <>
                    New message in{" "}
                    <span className="text-white font-medium">
                      ML Basics Chat
                    </span>
                  </>
                ),
                time: "6 hr ago",
              },
            ].map((n, i, arr) => (
              <div
                key={i}
                className={`flex items-start gap-2.5 py-2 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${n.dot} mt-1.5 shrink-0`}
                />
                <div>
                  <div className="text-xs text-slate">{n.text}</div>
                  <div className="text-[10px] text-slate-dark font-mono mt-0.5">
                    {n.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Ranking */}
      <div className="glass rounded-2xl p-5 border border-white/6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold">
            Student Ranking — Machine Learning Basics
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber/15 text-amber font-semibold">
            Top 5
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                {[
                  "#",
                  "Student",
                  "Assignments",
                  "Quizzes",
                  "Total",
                  "Grade",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-dark border-b border-white/6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  rank: "01",
                  name: "Sadia Khanam",
                  assign: "96/100",
                  quiz: "88/100",
                  total: 184,
                  grade: "A+",
                  gradeClass: "bg-teal/15 text-teal",
                  rankClass: "text-amber",
                },
                {
                  rank: "02",
                  name: "Tanvir Mahmud",
                  assign: "90/100",
                  quiz: "85/100",
                  total: 175,
                  grade: "A",
                  gradeClass: "bg-teal/15 text-teal",
                  rankClass: "text-slate",
                },
                {
                  rank: "03",
                  name: "Nadia Rahman",
                  assign: "88/100",
                  quiz: "80/100",
                  total: 168,
                  grade: "A−",
                  gradeClass: "bg-violet/15 text-violet-light",
                  rankClass: "text-slate",
                },
                {
                  rank: "04",
                  name: "Arif Hossain",
                  assign: "82/100",
                  quiz: "78/100",
                  total: 160,
                  grade: "B+",
                  gradeClass: "bg-violet/15 text-violet-light",
                  rankClass: "text-slate",
                },
                {
                  rank: "05",
                  name: "Kamal Sarkar",
                  assign: "75/100",
                  quiz: "72/100",
                  total: 147,
                  grade: "B",
                  gradeClass: "bg-white/[.06] text-slate",
                  rankClass: "text-slate",
                },
              ].map((row, i, arr) => (
                <tr key={i} className="nx-tr">
                  <td
                    className={`py-2.5 px-3 font-bold font-mono ${row.rankClass} ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                  >
                    {row.rank}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-white font-medium ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                  >
                    {row.name}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-slate font-mono ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                  >
                    {row.assign}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-slate font-mono ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                  >
                    {row.quiz}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-white font-bold font-mono ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                  >
                    {row.total}
                  </td>
                  <td
                    className={`py-2.5 px-3 ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                  >
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.gradeClass}`}
                    >
                      {row.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default TeacherContent;
