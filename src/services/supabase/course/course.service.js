import { supabase } from "../supabaseClient";
import authService from "../auth/auth.service";
import { COURSE_PAGE_SIZE } from "../../../constants/pagination";

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
  async getPublishedCourses({ page = 1, search = "" }) {
    let query = supabase
      .from("courses")
      .select(
        `*, users (
                full_name,
                email,
                role
                  )`,
        { count: "exact" },
      )
      .eq("status", "published");

    // search filter
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`,
      );
    }

    // pagination
    const from = (page - 1) * COURSE_PAGE_SIZE;
    const to = from + COURSE_PAGE_SIZE - 1;

    const { data, error, count } = await query
      .order("created_at", {
        ascending: false,
      })
      .range(from, to);

    if (error) throw error;

    return {
      courses: data,
      total: count,
    };
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
  async getTeacherCourses({ page = 1, search = "" }) {
    const user = await authService.getUser();

    if (!user) {
      throw new Error("User not found.");
    }

    let query = supabase
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
        { count: "exact" },
      )
      .eq("teacher_id", user.id);

    // search filter
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`,
      );
    }

    // pagination
    const from = (page - 1) * COURSE_PAGE_SIZE;
    const to = from + COURSE_PAGE_SIZE - 1;

    const { data, error, count } = await query
      .order("created_at", {
        ascending: false,
      })
      .range(from, to);

    if (error) throw error;

    return {
      courses: data,
      total: count,
    };
  }

  // Get all courses (for admin)
  async getAllCourses({ page = 1, search = "" }) {
    let query = supabase.from("courses").select(
      `
      *,
      users (
        full_name,
        email,
        role
      )
    `,
      { count: "exact" },
    );

    // search filter
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`,
      );
    }

    // pagination
    const from = (page - 1) * COURSE_PAGE_SIZE;
    const to = from + COURSE_PAGE_SIZE - 1;

    const { data, error, count } = await query
      .order("created_at", {
        ascending: false,
      })
      .range(from, to);

    if (error) throw error;

    return {
      courses: data,
      total: count,
    };
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

  // Get featured courses (for homepage)
  async getFeaturedCourses() {
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
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) throw error;

    return data;
  }
}

const courseService = new CourseService();

export default courseService;
