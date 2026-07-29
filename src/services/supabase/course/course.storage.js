import { supabase } from "../supabaseClient";

// Upload, delete, and get URLs for course thumbnails
class CourseStorage {
  // Upload a thumbnail image
  async uploadThumbnail(file, filePath) {
    const { data, error } = await supabase.storage
      .from("course-thumbnails")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;
    return data.path;
  }

  // Delete a thumbnail
  async deleteThumbnail(filePath) {
    const { error } = await supabase.storage
      .from("course-thumbnails")
      .remove([filePath]);

    if (error) throw error;
    return true;
  }

  // Get the public URL for a thumbnail
  getThumbnailUrl(filePath) {
    const { data } = supabase.storage
      .from("course-thumbnails")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
}

const courseStorage = new CourseStorage();

export default courseStorage;
