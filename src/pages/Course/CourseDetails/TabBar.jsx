/**
 * TabBar
 *
 * Horizontal tab bar with Overview, Curriculum, and optional Enrolled Students tabs.
 * Active tab gets highlighted styling. URL hash is updated on tab switch.
 *
 * Props:
 *  - tabs           — array of { id, label }
 *  - activeTab      — currently active tab ID
 *  - onSwitch       — callback to switch tabs
 *  - showEnrolledTab — whether to show the Enrolled Students tab
 *  - enrolledCount  — number of enrolled students (for badge)
 */

function TabBar({ tabs, activeTab, onSwitch, showEnrolledTab, enrolledCount }) {
  return (
    <div className="glass rounded-2xl border border-border p-1.5 flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSwitch(tab.id)}
          className={`nav-link flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold font-mono transition-colors ${activeTab === tab.id ? "text-white" : "text-slate hover:text-slate-light"}`}
        >
          {tab.label}
        </button>
      ))}
      {showEnrolledTab && (
        <button
          onClick={() => onSwitch("enrolled")}
          className={`nav-link flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold font-mono transition-colors whitespace-nowrap ${activeTab === "enrolled" ? "text-white" : "text-slate hover:text-slate-light"}`}
        >
          Enrolled Students{" "}
          <span className="ml-1 text-[10px] opacity-60">({enrolledCount})</span>
        </button>
      )}
    </div>
  );
}

export default TabBar;
