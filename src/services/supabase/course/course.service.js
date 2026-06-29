import { supabase } from "../supabaseClient";
import authService from "../auth/auth.service";

class CourseService {
  // Create course
  async createCourse(courseData) {
    const {
      data: { user },
      error: authError,
    } = await authService.getUser();

    if (authError) throw authError;

    const { data, error } = await supabase
      .from("courses")
      .insert({
        ...courseData,
        teacher_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  // Delete course
  async deleteCourse(courseId) {
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);

    if (error) throw error;

    return true;
  }

  // Update course
  async updateCourse(courseId, courseData) {
    const { data, error } = await supabase
      .from("courses")
      .update({
        ...courseData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", courseId)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  // Get all published courses
  async getPublishedCourses() {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  }

  // Get course by ID
  async getCourseById(courseId) {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (error) throw error;

    return data;
  }

  // Get courses created by current teacher
  async getTeacherCourses() {
    const {
      data: { user },
      error: authError,
    } = await authService.getUser();

    if (authError) throw authError;

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  }
}

const courseService = new CourseService();

export default courseService;
