import { Header } from "./components/index";
import authService from "./services/supabase/auth.service";
import { useDispatch } from "react-redux";
import {
  login as storeLogin,
  logout as storeLogout,
  setLoading,
} from "./features/auth/authSlice";
import { useEffect } from "react";
import { Outlet } from "react-router";
function App() {
  const dispatch = useDispatch();
  // Check for existing session on app load and set up auth state accordingly
  useEffect(() => {
    const initAuth = async () => {
      dispatch(setLoading(true));

      try {
        const session = await authService.getSession();

        if (!session?.user) {
          dispatch(storeLogout());
          dispatch(setLoading(false));
          return;
        }
        dispatch(storeLogin(session.user));
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);
  // Set up a listener for auth state changes (e.g., sign in, sign out) to keep Redux store in sync
  useEffect(() => {
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        dispatch(storeLogout());
        return;
      }

      dispatch(storeLogin(session.user));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Header />
      {/* <Container> */}
      <Outlet />
      {/* </Container> */}
    </>
  );
}

export default App;
