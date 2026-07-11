import { Header, LoadingState } from "./components/index";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
function App() {
  const loading = useSelector((state) => state.auth.isLoading);

  if (loading) {
    return <LoadingState color="--color-amber" />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
