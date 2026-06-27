import { Header } from "./components/index";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
function App() {
  const loading = useSelector((state) => state.auth.isLoading);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
