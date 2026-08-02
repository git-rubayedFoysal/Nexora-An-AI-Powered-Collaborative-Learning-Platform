// Dashboard layout — sidebar on the left, main content on the right
import { useState } from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { Sidebar, DashboardHeader } from "../components/index";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onMenuToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const user = useSelector((state) => state.auth.userData);
  const role = user?.role || "teacher";
  const name = user?.full_name || "user";

  return (
    <div className="min-h-screen bg-navy text-white flex">
      {/* Sidebar navigation */}
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 lg:ml-55">
        <DashboardHeader mobileOpen={sidebarOpen} onMenuToggle={onMenuToggle} />

        <main className="p-4 md:p-6" style={{ paddingTop: "85px" }}>
          <Outlet context={{ role, name }} />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
