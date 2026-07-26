import { supabase } from "../supabaseClient";

class ModuleService {
  // create a module
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

    if (error) {
      throw error;
    }

    return data;
  }

  // get CourseModules
  async getCourseModules({ courseId }) {
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .order("position", { ascending: true });

    if (error) throw error;

    return data;
  }

  // get a single module
  async getModuleById({ moduleId }) {
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("id", moduleId)
      .single();

    if (error) throw error;

    return data;
  }

  // update module data
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

  // update module positions (reorder)
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

        if (error) {
          throw error;
        }
      }),
    );

    return true;
  }

  // delete module
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
