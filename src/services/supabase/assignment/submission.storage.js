import { supabase } from "../supabaseClient";

// Storage operations for submission files (upload, delete, URL)
class SubmissionStorage {
  // Upload a submission file to storage
  async uploadSubmission(filePath, file) {
    if (!filePath) throw new Error("Invalid file path.");
    if (!file) throw new Error("File is required.");

    const { data, error } = await supabase.storage
      .from("submission-files")
      .upload(filePath, file, {
        cacheControl: 3600,
        upsert: false,
      });

    if (error) throw error;
    return data.path;
  }

  // Delete a submission file from storage
  async deleteSubmission(filePath) {
    if (!filePath) throw new Error("Invalid file path");
    const { error } = await supabase.storage
      .from("submission-files")
      .remove([filePath]);

    if (error) throw error;
    return true;
  }

  // Get a signed URL for a submission file
  async getSubmissionUrl(filePath) {
    if (!filePath) throw new Error("Invalid file path.");

    const { data, error } = await supabase.storage
      .from("submission-files")
      .createSignedUrl(filePath, 60 * 60);

    if (error) throw error;

    return data.signedUrl;
  }
}

const submissionStorage = new SubmissionStorage();
export default submissionStorage;
