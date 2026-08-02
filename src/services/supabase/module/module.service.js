import { supabase } from "../supabaseClient";

// Database operations for modules (create, read, update, delete)
class ModuleService {
  // Save a new module to the database
  async createModule({ courseId, title, description, position }) {
    const { data, error } = await supabase
      .from("modules")
      .insert({
        course_id: courseId,
        title,
        description,
        position,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get all modules for a course
  async getCourseModules({ courseId }) {
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .order("position", { ascending: true });

    if (error) throw error;
    return data;
  }

  // Get a single module by ID
  async getModuleById({ moduleId }) {
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("id", moduleId)
      .single();

    if (error) throw error;
    return data;
  }

  // Update a module
  async updateModule({ moduleId, moduleData }) {
    const { data, error } = await supabase
      .from("modules")
      .update({ ...moduleData })
      .eq("id", moduleId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update module order after drag and drop
  async updateModulePositions({ reorderedModules }) {
    if (!Array.isArray(reorderedModules) || reorderedModules.length === 0) {
      throw new Error("Invalid reordered modules data.");
    }

    await Promise.all(
      reorderedModules.map(async ({ id, position }) => {
        const { error } = await supabase
          .from("modules")
          .update({ position })
          .eq("id", id);
        if (error) throw error;
      }),
    );

    return true;
  }

  // Delete a module (lessons are deleted automatically)
  async deleteModule({ moduleId }) {
    const { error } = await supabase
      .from("modules")
      .delete()
      .eq("id", moduleId);

    if (error) throw error;
    return true;
  }
}

const moduleService = new ModuleService();

export default moduleService;
