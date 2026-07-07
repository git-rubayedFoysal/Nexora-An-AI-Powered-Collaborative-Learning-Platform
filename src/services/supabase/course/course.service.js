import { supabase } from "../supabaseClient";
import authService from "../auth/auth.service";

class CourseService {
  // Create course
  async createCourse(courseData) {
    const user = await authService.getUser();

    if (!user) {
      throw new Error("User not found.");
    }

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
      .select(
        `*, users (
                full_name,
                email,
                role
                  )`,
      )
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  }

  // Get course by ID
  async getCourseById(courseId) {
    const { data, error } = await supabase
      .from("courses")
      .select(
        `
      *,
      users (
        full_name,
        role
      )
    `,
      )
      .eq("id", courseId)
      .single();

    if (error) throw error;

    return data;
  }

  // Get courses created by current teacher
  async getTeacherCourses() {
    const user = await authService.getUser();

    if (!user) {
      throw new Error("User not found.");
    }

    const { data, error } = await supabase
      .from("courses")
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
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  }

  // Get all courses (for admin)
  async getAllCourses() {
    const { data, error } = await supabase
      .from("courses")
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
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  }
  // Get course statistics
  async getCourseStats() {
    const { data, error } = await supabase.from("courses").select("status");

    if (error) throw error;

    return {
      totalCourses: data.length,
      publishedCourses: data.filter((course) => course.status === "published")
        .length,
      draftCourses: data.filter((course) => course.status === "draft").length,
      archivedCourses: data.filter((course) => course.status === "archived")
        .length,
    };
  }
}

const courseService = new CourseService();

export default courseService;
