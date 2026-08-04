import { supabase } from "../supabaseClient";

class AssignmentStorage {
  // upload assignment attachment
  async uploadAttachment(filePath, file) {
    if (!filePath) throw new Error("Invalid file path.");
    if (!file) throw new Error("File is required.");

    const { data, error } = await supabase.storage
      .from("assignment-files")
      .upload(filePath, file, {
        cacheControl: 3600,
        upsert: false,
      });

    if (error) throw error;

    return data.path;
  }

  // delete assignment attachment
  async deleteAttachment(filePath) {
    if (!filePath) throw new Error("Invalid file path.");

    const { error } = await supabase.storage
      .from("assignment-files")
      .remove([filePath]);

    if (error) throw error;
    return true;
  }
  // get attachment url
  async getAttachmentUrl(filePath) {
    if (!filePath) throw new Error("Invalid file path.");

    const { data, error } = await supabase.storage
      .from("assignment-files")
      .createSignedUrl(filePath, 60 * 60);

    if (error) throw error;

    return data.signedUrl;
  }
}

const assignmentStorage = new AssignmentStorage();
export default assignmentStorage;
