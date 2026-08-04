import { supabase } from "../supabaseClient";

// Database operations for assignment submissions (create, read, update, delete)
class SubmissionService {
  // Student methods

  // Saves a student's submission for an assignment
  async submitAssignment({
    assignmentId,
    studentId,
    submissionText,
    fileName,
    filePath,
  }) {
    const { data, error } = await supabase
      .from("assignment_submissions")
      .insert({
        assignment_id: assignmentId,
        student_id: studentId,
        submission_text: submissionText,
        file_name: fileName,
        file_path: filePath,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update a submission
  async updateSubmission({ submissionId, submissionText, fileName, filePath }) {
    const { data, error } = await supabase
      .from("assignment_submissions")
      .update({
        submission_text: submissionText,
        file_name: fileName,
        file_path: filePath,
      })
      .eq("id", submissionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete a submission from the database
  async deleteSubmission({ submissionId }) {
    const { error } = await supabase
      .from("assignment_submissions")
      .delete()
      .eq("id", submissionId);

    if (error) throw error;
    return true;
  }
  // Get all submissions by the current student for an assignment
  async getMySubmission({ assignmentId, studentId }) {
    const { data, error } = await supabase
      .from("assignment_submissions")
      .select(
        `
*,assignments (
    id,
    title,
    due_date,
    max_score,
    module_id,
    modules (
      id,
      title,
      course_id
    )
  )
`,
      )
      .eq("assignment_id", assignmentId)
      .eq("student_id", studentId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
  // Get all submissions of the current student
  async getMySubmissions({ studentId }) {
    const { data, error } = await supabase
      .from("assignment_submissions")
      .select(
        `
  *,
  assignments (
    id,
    title,
    due_date,
    max_score,
    module_id,
    modules (
      id,
      title,
      course_id
    )
  )
`,
      )
      .eq("student_id", studentId)
      .order("submitted_at", {
        ascending: false,
      });

    if (error) throw error;
    return data;
  }

  // Teacher methods

  // Get every student's submission for an assignment
  async getAssignmentSubmissions({ assignmentId }) {
    const { data, error } = await supabase
      .from("assignment_submissions")
      .select(
        `
  *,
  users (
    id,
    full_name,
    email,
    avatar_url
  )
`,
      )
      .eq("assignment_id", assignmentId)
      .order("submitted_at", {
        ascending: false,
      });

    if (error) throw error;
    return data;
  }
  // Get a single submission by ID
  async getSubmission({ submissionId }) {
    const { data, error } = await supabase
      .from("assignment_submissions")
      .select(
        `
  *,
  users (
    id,
    full_name,
    email,
    avatar_url
  ),
  assignments (
    id,
    title,
    due_date,
    max_score,
    module_id,
    modules (
      id,
      title,
      course_id
    )
  )
`,
      )
      .eq("id", submissionId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
  // Grade a submission and record score, feedback
  async gradeSubmission({ submissionId, score, feedback }) {
    const { data, error } = await supabase
      .from("assignment_submissions")
      .update({
        score,
        feedback,
        status: "graded",
        graded_at: new Date().toISOString(), //timestamptz
      })
      .eq("id", submissionId)
      .select(
        `
  *,
  users (
    id,
    full_name,
    email,
    avatar_url
  ),
  assignments (
    id,
    title,
    due_date,
    max_score,
    module_id,
    modules (
      id,
      title,
      course_id
    )
  )
`,
      )
      .single();

    if (error) throw error;
    return data;
  }
}

const submissionService = new SubmissionService();
export default submissionService;
