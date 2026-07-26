import { supabase } from "../supabaseClient";

class LessonService {
  // create lesson
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

  // get all lessons of a module
  async getModuleLessons({ moduleId }) {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("module_id", moduleId)
      .order("position", { ascending: true });

    if (error) throw error;

    return data;
  }

  // get a lesson by lessonId
  async getLessonById({ lessonId }) {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .single();

    if (error) throw error;

    return data;
  }

  // update a lesson
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

  // update lesson position(reorder)
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

  // delete lesson
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
