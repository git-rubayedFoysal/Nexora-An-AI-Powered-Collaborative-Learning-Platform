// Enrollment service — Supabase operations for enrollments table
import { supabase } from "../supabaseClient";
import authService from "../auth/auth.service";
import { COURSE_PAGE_SIZE } from "../../../constants/pagination";
class EnrollService {
  /**
   * Enroll in a course — checks for duplicates, then inserts.
   */
  async enrollCourse(courseId) {
    const user = await authService.getUser();

    if (!user) {
      throw new Error("User not found.");
    }

    // Guard: check if already enrolled to prevent duplicate (student_id, course_id) rows
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id")
      .eq("student_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (existing) {
      throw new Error("You are already enrolled in this course.");
    }

    // Insert new enrollment
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

  /**
   * Unenroll from a course — deletes the enrollment row.
   */
  async unenrollCourse(courseId) {
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

  /**
   * Get enrollment for a specific course — returns null if not enrolled.
   */
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

  /**
   * Get student's enrolled courses (paginated, deduplicated).
   * Joins course data and instructor info.
   */
  async getMyEnrollments({ page = 1 }) {
    const user = await authService.getUser();

    if (!user) {
      throw new Error("User not found.");
    }

    // Build query with course and instructor joins
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

    // Calculate pagination range
    const from = (page - 1) * COURSE_PAGE_SIZE;
    const to = from + COURSE_PAGE_SIZE - 1;

    // Execute query with ordering and pagination
    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Deduplicate by course_id — keeps only the first enrollment per course
    // This is a safety net against stale duplicate rows in the database
    const unique = (data || []).reduce((acc, curr) => {
      if (!acc.some((e) => e.course_id === curr.course_id)) acc.push(curr);
      return acc;
    }, []);

    return {
      courses: unique,
      total: count,
    };
  }

  /**
   * Get all students enrolled in a course (teacher/admin view).
   */
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

  /**
   * Update progress — auto-sets "completed" when >= 100.
   */
  async updateProgress(courseId, progress) {
    const user = await authService.getUser();

    if (!user) {
      throw new Error("User not found.");
    }

    // Auto-derive status from progress percentage
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
      .maybeSingle();

    if (error) throw error;

    return data;
  }
}

const enrollService = new EnrollService();
export default enrollService;
