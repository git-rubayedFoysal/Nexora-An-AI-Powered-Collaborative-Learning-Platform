import { supabase } from "../supabaseClient";

// Upload, delete, and get URLs for lesson files (videos and PDFs)
class LessonStorage {
  // Upload a video file
  async uploadVideo(filePath, videoFile) {
    if (!filePath) throw new Error("Invalid file path.");
    if (!videoFile) throw new Error("Video file is required.");

    const { data, error } = await supabase.storage
      .from("lesson-videos")
      .upload(filePath, videoFile, {
        cacheControl: 3600,
        upsert: false,
      });

    if (error) throw error;
    return data.path;
  }

  // Delete a video file
  async deleteVideo(filePath) {
    if (!filePath) throw new Error("Invalid file path.");

    const { error } = await supabase.storage
      .from("lesson-videos")
      .remove([filePath]);

    if (error) throw error;
    return true;
  }

  // Get the public URL for a video
  getVideoUrl(filePath) {
    if (!filePath) throw new Error("Invalid file path.");

    const { data } = supabase.storage
      .from("lesson-videos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // Upload a PDF file
  async uploadPdf(filePath, pdfFile) {
    if (!filePath) throw new Error("Invalid file path.");
    if (!pdfFile) throw new Error("PDF file is required.");

    const { data, error } = await supabase.storage
      .from("lesson-files")
      .upload(filePath, pdfFile, {
        cacheControl: 3600,
        upsert: false,
      });

    if (error) throw error;
    return data.path;
  }

  // Delete a PDF file
  async deletePdf(filePath) {
    if (!filePath) throw new Error("Invalid file path.");

    const { error } = await supabase.storage
      .from("lesson-files")
      .remove([filePath]);

    if (error) throw error;
    return true;
  }

  // Get the public URL for a PDF
  getPdfUrl(filePath) {
    if (!filePath) throw new Error("Invalid file path.");

    const { data } = supabase.storage
      .from("lesson-files")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}

const lessonStorage = new LessonStorage();
export default lessonStorage;
