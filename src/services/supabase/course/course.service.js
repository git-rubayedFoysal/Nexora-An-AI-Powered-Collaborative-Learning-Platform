import { supabase } from "../supabaseClient";
import authService from "../auth/auth.service";
import { COURSE_PAGE_SIZE } from "../../../constants/pagination";

// Database operations for courses (create, read, update, delete)
class CourseService {
  // Save a new course to the database
  async createCourse(courseData) {
    const user = await authService.getUser();
    if (!user) throw new Error("User not found.");

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

  // Delete a course
  async deleteCourse(courseId) {
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);

    if (error) throw error;
    return true;
  }

  // Update a course
  async updateCourse(courseId, courseData) {
    const { data, error } = await supabase
      .from("courses")
      .update({ ...courseData })
      .eq("id", courseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get published courses for the catalog (with search and pagination)
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

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`,
      );
    }

    const from = (page - 1) * COURSE_PAGE_SIZE;
    const to = from + COURSE_PAGE_SIZE - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { courses: data, total: count };
  }

  // Get a single course by ID
  async getCourseById(courseId) {
    const { data, error } = await supabase
      .from("courses")
      .select(
        `*, users (
          full_name,
          role
        )`,
      )
      .eq("id", courseId)
      .single();

    if (error) throw error;
    return data;
  }

  // Get courses created by the current teacher
  async getTeacherCourses({ page = 1, search = "" }) {
    const user = await authService.getUser();
    if (!user) throw new Error("User not found.");

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
      .eq("teacher_id", user.id);

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`,
      );
    }

    const from = (page - 1) * COURSE_PAGE_SIZE;
    const to = from + COURSE_PAGE_SIZE - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { courses: data, total: count };
  }

  // Get all courses (admin only)
  async getAllCourses({ page = 1, search = "" }) {
    let query = supabase.from("courses").select(
      `*, users (
          full_name,
          email,
          role
        )`,
      { count: "exact" },
    );

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`,
      );
    }

    const from = (page - 1) * COURSE_PAGE_SIZE;
    const to = from + COURSE_PAGE_SIZE - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { courses: data, total: count };
  }

  // Get course counts by status for the admin dashboard
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

  // Get the latest published courses for the homepage
  async getFeaturedCourses() {
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
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) throw error;
    return data;
  }
  // Recalculate lesson_count and duration for a course from actual lesson data
  async updateCourseStats(courseId) {
    const { data: modules, error: modErr } = await supabase
      .from("modules")
      .select("id")
      .eq("course_id", courseId);

    if (modErr) throw modErr;

    const moduleIds = (modules || []).map((m) => m.id);

    let lessonCount = 0;
    let totalDuration = 0;

    if (moduleIds.length > 0) {
      const { data: lessons, error: lesErr } = await supabase
        .from("lessons")
        .select("duration")
        .in("module_id", moduleIds);

      if (lesErr) throw lesErr;

      lessonCount = lessons?.length || 0;
      totalDuration = (lessons || []).reduce(
        (sum, l) => sum + (l.duration || 0),
        0,
      );
    }

    const { data, error } = await supabase
      .from("courses")
      .update({ lesson_count: lessonCount, duration: totalDuration })
      .eq("id", courseId)
      .select()
      .single();

    if (error) throw error;

    return data;
  }
}

const courseService = new CourseService();

export default courseService;
