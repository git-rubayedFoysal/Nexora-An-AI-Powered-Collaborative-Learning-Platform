import { supabase } from "../supabaseClient";

// Database operations for assignments (create, read, update, delete)
class AssignmentService {
  // Save a new assignment to the database
  async createAssignment({
    moduleId,
    title,
    description,
    instructions,
    attachmentName,
    attachmentPath,
    dueDate,
    maxScore,
    position,
  }) {
    const { data, error } = await supabase
      .from("assignments")
      .insert({
        module_id: moduleId,
        title,
        description,
        instructions,
        attachment_name: attachmentName,
        attachment_path: attachmentPath,
        due_date: dueDate,
        max_score: maxScore,
        position,
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  // Update an assignment
  async updateAssignment({ assignmentId, assignmentData }) {
    const { data, error } = await supabase
      .from("assignments")
      .update({ ...assignmentData })
      .eq("id", assignmentId)
      .select()
      .single();

    if (error) throw error;

    return data;
  }
  // Delete an assignment from the database
  async deleteAssignment({ assignmentId }) {
    const { error } = await supabase
      .from("assignments")
      .delete()
      .eq("id", assignmentId);

    if (error) throw error;
    return true;
  }
  // Get a single assignment by ID
  async getAssignment({ assignmentId }) {
    const { data, error } = await supabase
      .from("assignments")
      .select(
        `
  *,
  modules (
    id,
    title,
    course_id,
    courses (
      id,
      title
    )
  )
`,
      )
      .eq("id", assignmentId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
  // Get all assignments for a module
  async getModuleAssignments({ moduleId }) {
    const { data, error } = await supabase
      .from("assignments")
      .select(
        `
  *,
  modules (
    id,
    title,
    course_id
  )
`,
      )
      .eq("module_id", moduleId)
      .order("position", { ascending: true });

    if (error) throw error;

    return data;
  }

  // Get all assignments for a course
  async getCourseAssignments({ courseId }) {
    const { data, error } = await supabase
      .from("assignments")
      .select(
        `
  *,
  modules!inner(
    id,
    title,
    course_id
  )
`,
      )
      .eq("modules.course_id", courseId)
      .order("position");

    if (error) throw error;
    return data;
  }

  // Update assignment order after drag and drop
  async updateAssignmentPositions({ reorderedAssignments }) {
    if (
      !Array.isArray(reorderedAssignments) ||
      reorderedAssignments.length === 0
    ) {
      throw new Error("Invalid reordered assignments data.");
    }

    await Promise.all(
      reorderedAssignments.map(async ({ id, position }) => {
        const { error } = await supabase
          .from("assignments")
          .update({ position })
          .eq("id", id);

        if (error) throw error;
      }),
    );
    return true;
  }
}

const assignmentService = new AssignmentService();

export default assignmentService;
