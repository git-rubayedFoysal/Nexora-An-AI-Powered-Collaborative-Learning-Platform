import { supabase } from "../supabaseClient";
import authService from "../auth/auth.service";

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

  // Get all enorll course of a student's
  async getMyEnrollments() {
    const user = await authService.getUser();

    if (!user) {
      throw new Error("User not found.");
    }

    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .eq("student_id", user.id)
      .order("enrolled_at", { ascending: false });

    if (error) throw error;

    return data;
  }
  // Get all enrollments under a course
  async getCourseEnrollments(courseId) {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
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
