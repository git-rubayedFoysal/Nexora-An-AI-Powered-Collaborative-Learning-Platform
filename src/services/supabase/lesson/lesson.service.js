import { supabase } from "../supabaseClient";

// Database operations for lessons (create, read, update, delete)
class LessonService {
  // Save a new lesson to the database
  async createLesson({
    moduleId,
    title,
    description,
    videoPath,
    videoName,
    pdfPath,
    pdfName,
    isPreview,
    duration,
    position,
  }) {
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        module_id: moduleId,
        title,
        description,
        video_path: videoPath,
        video_name: videoName,
        pdf_path: pdfPath,
        pdf_name: pdfName,
        is_preview: isPreview,
        duration,
        position,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all lessons for a module
  async getModuleLessons({ moduleId }) {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("module_id", moduleId)
      .order("position", { ascending: true });

    if (error) throw error;
    return data;
  }

  // Get a single lesson by ID
  async getLessonById({ lessonId }) {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .single();

    if (error) throw error;
    return data;
  }

  // Update a lesson
  async updateLesson({ lessonId, lessonData }) {
    const { data, error } = await supabase
      .from("lessons")
      .update({ ...lessonData })
      .eq("id", lessonId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update lesson order after drag and drop
  async updateLessonPositions({ reorderedLessons }) {
    if (!Array.isArray(reorderedLessons) || reorderedLessons.length === 0) {
      throw new Error("Invalid reordered modules data.");
    }

    await Promise.all(
      reorderedLessons.map(async ({ id, position }) => {
        const { error } = await supabase
          .from("lessons")
          .update({ position })
          .eq("id", id);
        if (error) throw error;
      }),
    );

    return true;
  }

  // Delete a lesson from the database
  async deleteLesson({ lessonId }) {
    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", lessonId);

    if (error) throw error;
    return true;
  }
}

const lessonService = new LessonService();
export default lessonService;
