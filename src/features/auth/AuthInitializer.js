import { useEffect } from "react";
import { useDispatch } from "react-redux";
import authService from "../../services/supabase/auth/auth.service";
import { supabase } from "../../services/supabase/supabaseClient";
import {
  login as storeLogin,
  logout as storeLogout,
  setLoading,
} from "./authSlice";

// Runs once when the app loads to check if the user is logged in
// Also listens for login/logout events to keep Redux in sync
function AuthInitializer() {
  const dispatch = useDispatch();

  // Check for an existing session when the app first loads
  useEffect(() => {
    const initAuth = async () => {
      dispatch(setLoading(true));

      try {
        const session = await authService.getSession();

        if (!session?.user) {
          dispatch(storeLogout());
          return;
        }

        // Get the user's full profile from the users table
        const { data: profile, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        dispatch(storeLogin(profile));
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);

  // Listen for login, logout, and token refresh events
  useEffect(() => {
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        dispatch(storeLogout());
        return;
      }

      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      dispatch(storeLogin(profile));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return null;
}

export default AuthInitializer;
