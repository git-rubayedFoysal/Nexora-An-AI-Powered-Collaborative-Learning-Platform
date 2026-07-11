import { supabase } from "../supabaseClient";
import authService from "../auth/auth.service";
import { COURSE_PAGE_SIZE } from "../../../constants/pagination";

class EnrollService {
  // create course enrollment
  async enrollCourse(courseId) {
    // get current user
    const user = await authService.getUser();

    if (!user) {
      throw new Error("User not found.");
    }

    const { data, error } = await supabase
      .from("enrollments")
      .insert({
        course_id: courseId,
        student_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  // delete enrollment
  async unenrollCourse(courseId) {
    // get current user
    const user = await authService.getUser();

    if (!user) {
      throw new Error("User not found.");
    }

    const { error } = await supabase
      .from("enrollments")
      .delete()
      .eq("student_id", user.id)
      .eq("course_id", courseId);

    if (error) throw error;
    return true;
  }

  // Get current user's enrollment for a course
  async getEnrollment(courseId) {
    const user = await authService.getUser();

    if (!user) {
      throw new Error("User not found.");
    }

    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .eq("student_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  // Get all enrolled courses of the current student
  async getMyEnrollments({ page = 1 }) {
    const user = await authService.getUser();

    if (!user) {
      throw new Error("User not found.");
    }

    let query = supabase
      .from("enrollments")
      .select(
        `
      *,
      courses (
        *,
        users (
          full_name,
          email,
          role
        )
      )
    `,
        { count: "exact" },
      )
      .eq("student_id", user.id);

    // pagination
    const from = (page - 1) * COURSE_PAGE_SIZE;
    const to = from + COURSE_PAGE_SIZE - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      courses: data,
      total: count,
    };
  }
  // Get all enrollments under a course
  async getCourseEnrollments(courseId) {
    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
      *,
      users (
        full_name,
        email,
        role
      )
    `,
      )
      .eq("course_id", courseId)
      .order("enrolled_at", { ascending: false });

    if (error) throw error;

    return data;
  }
  // update course progress
  async updateProgress(courseId, progress) {
    const user = await authService.getUser();

    if (!user) {
      throw new Error("User not found.");
    }

    const status = progress >= 100 ? "completed" : "active";

    const { data, error } = await supabase
      .from("enrollments")
      .update({
        progress,
        status,
      })
      .eq("student_id", user.id)
      .eq("course_id", courseId)
      .select()
      .single();

    if (error) throw error;

    return data;
  }
}

const enrollService = new EnrollService();
export default enrollService;
