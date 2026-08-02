import { supabase } from "../supabaseClient";

class LessonProgressService {
  /**
   * Mark a lesson as completed.
   * Creates a new progress record if it doesn't exist,
   * otherwise updates the existing one.
   */
  async markLessonComplete({ studentId, lessonId }) {
    const { data, error } = await supabase
      .from("lesson_progress")
      .upsert(
        {
          student_id: studentId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: "student_id,lesson_id",
        },
      )
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  /**
   * Mark a lesson as incomplete.
   */
  async markLessonIncomplete({ studentId, lessonId }) {
    const { data, error } = await supabase
      .from("lesson_progress")
      .update({
        completed: false,
        completed_at: null,
      })
      .eq("student_id", studentId)
      .eq("lesson_id", lessonId)
      .select()
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  /**
   * Get all completed lesson progress
   * for a specific course.
   */
  async getCompletedLessonsByCourse({ studentId, courseId }) {
    // Step 1: Get all lesson IDs that belong to this course
    const { data: lessons, error: lessonsErr } = await supabase
      .from("lessons")
      .select("id, modules!inner(course_id)")
      .eq("modules.course_id", courseId);

    if (lessonsErr) throw lessonsErr;

    const lessonIds = (lessons || []).map((l) => l.id);
    if (lessonIds.length === 0) return [];

    // Step 2: Get completed progress records for those lessons
    const { data, error } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("student_id", studentId)
      .eq("completed", true)
      .in("lesson_id", lessonIds);

    if (error) throw error;

    return data;
  }

  /**
   * Get progress of a single lesson.
   */
  async getLessonProgress({ studentId, lessonId }) {
    const { data, error } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("student_id", studentId)
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (error) throw error;

    return data;
  }
}

const lessonProgressService = new LessonProgressService();

export default lessonProgressService;
