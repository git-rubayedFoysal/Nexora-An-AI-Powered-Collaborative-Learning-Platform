import { supabase } from "../supabaseClient";

// All auth-related operations (sign up, sign in, sign out, user info)
class AuthService {
  // Create a new account with email and password
  async signUp(email, password, fullName, role) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            full_name: fullName,
            role,
          },
        },
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("SignUp Error:", error.message);
      throw error;
    }
  }

  // Log in with email and password
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

  // Log out the current user
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

  // Get the current session (user + tokens)
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  }

  // Get the currently logged in user
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

  // Get the full user profile from the users table
  async getCurrentUserDetails() {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) return null;

      const userId = userData.user.id;

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        return null;
      }
      return profileData;
    } catch (error) {
      console.error("Error getting user details:", error);
      return null;
    }
  }

  // Listen for login/logout events
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  // Update the current user's profile in the users table
  async updateProfile({ fullName }) {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) throw new Error("Not authenticated");

      const userId = userData.user.id;

      const { data, error } = await supabase
        .from("users")
        .update({ full_name: fullName })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Update profile error:", error.message);
      throw error;
    }
  }

  // Get total user counts by role for the admin dashboard
  async getUserStats() {
    const { data, error } = await supabase.from("users").select("role");
    if (error) throw error;

    return {
      totalUsers: data.length,
      totalStudents: data.filter((user) => user.role === "student").length,
      totalTeachers: data.filter((user) => user.role === "teacher").length,
      totalAdmins: data.filter((user) => user.role === "admin").length,
    };
  }

  // Get all users (admin) with pagination, search, and role filter
  async getAllUsers({ page = 1, search = "", role = "" }) {
    let query = supabase
      .from("users")
      .select("*", { count: "exact" });

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (role && role !== "all") {
      query = query.eq("role", role);
    }

    const from = (page - 1) * 10;
    const to = from + 10 - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return { users: data, total: count };
  }

  // Update a user's role (admin only)
  async updateUserRole({ userId, role }) {
    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

const authService = new AuthService();
export default authService;
