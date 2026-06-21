import { supabase } from "./supabaseClient";

class AuthService {
  // register a new user with email and password
  async signUp(email, password, fullName, role) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        // Pass additional user metadata (full name and role) during sign-up
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (error) throw error;

      const user = data?.user;

      if (!user) {
        throw new Error("User registration failed");
      }

      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.id,
          email: user.email,
          full_name: fullName,
          role,
        },
      ]);

      if (insertError) throw insertError;

      return data;
    } catch (error) {
      console.error("SignUp Error:", error.message);
      throw error;
    }
  }

  // sign in an existing user with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }

  // sign out the current user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      return false;
    }
  }

  // Get the current authenticated user's session
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      console.log("Current session:", data.session);
      return data.session;
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  }

  // Get the current authenticated user's details
  async getUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  }
  // Get the current authenticated user's details from the "users" table
  async getCurrentUserDetails() {
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        return null;
      }

      const userId = sessionData.session.user.id;

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;
      return profileData;
    } catch (error) {
      console.error("Error getting user details:", error);
      return null;
    }
  }

  // Listen for authentication state changes (e.g., sign in, sign out)
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}

const authService = new AuthService();
export default authService;
