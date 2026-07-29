import { supabase } from "../supabaseClient";
import authService from "../auth/auth.service";
import { COURSE_PAGE_SIZE } from "../../../constants/pagination";

/**
 * EnrollService
 *
 * Handles all Supabase operations for the enrollments table.
 * Each method gets the current authenticated user and operates on their behalf.
 *
 * Key behaviors:
 *  - enrollCourse checks for existing enrollment before inserting (prevents duplicates)
 *  - getMyEnrollments deduplicates by course_id as a safety net against stale data
 *  - getEnrollment uses maybeSingle() to return null instead of error when not found
 */
class EnrollService {
  /**
   * Enroll the current user in a course.
   * 1. Gets the authenticated user
   * 2. Checks if already enrolled (prevents duplicate rows)
   * 3. Inserts the enrollment row
   * 4. Returns the raw enrollment data (no courses join)
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
   * Remove the current user's enrollment from a course.
   * Deletes the row matching both student_id and course_id.
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
   * Get the current user's enrollment for a specific course.
   * Returns the enrollment row if found, null if not enrolled.
   * Uses maybeSingle() to avoid 406 errors when no row exists.
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
   * Get all courses the current student is enrolled in (paginated).
   *
   * Joins:
   *  - courses: full course data (title, thumbnail, price, etc.)
   *  - users: instructor info (full_name, email, role)
   *
   * Deduplication: filters by unique course_id to guard against
   * duplicate enrollment rows (stale data safety net).
   *
   * Returns: { courses: [...], total: number }
   */
  async getMyEnrollments({ page = 1 }) {
    const user = await authService.getUser();

    if (!user) {
      throw new Error("User not found.");
    }

    // Build query with courses + instructor joins
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
   * Get all students enrolled in a specific course (teacher/admin view).
   * Joins user data (full_name, email, role) for each enrollment.
   * Ordered by most recently enrolled first.
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
   * Update the progress and status for the current user's enrollment.
   * Automatically sets status to "completed" when progress >= 100,
   * otherwise "active".
   * Returns the updated enrollment row.
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
      .single();

    if (error) throw error;

    return data;
  }
}

const enrollService = new EnrollService();
export default enrollService;
