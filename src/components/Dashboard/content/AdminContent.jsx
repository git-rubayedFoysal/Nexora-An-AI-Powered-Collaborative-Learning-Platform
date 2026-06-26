function AdminContent({ role }) {
  return (
    <>
      <div className="mb-7">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "'Outfit',sans-serif" }}
        >
          Platform Overview <span className="gradient-text">⚙️</span>
        </h1>
        <span class="animate-pulse-coral inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-coral/10 text-coral border border-coral/25 font-mono">
          ● {role.toUpperCase()}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          {
            icon: "👥",
            value: "248",
            label: "Total users",
            sub: "↑ 12 this week",
            subColor: "text-emerald-400",
            valueColor: "text-coral",
          },
          {
            icon: "📚",
            value: "12",
            label: "Active courses",
            sub: "↑ 2 published",
            subColor: "text-emerald-400",
            valueColor: "text-amber",
          },
          {
            icon: "📋",
            value: "614",
            label: "Total enrollments",
            sub: "↑ 34 this week",
            subColor: "text-emerald-400",
            valueColor: "text-violet-light",
          },
          {
            icon: "📊",
            value: "79%",
            label: "Platform avg score",
            sub: "↑ 3% vs last month",
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
          { icon: "➕", label: "Add User" },
          { icon: "🔑", label: "Assign Role" },
          { icon: "📚", label: "Manage Courses" },
          { icon: "📋", label: "Audit Log" },
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
        {/* Users by Role */}
        <div className="glass rounded-2xl p-5 border border-white/6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold">Users by Role</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-coral/15 text-coral font-semibold">
              248 total
            </span>
          </div>
          <div className="space-y-4">
            {[
              {
                label: "🟢 Students",
                count: "208 · 83.9%",
                pct: 84,
                color: "bg-teal",
                textColor: "text-teal",
              },
              {
                label: "🟡 Teachers",
                count: "36 · 14.5%",
                pct: 14,
                color: "bg-amber",
                textColor: "text-amber",
              },
              {
                label: "🔴 Admins",
                count: "4 · 1.6%",
                pct: 2,
                color: "bg-coral",
                textColor: "text-coral",
              },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-xs mb-2">
                  <span className={`${row.textColor} font-semibold`}>
                    {row.label}
                  </span>
                  <span className="text-slate font-mono">{row.count}</span>
                </div>
                <div className="prog h-2">
                  <div
                    className={`prog-fill ${row.color}`}
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-bold mb-3">Recent Signups</h3>
            {[
              {
                initials: "FH",
                name: "Fahim Hossain",
                time: "1h ago",
                role: "Student",
                avatarClass: "from-teal to-teal-light",
                badgeClass: "bg-teal/15 text-teal",
              },
              {
                initials: "MR",
                name: "Dr. Mithila Roy",
                time: "3h ago",
                role: "Teacher",
                avatarClass: "from-amber to-yellow-600",
                badgeClass: "bg-amber/15 text-amber",
              },
              {
                initials: "RB",
                name: "Rania Begum",
                time: "5h ago",
                role: "Student",
                avatarClass: "from-violet to-violet-light",
                badgeClass: "bg-teal/15 text-teal",
              },
            ].map((u, i, arr) => (
              <div
                key={u.name}
                className={`flex items-center gap-3 py-2.5 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full bg-linear-to-br ${u.avatarClass} flex items-center justify-center text-[10px] font-bold text-white`}
                >
                  {u.initials}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-white">{u.name}</div>
                  <div className="text-[10px] text-slate">Joined {u.time}</div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${u.badgeClass}`}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div className="flex flex-col gap-4">
          {/* Top Courses */}
          <div className="glass rounded-2xl p-5 border border-white/6">
            <h2 className="text-sm font-bold mb-4">
              Top Courses by Enrollment
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    {["Course", "Teacher", "Enrolled", "Status"].map((h) => (
                      <th
                        key={h}
                        className={`py-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-dark border-b border-white/6 ${h === "Enrolled" ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "Web Development",
                      teacher: "Dr. Hasan",
                      enrolled: 87,
                      status: "Active",
                      statusClass: "bg-teal/15 text-teal",
                    },
                    {
                      name: "Machine Learning",
                      teacher: "Dr. Karim",
                      enrolled: 74,
                      status: "Active",
                      statusClass: "bg-teal/15 text-teal",
                    },
                    {
                      name: "Data Structures",
                      teacher: "Prof. Nasrin",
                      enrolled: 68,
                      status: "Active",
                      statusClass: "bg-teal/15 text-teal",
                    },
                    {
                      name: "Database Systems",
                      teacher: "Prof. Rina",
                      enrolled: 55,
                      status: "Active",
                      statusClass: "bg-teal/15 text-teal",
                    },
                    {
                      name: "OS Fundamentals",
                      teacher: "Dr. Ahmed",
                      enrolled: 40,
                      status: "Draft",
                      statusClass: "bg-amber/15 text-amber",
                    },
                  ].map((c, i, arr) => (
                    <tr key={c.name} className="nx-tr">
                      <td
                        className={`py-2 px-3 text-white font-medium ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                      >
                        {c.name}
                      </td>
                      <td
                        className={`py-2 px-3 text-slate ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                      >
                        {c.teacher}
                      </td>
                      <td
                        className={`py-2 px-3 text-right text-slate font-mono ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                      >
                        {c.enrolled}
                      </td>
                      <td
                        className={`py-2 px-3 ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                      >
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.statusClass}`}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Platform Activity chart */}
          <div className="glass rounded-2xl p-5 border border-white/6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold">Platform Activity</h2>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-violet/15 text-violet-light font-semibold border border-violet/20">
                Last 7 days
              </span>
            </div>
            <div className="flex items-end gap-2 h-24">
              {[
                { h: "50%", cls: "bg-coral/40", style: { opacity: 0.8 } },
                { h: "65%", cls: "bg-coral/50", style: { opacity: 0.85 } },
                { h: "80%", cls: "bg-coral/55", style: { opacity: 0.85 } },
                { h: "60%", cls: "bg-coral/45", style: { opacity: 0.8 } },
                { h: "90%", cls: "bg-coral/60", style: { opacity: 0.9 } },
                { h: "75%", cls: "bg-coral/50", style: { opacity: 0.85 } },
                {
                  h: "98%",
                  cls: "",
                  style: {
                    opacity: 1,
                    background: "linear-gradient(180deg,#7c5af7,#f05a5a)",
                  },
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
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="flex-1 text-center text-[9px] text-slate-dark font-mono"
                >
                  {d}
                </div>
              ))}
              <div className="flex-1 text-center text-[9px] text-coral font-mono font-medium">
                Sun
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Users table */}
      <div className="glass rounded-2xl p-5 border border-white/6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-bold">All Users</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search users…"
                className="nx-input pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white/5 border border-border text-white placeholder-slate-dark transition-all w-40"
              />
            </div>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-coral/15 text-coral border border-coral/25 hover:bg-coral/25 transition-colors">
              + Add user
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                {["Name", "Email", "Role", "Courses", "Joined", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left py-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-dark border-b border-white/6"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Rubayed Foysal",
                  email: "rubayed@rmu.ac.bd",
                  role: "Student",
                  roleClass: "bg-teal/15 text-teal",
                  courses: 4,
                  joined: "Jan 2024",
                  editable: true,
                },
                {
                  name: "Dr. Karim",
                  email: "karim@rmu.ac.bd",
                  role: "Teacher",
                  roleClass: "bg-amber/15 text-amber",
                  courses: 2,
                  joined: "Sep 2023",
                  editable: true,
                },
                {
                  name: "Prof. Nasrin",
                  email: "nasrin@rmu.ac.bd",
                  role: "Teacher",
                  roleClass: "bg-amber/15 text-amber",
                  courses: 1,
                  joined: "Sep 2023",
                  editable: true,
                },
                {
                  name: "Sadia Khanam",
                  email: "sadia@rmu.ac.bd",
                  role: "Student",
                  roleClass: "bg-teal/15 text-teal",
                  courses: 3,
                  joined: "Feb 2024",
                  editable: true,
                },
                {
                  name: "Admin User",
                  email: "admin@nexora.edu",
                  role: "Admin",
                  roleClass: "bg-coral/15 text-coral",
                  courses: null,
                  joined: "Jan 2023",
                  editable: false,
                },
              ].map((row, i, arr) => (
                <tr key={row.name} className="nx-tr">
                  <td
                    className={`py-2.5 px-3 text-white font-medium ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                  >
                    {row.name}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-slate ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                  >
                    {row.email}
                  </td>
                  <td
                    className={`py-2.5 px-3 ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                  >
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.roleClass}`}
                    >
                      {row.role}
                    </span>
                  </td>
                  <td
                    className={`py-2.5 px-3 text-slate font-mono ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                  >
                    {row.courses ?? "—"}
                  </td>
                  <td
                    className={`py-2.5 px-3 text-slate ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                  >
                    {row.joined}
                  </td>
                  <td
                    className={`py-2.5 px-3 ${i < arr.length - 1 ? "border-b border-white/4" : ""}`}
                  >
                    {row.editable ? (
                      <span className="text-violet-light text-[10px] cursor-pointer hover:text-violet transition-colors">
                        Edit
                      </span>
                    ) : (
                      <span className="text-slate-dark text-[10px]">—</span>
                    )}
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

export default AdminContent;
