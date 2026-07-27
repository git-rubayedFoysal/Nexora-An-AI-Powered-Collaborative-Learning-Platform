import { supabase } from "../supabaseClient";

class LessonStorage {
  // Lesson Video

  // upload video
  async uploadVideo(filePath, videoFile) {
    if (!filePath) {
      throw new Error("Invalid file path.");
    }

    if (!videoFile) {
      throw new Error("Video file is required.");
    }

    const { data, error } = await supabase.storage
      .from("lesson-videos")
      .upload(filePath, videoFile, {
        cacheControl: 3600,
        upsert: false,
      });

    if (error) throw error;

    return data.path;
  }
  // delete video
  async deleteVideo(filePath) {
    if (!filePath) {
      throw new Error("Invalid file path.");
    }
    const { error } = await supabase.storage
      .from("lesson-videos")
      .remove([filePath]);

    if (error) throw error;
    return true;
  }

  // get video public url
  getVideoUrl(filePath) {
    if (!filePath) {
      throw new Error("Invalid file path.");
    }
    const { data } = supabase.storage
      .from("lesson-videos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // Lesson PDF

  // upload pdf
  async uploadPdf(filePath, pdfFile) {
    if (!filePath) {
      throw new Error("Invalid file path.");
    }

    if (!pdfFile) {
      throw new Error("PDF file is required.");
    }
    const { data, error } = await supabase.storage
      .from("lesson-files")
      .upload(filePath, pdfFile, {
        cacheControl: 3600,
        upsert: false,
      });

    if (error) throw error;

    return data.path;
  }
  // delete pdf
  async deletePdf(filePath) {
    if (!filePath) {
      throw new Error("Invalid file path.");
    }
    const { error } = await supabase.storage
      .from("lesson-files")
      .remove([filePath]);

    if (error) throw error;
    return true;
  }

  // get pdf public url
  getPdfUrl(filePath) {
    if (!filePath) {
      throw new Error("Invalid file path.");
    }
    const { data } = supabase.storage
      .from("lesson-files")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}

const lessonStorage = new LessonStorage();
export default lessonStorage;
