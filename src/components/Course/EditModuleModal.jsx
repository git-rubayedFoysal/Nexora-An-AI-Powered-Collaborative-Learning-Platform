// Edit module — thin wrapper around ModuleModal with module data
import { ModuleModal } from "../index";

function EditModuleModal({ open, onClose, courseId, module }) {
  return (
    <ModuleModal
      open={open}
      onClose={onClose}
      courseId={courseId}
      module={module}
    />
  );
}

export default EditModuleModal;
